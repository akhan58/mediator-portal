const pool = require("../config/db");

// CRUD functions
const responseAccessLayer = {

    // CREATE
    async createInteraction ({reviewId, responseText}) {
        const results = await pool.query(`INSERT INTO interactions (review_id, response_text) VALUES ($1, $2) RETURNING *`, 
            [reviewId, responseText]);
        return results.rows;
    },

    // READ
    async getAllinteractions() {
        const results = await pool.query(`SELECT * FROM interactions`);
        return results.rows;
    },

    // READ: get interactions by ID
    async getInteractionById(responseId) {
        const results =  await pool.query(`SELECT * FROM interactions WHERE "response_id" = $1`,
            [responseId]);
        return results.rows;
    },

    // READ: get interactions by reviewID
    async getInteractionByReviewId(reviewId) {
        const results =  await pool.query(`SELECT * FROM interactions WHERE "review_id" = $1`,
            [reviewId]);
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

module.exports = responseAccessLayer;