const pool = require("../config/db");

// CRUD functions
const disputesAccessLayer = {

    // CREATE
    async createDispute ({reviewId, flaggedReason}) {
        const results = await pool.query(`INSERT INTO disputes (review_id, flagged_reason, dispute_status) VALUES ($1, $2, 0) RETURNING *`, 
            [reviewId, flaggedReason]);
        return results.rows;
    },

    // READ
    async getAllDisputes() {
        const results = await pool.query(`SELECT * FROM disputes`);
        return results.rows;
    },

    // READ: get disputes by dispute_id
    async getDisputeById(disputeId) {
        const results =  await pool.query(`SELECT * FROM disputes WHERE "dispute_id" = $1`,
            [disputeId]);
        return results.rows;
    },

    // READ: get disputes by review_iD
    async getDisputeByReviewId(reviewId) {
        const results =  await pool.query(`SELECT * FROM disputes WHERE "review_id" = $1`,
            [reviewId]);
        return results.rows;
    },

    // READ: get disputes by status
    async getDisputesByStatus (disputeStatus) {
        const results = await pool.query(`SELECT * FROM disputes WHERE "dispute_status" = $1`,
            [disputeStatus]);
            return results.rows;
    },

    // UPDATE: update dispute status
    async updateDispute ({disputeId, disputeStatus}) {
        const results = await pool.query(`UPDATE disputes SET dispute_status=$2 WHERE "dispute_id"=$1 RETURNING *`, 
            [disputeId, disputeStatus]);
        return results.rows;
    },

    //DELETE
    async deleteDispute(disputeId) {
        const results =  await pool.query(`DELETE FROM disputes WHERE "dispute_id" = $1`,
            [disputeId]);
        return results.rows;
    },
}

module.exports = disputesAccessLayer;