const pool = require("../config/db");

// CRUD functions
const disputesAccessLayer = {

    // CREATE
    async createDispute ({review_id, flagged_reason}) {
        const results = await pool.query(`INSERT INTO disputes (review_id, flagged_reason, dispute_status) VALUES ($1, $2, 0) RETURNING *`, 
            [review_id, flagged_reason]);
        return results.rows;
    },

    // READ
    async getAllDisputes() {
        const results = await pool.query(`SELECT * FROM disputes`);
        return results.rows;
    },

    // READ: get disputes by ID
    async getDisputeById(dispute_id) {
        const results =  await pool.query(`SELECT * FROM disputes WHERE "dispute_id" = $1`,
            [dispute_id]);
        return results.rows;
    },

    // READ: get disputes by reviewID
    async getDisputeByReviewId(review_id) {
        const results =  await pool.query(`SELECT * FROM disputes WHERE "review_id" = $1`,
            [review_id]);
        return results.rows;
    },

    // READ: get disputes by status
    async getDisputesByStatus (dispute_status) {
        const results = await pool.query(`SELECT * FROM disputes WHERE "dispute_status" = $1`,
            [dispute_status]);
            return results.rows;
    },

    // UPDATE: update dispute status
    async updateDispute ({dispute_id, dispute_status}) {
        const results = await pool.query(`UPDATE disputes SET dispute_status=$2 WHERE "dispute_id"=$1 RETURNING *`, 
            [dispute_id, dispute_status]);
        return results.rows;
    },

    //DELETE
    async deleteDispute(dispute_id) {
        const results =  await pool.query(`DELETE FROM disputes WHERE "dispute_id" = $1`,
            [dispute_id]);
        return results.rows;
    },
}

module.exports = disputesAccessLayer;