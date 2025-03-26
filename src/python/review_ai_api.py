import openai, chromadb, tiktoken, json, os

from flask import Flask, request, jsonify

# Model API

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


def load_policies(platform=""):
    path = os.path.dirname(os.path.abspath(__file__))
    with open(f"{path}/policies/policies.json", 'r') as f:
        website_policies = f.read()
    f.close()

    website_policies = json.loads(website_policies)

    
    for website, policies in website_policies.items():
        if website.lower() == platform.lower() or platform.strip() == "":
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

def analyze_review(review, platform):
    relevant_policies = find_relevant_policies_chroma(review, platform)
    prompt = (
        f"Analyze this user's review: \"{review}\" and return the list of violated policy categories from the following list and the {platform} review policies:"
        f"Suspected violated policy categories: {relevant_policies}"
        'You must always follow the exact json array format for your answer:  [ { "violated_policy_category" : "violated_policy_category_1", "policy_violation_reason": "Provide a concrete reason why this policy was violated by the review"}, ...] '
    )

    #print(f"Tokens Used: {count_tokens(prompt)}")


    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{ "role": "system", "content": f"You're a {platform} moderation assistant. Your goal is to evaluate provided user reviews based on the provided website review policies."},
                  {"role": "user", "content": prompt}]
    )

    #print(f"Model reply: \n {response.choices[0].message.content}")

    json_result = json.loads(response.choices[0].message.content)

    return json_result

# Flask Connection

app = Flask("GPT_Analysis")


# Endpoint to analyze review to see if it violates given platform policies
@app.route('/analyze-review', methods=['POST'])
def analyze_review_call():
    data = request.json
    review = data.get("review")
    platform = data.get("platform")

    return jsonify(analyze_review(review, platform))

# Endpoint to generate chroma-db with policy embeddings
@app.route('/generate-embeddings', methods=['POST'])
def generate_embeddings_call():
    data = request.json
    platform = data.get("platform", "")
    load_policies(platform)
    return jsonify({})



def main():
    app.run(debug=True, port=3500)



if __name__ == "__main__":
    main()