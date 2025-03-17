const pool = require("../config/db");

// CRUD functions
const dataAccessLayer = {

    //CREATE
    async createReview ({platform, rating, content, timestamp}) {
        const results = await pool.query(`INSERT INTO reviews (platform, rating, content, timestamp) VALUES ($1, $2, $3, $4) RETURNING *`, 
            [platform, rating, content, timestamp]);
        return results.rows;
    },

    //READ
    async getAllReview() {
        const results = await pool.query(`SELECT * FROM reviews`);
        return results.rows;
    },

    //READ
    async getReviewById(review_ID) {
        const results =  await pool.query(`SELECT * FROM reviews where "review_ID" = $1`,
            [review_ID]);
        return results.rows;
    },

    //UPDATE
    async updateReview ({review_ID, rating, content}) {
        const results = await pool.query(`UPDATE reviews SET rating=$2, content=$3 WHERE "review_ID"=$1 RETURNING *`, 
            [review_ID, rating, content]);
        return results.rows;
    },

    //DELETE
    async deleteReview(review_ID) {
        const results =  await pool.query(`DELETE FROM reviews where "review_ID" = $1`, [review_ID]);
        return results.rows;
    },
}

module.exports = dataAccessLayer;