const pool = require("../config/db");

// CRUD functions
const businessAccessLayer = {
  // CREATE - populate business table in database
  async createBusiness({
    businessName,
    userId,
    facebookPageId,
    googlePlaceId,
    trustpilotBusinessUnitId,
    yelpBusinessId,
  }) {
    const results = await pool.query(
      `INSERT INTO businesses (business_name, user_id, facebook_page_id, google_place_id, trustpilot_businessunit_id, yelp_business_id) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        businessName,
        userId,
        facebookPageId,
        googlePlaceId,
        trustpilotBusinessUnitId,
        yelpBusinessId,
      ]
    );
    return results.rows[0];
  },

  // GET: retrieve business by user ID
  async getBusinessByUserId(userId) {
    const results = await pool.query(
      `SELECT * FROM businesses WHERE user_id = $1`,
      [userId]
    );
    return results.rows[0];
  },

  // Update business profile IDs
  async updateBusinessPlatformIds(
    businessId,
    { facebookPageId, googlePlaceId, trustpilotBusinessUnitId, yelpBusinessId }
  ) {
    const results = await pool.query(
      `UPDATE businesses 
            SET 
                facebook_page_id = COALESCE($2, facebook_page_id),
                google_place_id = COALESCE($3, google_place_id),
                trustpilot_businessunit_id = COALESCE($4, trustpilot_businessunit_id),
                yelp_business_id = COALESCE($5, yelp_business_id)
            WHERE business_id = $1 RETURNING *`,
      [
        businessId,
        facebookPageId,
        googlePlaceId,
        trustpilotBusinessUnitId,
        yelpBusinessId,
      ]
    );
    return results.rows[0];
  },
};

module.exports = businessAccessLayer;
