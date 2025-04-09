const pool = require("../config/db");

// CRUD functions
const interactionsAccessLayer = {

    // CREATE
    async createInteraction ({reviewId, responseText, userId}) {
        const results = await pool.query(`INSERT INTO interactions (review_id, response_text, user_id) VALUES ($1, $2, $3) RETURNING *`, 
            [reviewId, responseText, userId]);
        return results.rows;
    },

    // READ
    async getAllinteractions() {
        const results = await pool.query(`SELECT * FROM interactions`);
        return results.rows;
    },

    // READ: get interactions by response_id
    async getInteractionById(responseId) {
        const results =  await pool.query(`SELECT * FROM interactions WHERE "response_id" = $1`,
            [responseId]);
        return results.rows;
    },

    // READ: get interactions by review_id
    async getInteractionByReviewId(reviewId) {
        const results =  await pool.query(`SELECT * FROM interactions WHERE "review_id" = $1`,
            [reviewId]);
        return results.rows;
    },

    // READ: get interactions by review_id
    async getInteractionByUserId(userId) {
        const results =  await pool.query(`SELECT * FROM interactions WHERE "user_id" = $1`,
            [userId]);
        return results.rows;
    },

    // UPDATE: update response text
    async updateResponseText ({responseId, responseText}) {
        const results = await pool.query(`UPDATE interactions SET response_text=$2 WHERE "response_id"=$1 RETURNING *`, 
            [responseId, responseText]);
        return results.rows;
    },

    //DELETE
    async deleteInteraction(responseId) {
        const results =  await pool.query(`DELETE FROM interactions WHERE "response_id" = $1`,
            [responseId]);
        return results.rows;
    },
}

module.exports = interactionsAccessLayer;