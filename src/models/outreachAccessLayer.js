const pool = require("../config/db");

// CRUD functions
const outreachAccessLayer = {

    // CREATE
    async createOutreach ({review_id, call_history, resolution_status}) {
        const results = await pool.query(`INSERT INTO outreach (review_id, call_history, resolution_status) VALUES ($1, $2, 0) RETURNING *`, 
            [review_id, call_history, resolution_status]);
        return results.rows;
    },

    // READ
    async getAllOutreach() {
        const results = await pool.query(`SELECT * FROM outreach`);
        return results.rows;
    },

    // READ: get outreach by ID
    async getOutreachById(outreach_id) {
        const results =  await pool.query(`SELECT * FROM outreach WHERE "outreach_id" = $1`,
            [outreach_id]);
        return results.rows;
    },

    // READ: get outreach by reviewID
    async getOutreachByReviewId(review_id) {
        const results =  await pool.query(`SELECT * FROM outreach WHERE "review_id" = $1`,
            [review_id]);
        return results.rows;
    },

    // READ: get outreach by status
    async getoutreachByStatus (resolution_status) {
        const results = await pool.query(`SELECT * FROM outreach WHERE "resolution_status" = $1,`,
            [resolution_status]);
            return results.rows;
    },

    // UPDATE: update Outreach status
    async updateOutreach ({outreach_id, resolution_status}) {
        const results = await pool.query(`UPDATE outreach SET resolution_status=$2 WHERE "outreach_id"=$1 RETURNING *`, 
            [outreach_id, resolution_status]);
        return results.rows;
    },

    //DELETE
    async deleteOutreach(outreach_id) {
        const results =  await pool.query(`DELETE FROM outreach WHERE "outreach_id" = $1`,
            [outreach_id]);
        return results.rows;
    },
}

module.exports = outreachAccessLayer;