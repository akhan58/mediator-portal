const pool = require("../config/db");

// CRUD functions
const outreachAccessLayer = {

    // CREATE
    async createOutreach ({reviewId, callHistory, resolutionStatus}) {
        const results = await pool.query(`INSERT INTO outreach (review_id, call_history, resolution_status) VALUES ($1, $2, 0) RETURNING *`, 
            [reviewId, callHistory, resolutionStatus]);
        return results.rows;
    },

    // READ
    async getAllOutreach() {
        const results = await pool.query(`SELECT * FROM outreach`);
        return results.rows;
    },

    // READ: get outreach by ID
    async getOutreachById(outreachId) {
        const results =  await pool.query(`SELECT * FROM outreach WHERE "outreach_id" = $1`,
            [outreachId]);
        return results.rows;
    },

    // READ: get outreach by reviewID
    async getOutreachByReviewId(reviewId) {
        const results =  await pool.query(`SELECT * FROM outreach WHERE "review_id" = $1`,
            [reviewId]);
        return results.rows;
    },

    // READ: get outreach by status
    async getoutreachByStatus (resolutionStatus) {
        const results = await pool.query(`SELECT * FROM outreach WHERE "resolution_status" = $1,`,
            [resolutionStatus]);
            return results.rows;
    },

    // UPDATE: update Outreach status
    async updateOutreach ({outreachId, resolutionStatus}) {
        const results = await pool.query(`UPDATE outreach SET resolution_status=$2 WHERE "outreach_id"=$1 RETURNING *`, 
            [outreachId, resolutionStatus]);
        return results.rows;
    },

    //DELETE
    async deleteOutreach(outreachId) {  
        const results =  await pool.query(`DELETE FROM outreach WHERE "outreach_id" = $1`,
            [outreachId]);
        return results.rows;
    },
}

module.exports = outreachAccessLayer;