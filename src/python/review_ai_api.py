import openai, chromadb, tiktoken, json, os, psycopg2

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

# saves analysis of flagged review in the disputes database
def save_review_analysis(review_id, analysis_json):
    try:
        conn = psycopg2.connect(
            host=os.getenv("HOST","localhost"),
            database=os.getenv("DATABASE", "MediatorPortal"),
            user=os.getenv("USER", "postgres"),
            password=os.getenv("PASSWORD", "root"),
            port=os.getenv("DB_PORT", 5432)
        )
        cur = conn.cursor()

        flagged_reason = ''
        for policy_json in analysis_json:
            flagged_reason = f"{flagged_reason} {policy_json['violated_policy_category']}:{policy_json['policy_violation_reason']}, "

        query = f'INSERT INTO public.disputes("review_ID", flagged_reason) VALUES (%s, %s)'
        cur.execute(query, (review_id, flagged_reason,))
        conn.commit()
        conn.close()
    except psycopg2.Error as e:
        print("Error inserting dispute: ", e)
    
# retrieves content, platform of a review from the database
def load_review(review_id):
    try:
        conn = psycopg2.connect(
            host=os.getenv("HOST","localhost"),
            database=os.getenv("DATABASE", "mediatorportal"),
            user=os.getenv("USER", "postgres"),
            password=os.getenv("PASSWORD", "root"),
            port=os.getenv("DB_PORT", 5432)
        )
        cur = conn.cursor()

        query = f'SELECT platform, content FROM public.reviews WHERE "review_ID"=%s'

        cur.execute(query, (review_id,))
        results = cur.fetchall()
        if len(results)==0:
            raise Exception(f"Review with review_id={review_id} was not found.")
        
        platform = results[0][0]
        content = results[0][1]
        conn.close()

        return content, platform


    except Exception as e:
        print("Error selecting review: ", e)


# Analyzes given review and returns a list of violated policies that are associated with it.
def analyze_review(review_id, review, platform):
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
    if len(json_result) > 0:
        save_review_analysis(review_id, json_result)

    return json_result

# Flask Service Connection for endpoints

app = Flask("GPT_Analysis")


# Endpoint to analyze review to see if it violates given platform policies
@app.route('/analyze-review', methods=['POST'])
def analyze_review_call():
    data = request.json
    review_id = data.get("review_id")

    content, platform = load_review(review_id)

    return jsonify(analyze_review(review_id, content, platform))

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