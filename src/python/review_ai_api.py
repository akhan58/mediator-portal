import openai, chromadb, tiktoken, numpy as np, json, os

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if OPENAI_API_KEY == None or OPENAI_API_KEY.strip() == "":
    raise Exception("ERROR: OPENAI_API_KEY Environment variable is not set.")



openai.api_key = OPENAI_API_KEY
chroma_client = chromadb.PersistentClient(path="./chroma_db")

collections = {
        "google": chroma_client.get_or_create_collection(name="google_policy_embeddings"),
        "meta": chroma_client.get_or_create_collection(name="meta_policy_embeddings"),
        "yelp": chroma_client.get_or_create_collection(name="yelp_policy_embeddings")
    }


def get_embedding(text):
    response = openai.embeddings.create(model="text-embedding-3-large", input=text)
    
    #print(response)

    return response.data[0].embedding


def load_policies():
    with open("./policies/policies.json", 'r') as f:
        website_policies = f.read()
    f.close()

    website_policies = json.loads(website_policies)

    

    for website, policies in website_policies.items():
        for idx, policy in enumerate(policies):
            embedding = get_embedding(policy)
            collections[website].add(
                ids=[f"{website}_{idx}"],
                embeddings=[embedding],
                documents=[policy]
            )

def find_relevant_policies_chroma(review, website, top_k=3, min_score=0.75):
    review_embedding = get_embedding(review)
    collection = collections.get(website)
    
    if collection:
        results = collection.query(
            query_embeddings=[review_embedding],
            n_results=top_k
        )
        return results["documents"][0]
    else:
        return []

#

def load_context(website):
    filename = f"{website}_review_policies.txt"
    with open(filename, 'r') as f:
        content = f.read()
    f.close()
    return content


def count_tokens(text, model="gpt-4o-mini"):
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))

def analyze_review(review, website):
    relevant_policies = find_relevant_policies_chroma(review, website)
    prompt = (
        f"Analyze this user's review: \"{review}\" and return the list of violated policy categories from the following list and the {website} review policies:"
        f"Suspected violated policy categories: {relevant_policies}"
        'Follow the exact json format for your answer: ["violated_policy_category_1", ..., ], "policy_violation_reason": "Provide a reason or a concrete policy that was violated by the review, keep empty if it did not violate any of the rules"'
    )

    print(f"Tokens Used: {count_tokens(prompt)}")


    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{ "role": "system", "content": f"You're a {website} moderation assistant. Your goal is to evaluate provided user reviews based on the provided website review policies."},
                  {"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content

def main():
    #load_policies()
    print(analyze_review("This product is okay I guess, although it did break after 2 months", "google"))
    


if __name__ == "__main__":
    main()