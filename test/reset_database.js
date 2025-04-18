const pool = require("../src/config/db");

const reset_database = async () => {
  // Truncate all tables.
  const truncate = await pool.query("TRUNCATE users CASCADE;");

  // Reset all iterators.
  const reset_users = await pool.query(
    'ALTER SEQUENCE public."Users_user_ID_seq" RESTART WITH 1;'
  );
  const reset_disputes = await pool.query(
    'ALTER SEQUENCE public."Disputes_dispute_ID_seq" RESTART WITH 1;'
  );
  const reset_reviews = await pool.query(
    'ALTER SEQUENCE public."Reviews_review_ID_seq" RESTART WITH 1;'
  );
  const reset_outreach = await pool.query(
    'ALTER SEQUENCE public."Outreach_outreach_ID_seq" RESTART WITH 1;'
  );
  const reset_interactions = await pool.query(
    "ALTER SEQUENCE public.interactions_response_id_seq RESTART WITH 1;"
  );
  const reset_businesses = await pool.query(
    "ALTER SEQUENCE public.businesses_business_id_seq RESTART WITH 1;"
  );
};

module.exports = reset_database;
