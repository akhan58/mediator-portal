const pool = require("../config/db");

// CRUD functions
const reviewsAccessLayer = {

    // CREATE
    async createReview({platform, rating, content, timestamp, sourceId, userId}) {
        const results = await pool.query(`INSERT INTO reviews (platform, rating, content, timestamp, source_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, 
            [platform, rating, content, timestamp, sourceId, userId]);
        return results.rows;
    },

    // READ all
    async getAllReview() {
        const results = await pool.query(`SELECT * FROM reviews`);
        return results.rows;
    },

    // READ: get reviews by review_id
    async getReviewById(reviewId) {
        const results =  await pool.query(`SELECT * FROM reviews WHERE "review_id" = $1`,
            [reviewId]);
        return results.rows;
    },

    // READ: get reviews by user_id
    async getReviewByUserId(userId) {
        const results =  await pool.query(`SELECT * FROM reviews WHERE "user_id" = $1`,
            [userId]);
        return results.rows;
    },

     // READ: get reviews by source_id
     async getReviewsByPlatformAndSourceId(platform, sourceId) {
        const results = await pool.query(`SELECT * FROM reviews WHERE "platform" = $1 AND "source_id" = $2`,
            [platform, sourceId]);
            return results.rows;
    },

    // READ: get reviews by platform
    async getReviewByPlatform(platform) {
        const results =  await pool.query(`SELECT * FROM reviews WHERE "platform" = $1`,
            [platform]);
        return results.rows;
    },

    // READ: get reviews by rating
    async getReviewByRating(rating) {
        const results =  await pool.query(`SELECT * FROM reviews WHERE "rating" = $1`,
            [rating]);
        return results.rows;
    },

    // READ: get reviews by platform & rating
    async getReviewByPlatformAndRating(platform, rating) {
        const results =  await pool.query(`SELECT * FROM reviews WHERE "platform" = $1 AND "rating" = $2`,
            [platform, rating]);
        return results.rows;
    },

    // UPDATE review
    async updateReview({reviewId, rating, content}) {
        const results = await pool.query(`UPDATE reviews SET rating=$2, content=$3 WHERE "review_id"=$1 RETURNING *`, 
            [reviewId, rating, content]);
        return results.rows;
    },

    // DELETE review
    async deleteReview(reviewId) {
        const results =  await pool.query(`DELETE FROM reviews WHERE "review_id" = $1`,
            [reviewId]);
        return results.rows;
    },
}

module.exports = reviewsAccessLayer;