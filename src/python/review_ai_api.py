import openai, chromadb, tiktoken, json, os, psycopg2
from dotenv import load_dotenv

from flask import Flask, request, jsonify

# Model API connection

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


if OPENAI_API_KEY == None or OPENAI_API_KEY.strip() == "":
    raise Exception("ERROR: OPENAI_API_KEY Environment variable is not set.")

openai.api_key = OPENAI_API_KEY
chroma_client = chromadb.PersistentClient(path="./chroma_db")

# Database connection

conn = None

def get_postgres_conn():
    try:
        global conn

        if conn != None:
            return conn

        conn = psycopg2.connect(
            host=os.getenv("HOST"),
            database=os.getenv("DATABASE"),
            user=os.getenv("USER"),
            password=os.getenv("PASSWORD"),
            port=os.getenv("DB_PORT")
        )
        return conn
    except psycopg2.Error as e:
        print(f"Error connecting to postgres: {e}")



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
def find_relevant_policies_chroma(review, website, top_k=3, min_score=0.8):
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
'''
def save_review_analysis(review_id, analysis_json):
    try:
        con = get_postgres_conn()
        cur = con.cursor()

        flagged_reason = ''
        for policy_json in analysis_json:
            flagged_reason = f"{flagged_reason} {policy_json['violated_policy_category']}:{policy_json['policy_violation_reason']}, "

        query = f'INSERT INTO public.disputes("review_ID", flagged_reason) VALUES (%s, %s)'
        cur.execute(query, (review_id, flagged_reason,))
        con.commit()
    except psycopg2.Error as e:
        print("Error inserting dispute: ", e)

'''

# retrieves content, platform of a review from the database
def load_review(dispute_id=None, review_id=None):
    try:
        con = get_postgres_conn()
        cur = con.cursor()
        if dispute_id != None:
            query = f'SELECT r.platform, r.content FROM public.reviews r inner join public.disputes d on r.review_id = d.review_id where d.dispute_id=%s'
            cur.execute(query, (dispute_id,))
        
        elif review_id != None:
            query = f'SELECT r.platform, r.content FROM public.reviews r where r.review_id=%s'
            cur.execute(query, (review_id,))
        
        else:
            raise Exception(f"No load_review parameters provided.")
        
        results = cur.fetchall()
        if len(results)==0:
            raise Exception(f"Dispute with dispute_id={dispute_id} was not found.") 

        platform = results[0][0]
        content = results[0][1]

        return content, platform


    except Exception as e:
        print(f"Error selecting review: {e}")


# Analyzes given review and returns a JSON formatted list of "violation_type", "reasoning", "text", "confidence_score" for each policy violation
def analyze_review(review, platform):
    relevant_policies = find_relevant_policies_chroma(review, platform)

    prompt = (
        f"Analyze this user's review: \"{review}\" and return the list of violated policy categories from the following list and the {platform} review policies:"
        f"Suspected violated policy categories: {relevant_policies}"
        'You must always follow the exact json array format for your answer:  [ { "violation_type" : "Provide a concrete category of the violated policy based on the {platform} review policies", "reasoning": "Provide a concrete reason why this policy was violated by the review", "text":"Specific segment of the provided review that caused the noted policy violation that was stored in the field \"violation_type\"", "confidence_score":"Provide a confidence score that this concrete policy violation is true (from 0 to 1 with 3 digits precision where 0 means that this review does not violate the policy at all and 1 means the maximum confidence)"}, ...] '
    )

    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{ "role": "system", "content": f"You're a {platform} moderation assistant. Your goal is to evaluate provided user reviews based on the provided website review policies."},
                  {"role": "user", "content": prompt}]
    )

    response_content = response.choices[0].message.content

    try:
        json_result = json.loads(response_content)
    
    except Exception as e:
        return { "LLM_Response":response_content, "Error": str(e), "content":review, "platform":platform}   
    
    if json_result == None:
        return { "LLM_Response":response_content, "content":review, "platform":platform, "Error":f"Unable to parse the LMM response." }

    return json_result
'''
def save_flagged_reasons(dispute_id, json_result):
    try:
        con = get_postgres_conn()
        cur = con.cursor()

        flagged_reason = ''
        for policy_json in json_result:
            flagged_reason = f"{flagged_reason} {policy_json['violated_policy_category']}:{policy_json['policy_violation_reason']}; "

        query = f'update public.disputes set flagged_reason = %s where dispute_id=%s'
        cur.execute(query, (flagged_reason, dispute_id))
        con.commit()
    except psycopg2.Error as e:
        print(f"Error inserting dispute: {e}")
'''

# Flask Service Connection for endpoints

app = Flask("GPT_Analysis")


# Endpoint to analyze review to see if it violates given platform policies
'''
@app.route('/dispute-set-flags', methods=['POST'])
def dispute_set_flags_call():
    data = request.json
    dispute_id = data.get("dispute_id")

    content, platform = load_review(dispute_id=dispute_id)
    json_result = analyze_review(content, platform)
    if len(json_result) > 0:
        save_flagged_reasons(dispute_id, json_result)
    else:
        save_flagged_reasons(dispute_id, [{'violated_policy_category':"",'policy_violation_reason':"No policy violations found."}])
    return jsonify(json_result)
'''

@app.route('/analyze-review', methods=['POST'])
def analyze_review_call():
    data = request.json
    review_id = data.get("review_id")
    content, platform = load_review(review_id=review_id)
    json_result = analyze_review(content, platform)

    return jsonify(json_result)

@app.route('/analyze-review-text', methods=['POST'])
def analyze_review_text_call():
    data = request.json
    content = data.get("content")
    platform = data.get("platform")

    if content == None or content.strip() == "" or platform == None or platform.strip() == "":
        return jsonify({"Error":"Missing / Empty content or platform parameters.","Content":data})

    json_result = analyze_review(content, platform)
    '''
    analysis = ''
    for policy_json in json_result:
        analysis = f"{analysis} {policy_json['violated_policy_category']}:{policy_json['policy_violation_reason']}; "
    '''

    return jsonify(json_result)


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
