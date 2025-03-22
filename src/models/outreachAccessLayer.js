const pool = require("../config/db");

// CRUD functions
const outreachAccessLayer = {

    // CREATE
    async createOutreach ({review_ID, call_history, resolution_status}) {
        const results = await pool.query(`INSERT INTO outreach (review_ID, call_history, resolution_status) VALUES ($1, $2, 0) RETURNING *`, 
            [review_ID, call_history, resolution_status]);
        return results.rows;
    },

    // READ
    async getAllOutreach() {
        const results = await pool.query(`SELECT * FROM outreach`);
        return results.rows;
    },

    // READ: get outreach by ID
    async getOutreachById(outreach_ID) {
        const results =  await pool.query(`SELECT * FROM outreach WHERE "outreach_ID" = $1`,
            [outreach_ID]);
        return results.rows;
    },

    // READ: get outreach by reviewID
    async getOutreachByReviewId(review_ID) {
        const results =  await pool.query(`SELECT * FROM outreach WHERE "review_ID" = $1`,
            [review_ID]);
        return results.rows;
    },

    // READ: get outreach by status
    async getoutreachByStatus (resolution_status) {
        const results = await pool.query(`SELECT * FROM outreach WHERE "resolution_status" = $1,`,
            [resolution_status]);
            return results.rows;
    },

    // UPDATE: update Outreach status
    async updateOutreach ({outreach_ID, resolution_status}) {
        const results = await pool.query(`UPDATE outreach SET resolution_status=$2 WHERE "outreach_ID"=$1 RETURNING *`, 
            [outreach_ID, resolution_status]);
        return results.rows;
    },

    //DELETE
    async deleteOutreach(outreach_ID) {
        const results =  await pool.query(`DELETE FROM outreach where "outreach_ID" = $1`,
            [outreach_ID]);
        return results.rows;
    },
}

module.exports = outreachAccessLayer;