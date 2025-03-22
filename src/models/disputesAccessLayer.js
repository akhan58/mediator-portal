const pool = require("../config/db");

// CRUD functions
const disputesAccessLayer = {

    // CREATE
    async createDispute ({review_ID, flagged_reason, dispute_status}) {
        const results = await pool.query(`INSERT INTO disputes (review_ID, flagged_reason, dispute_status) VALUES ($1, $2, 0) RETURNING *`, 
            [review_ID, flagged_reason, dispute_status]);
        return results.rows;
    },

    // READ
    async getAllDisputes() {
        const results = await pool.query(`SELECT * FROM disputes`);
        return results.rows;
    },

    // READ: get disputes by ID
    async getDisputeById(dispute_ID) {
        const results =  await pool.query(`SELECT * FROM disputes WHERE "dipsute_ID" = $1`,
            [dispute_ID]);
        return results.rows;
    },

    // READ: get disputes by reviewID
    async getDisputeByReviewId(review_ID) {
        const results =  await pool.query(`SELECT * FROM disputes WHERE "review_ID" = $1`,
            [review_ID]);
        return results.rows;
    },

    // READ: get disputes by status
    async getDisputesByStatus (dispute_status) {
        const results = await pool.query(`SELECT * FROM disputes WHERE "dispute_status" = $1,`,
            [dispute_status]);
            return results.rows;
    },

    // UPDATE: update dispute status
    async updateDispute ({dispute_ID, dispute_status}) {
        const results = await pool.query(`UPDATE disputes SET dispute_status=$2 WHERE "dispute_ID"=$1 RETURNING *`, 
            [dispute_ID, dispute_status]);
        return results.rows;
    },

    //DELETE
    async deleteDispute(dispute_ID) {
        const results =  await pool.query(`DELETE FROM disputes where "dispute_ID" = $1`,
            [dispute_ID]);
        return results.rows;
    },
}

module.exports = disputesAccessLayer;