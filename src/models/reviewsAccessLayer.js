const pool = require("../config/db");

// CRUD functions
const reviewsAccessLayer = {

    // CREATE
    async createReview ({platform, rating, content, timestamp}) {
        const results = await pool.query(`INSERT INTO reviews (platform, rating, content, timestamp) VALUES ($1, $2, $3, $4) RETURNING *`, 
            [platform, rating, content, timestamp]);
        return results.rows;
    },

    // READ
    async getAllReview() {
        const results = await pool.query(`SELECT * FROM reviews`);
        return results.rows;
    },

    // READ: get reviews by ID
    async getReviewById(review_ID) {
        const results =  await pool.query(`SELECT * FROM reviews where "review_ID" = $1`,
            [review_ID]);
        return results.rows;
    },

    // READ: get reviews by platform
    async getReviewByPlatform(platform) {
        const results =  await pool.query(`SELECT * FROM reviews where "platform" = $1`,
            [platform]);
        return results.rows;
    },

    // READ: get reviews by rating
    async getReviewByRating(rating) {
        const results =  await pool.query(`SELECT * FROM reviews where "rating" = $1`,
            [rating]);
        return results.rows;
    },

    // READ: get reviews by platform & rating
    async getReviewByPlatformAndRating(platform, rating) {
        const results =  await pool.query(`SELECT * FROM reviews where "platform" = $1 AND "rating" = $2`,
            [platform, rating]);
        return results.rows;
    },

    // UPDATE
    async updateReview ({review_ID, rating, content}) {
        const results = await pool.query(`UPDATE reviews SET rating=$2, content=$3 WHERE "review_ID"=$1 RETURNING *`, 
            [review_ID, rating, content]);
        return results.rows;
    },

    // DELETE
    async deleteReview(review_ID) {
        const results =  await pool.query(`DELETE FROM reviews where "review_ID" = $1`, [review_ID]);
        return results.rows;
    },
}

module.exports = reviewsAccessLayer;