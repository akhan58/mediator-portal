const pool = require("../config/db");

// CRUD functions
const reviewsAccessLayer = {
  // CREATE
  async createReview({
    platform,
    rating,
    content,
    timestamp,
    sourceId,
    userId,
  }) {
    const results = await pool.query(
      `INSERT INTO reviews (platform, rating, content, timestamp, source_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [platform, rating, content, timestamp, sourceId, userId],
    );
    return results.rows[0];
  },

  // READ all
  async getAllReview() {
    const results = await pool.query(`SELECT * FROM reviews`);
    return results.rows;
  },

  // READ: get reviews by review_id
  async getReviewById(reviewId) {
    const results = await pool.query(
      `SELECT * FROM reviews WHERE "review_id" = $1`,
      [reviewId],
    );
    return results.rows;
  },

  // READ: get reviews by user_id
  async getReviewByUserId(userId) {
    const results = await pool.query(
      `SELECT * FROM reviews WHERE "user_id" = $1`,
      [userId],
    );
    return results.rows;
  },

  // READ: get reviews by source_id
  async getReviewsByPlatformAndSourceId(platform, sourceId) {
    const results = await pool.query(
      `SELECT * FROM reviews WHERE "platform" = $1 AND "source_id" = $2`,
      [platform, sourceId],
    );
    return results.rows;
  },

  // READ: get reviews by platform
  async getReviewByPlatform(platform) {
    const results = await pool.query(
      `SELECT * FROM reviews WHERE "platform" = $1`,
      [platform],
    );
    return results.rows;
  },

  // READ: get reviews by rating
  async getReviewByRating(rating) {
    const results = await pool.query(
      `SELECT * FROM reviews WHERE "rating" = $1`,
      [rating],
    );
    return results.rows;
  },

  // READ: get reviews by platform & rating
  async getReviewByPlatformAndRating(platform, rating) {
    const results = await pool.query(
      `SELECT * FROM reviews WHERE "platform" = $1 AND "rating" = $2`,
      [platform, rating],
    );
    return results.rows;
  },

  // UPDATE review
  async updateReview({ reviewId, rating, content }) {
    const results = await pool.query(
      `UPDATE reviews SET rating=$2, content=$3 WHERE "review_id"=$1 RETURNING *`,
      [reviewId, rating, content],
    );
    return results.rows;
  },

  async updateReviewStatus({ reviewId, status }) {
    const results = await pool.query(
      `UPDATE reviews SET status = $2 WHERE "review_id" = $1 RETURNING *`,
      [reviewId, status],
    );
    return results.rows[0];
  },

  // DELETE review
  async deleteReview(reviewId) {
    const results = await pool.query(
      `DELETE FROM reviews WHERE "review_id" = $1`,
      [reviewId],
    );
    return results.rows;
  },

  // Build queries with filters
  /*
    async buildFilteredReviewsQuery(reviewFilters, disputeFilters) {
        const disputeFiltersJoin = disputeFilters.flaggedReason || disputeFilters.disputeStatus !== null;

        let query = `
            SELECT r.*
            FROM reviews r
        `;

        if (disputeFiltersJoin) {
            query += `LEFT JOIN disputes d ON r.review_id = d.review_id`;
        }

        query = ` WHERE 1=1`;
        
        const queryParams = [];
        let paramCounter = 1;
        
        // Apply basic filters
        if (reviewFilters.platform) {
            query += ` AND r.platform = $${paramCounter}`;
            queryParams.push(reviewFilters.platform);
            paramCounter++;
        }
        
        if (reviewFilters.rating) {
            query += ` AND r.rating = $${paramCounter}`;
            queryParams.push(reviewFilters.rating);
            paramCounter++;
        }
        
        if (reviewFilters.userId) {
            query += ` AND r.user_id = $${paramCounter}`;
            queryParams.push(reviewFilters.userId);
            paramCounter++;
        }
        
        // Apply dispute filters
        if (disputeFiltersJoin) {
            if (disputeFilters.flaggedReason) {
                query += ` AND d.flagged_reason IS NOT NULL`;
            }

            // Filter by specific dispute status
            if (disputeFilters.disputeStatus !== null) {
                query += ` AND d.dispute_status = $${paramCounter}`;
                queryParams.push(disputeFilters.disputeStatus);
                paramCounter++;
            }
        }
        
        return { 
            query, 
            queryParams,
            paramCounter 
        };
    },

    // Apply sorting to a query
    applySorting(query, sorting) {
        const validSortColumns = ['review_id', 'platform', 'rating', 'timestamp'];
        const sortColumn = validSortColumns.includes(sorting.sortBy) ? sorting.sortBy : 'timestamp';
        const sortDirection = sorting.sortOrder === 'ASC' ? 'ASC' : 'DESC';
            
        return `${query} ORDER BY r.${sortColumn} ${sortDirection}`;
    },

    // Apply pagination to a query
    applyPagination(query, queryParams, pagination, paramCounter) {
        const paginatedQuery = `${query} LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
        queryParams.push(pagination.limit, pagination.offset);
        return paginatedQuery;
    },

    // Count total records matching a query
    async countQueryResults(query, queryParams) {
        const countQuery = `SELECT COUNT(*) FROM (${query}) AS filtered_reviews`;
        const countResult = await pool.query(countQuery, queryParams);
        return parseInt(countResult.rows[0].count);
    },

    // Main function to get filtered, paginated, and sorted reviews
    async getFilteredReviews(reviewFilters, pagination, sorting, disputeFilters) {
        // Build the base query with filters
        const { query, queryParams, paramCounter } = await this.buildFilteredReviewsQuery(
            reviewFilters, 
            disputeFilters
        );
        
        // Count total matching records before applying pagination
        const totalCount = await this.countQueryResults(query, queryParams);
    
        // Apply sorting
        const sortedQuery = this.applySorting(query, sorting);
    
        // Apply pagination
        const paginatedQuery = this.applyPagination(
            sortedQuery, 
            queryParams, 
            pagination, 
            paramCounter
        );
    
        // Execute the final query
        const results = await pool.query(paginatedQuery, queryParams);
    
        return {
            reviews: results.rows,
            totalCount
        };
    }
    */
};

module.exports = reviewsAccessLayer;
