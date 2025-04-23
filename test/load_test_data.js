// Temporary script to emulate login and third party connections.
const pool = require("../src/config/db");
const reviewsAccessLayer = require("../src/models/reviewsAccessLayer");
const businessAccessLayer = require("../src/models/businessesAccessLayer.js");

const setup = async () => {
  // get postgresql connection

  // Create the user in the database.
  // This needs to be implemented into the backend access layer yesterday.
  const user = await pool.query(
    `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`,
    ["Landon", "ljw210003@utd.edu", "123456seven"],
  );

  const new_user = await pool.query(
    `SELECT * FROM users WHERE "user_id" = $1`,
    [1],
  );

  const user_id = new_user.rows[0].user_id;

  // The mock data to be uploaded to the database
  // I don't really know what sourceId is, so I set it to 1 in all cases.
  const mockReviews = [
    {
      platform: "Google",
      rating: 4,
      content: "Great service!",
      timestamp: "2025-01-01T06:00:00.000Z",
      sourceId: 1,
      userId: user_id,
    },
    {
      platform: "Yelp",
      rating: 5,
      content: "Amazing experience!",
      timestamp: "2025-01-02T06:00:00.000Z",
      sourceId: 1,
      userId: user_id,
    },
    {
      platform: "Trustpilot",
      rating: 1,
      content: "These guys are evil and criminals and should go to jail.",
      timestamp: "2025-01-03T06:00:00.000Z",
      sourceId: 1,
      userId: user_id,
    },
    {
      platform: "Facebook",
      rating: 2,
      content: "Could be better!",
      timestamp: "2025-01-04T06:00:00.000Z",
      sourceId: 1,
      userId: user_id,
    },
  ];

  for (const review of mockReviews) {
    const rev = await reviewsAccessLayer.createReview(review);
  }

  // Make sure we can get each review.
  const reviews = await reviewsAccessLayer.getReviewByUserId(user_id);
};

module.exports = setup;
