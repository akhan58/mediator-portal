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
        "yelp": chroma_client.get_or_create_collection(name="yelp_policy_embeddings"),
        "trustpilot": chroma_client.get_or_create_collection(name="trustpilot_policy_embeddings")
    }

# Generates an embedding for given text
def get_embedding(text):
    response = openai.embeddings.create(model="text-embedding-3-large", input=text)

    return response.data[0].embedding

# Loads policies from given platform
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

# Embeds the review and finds top_k closest policy violations
def find_relevant_policies_chroma(review, website, top_k=4, min_score=0.9):
    review_embedding = get_embedding(review)
    collection = collections.get(website)
    
    if collection:
        results = collection.query(
            query_embeddings=[review_embedding],
            n_results=top_k
        )
        filtered_policies = []

        for i, score in enumerate(results["distances"][0]):
            if score >= min_score:
                filtered_policies.append(results["documents"][0][i])

        return filtered_policies
        #return results["documents"][0]
    else:
        return ["No highly relevant policies found."]

# Counts tokens for given operation
def count_tokens(text, model="gpt-4o-mini"):
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))

# Analyzes given review and returns a list of violated policies that are associated with it.
def analyze_review(review, platform):
    relevant_policies = find_relevant_policies_chroma(review, platform)
    prompt = (
        f"Analyze this user's review: \"{review}\" and return the list of violated policy categories from the following list and the {platform} review policies:"
        f"Suspected violated policy categories: {relevant_policies}"
        'You must always follow the exact json array format for your answer:  [ { "violated_policy_category" : "violated_policy_category_1", "policy_violation_reason": "Provide a concrete reason why this policy was violated by the review"}, ...] '
    )

    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{ "role": "system", "content": f"You're a {platform} moderation assistant. Your goal is to evaluate provided user reviews based on the provided website review policies."},
                  {"role": "user", "content": prompt}]
    )

    

    json_result = json.loads(response.choices[0].message.content)

    return json_result

# Flask Service Connection for endpoints

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