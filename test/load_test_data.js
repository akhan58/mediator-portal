// get postgresql connection
import pool from "../src/config/db.js";
import reviewsAccessLayer from "../src/models/reviewsAccessLayer.js";
import businessAccessLayer from "../src/models/businessesAccessLayer.js";

// Create the user in the database.
// This needs to be implemented into the backend access layer yesterday.
const user = await pool.query(
  `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`,
  ["Landon", "ljw210003@utd.edu", "123456seven"]
);

const new_user = await pool.query(`SELECT * FROM users WHERE "user_id" = $1`, [
  1,
]);

const user_id = new_user.rows[0].user_id;

console.log("User ID:");
console.log(user_id);

// Create a business with the review
// This may be redundant right now.
const business = await businessAccessLayer.createBusiness({
  businessName: "Contracting",
  userId: 1,
  facebookPageID: null,
  googlePlaceId: null,
  trustpilotBusinessId: null,
  yelpBusinessId: null,
});
const business_id = await businessAccessLayer.getBusinessByUserId(user_id);
console.log("business ID:");
console.log(business_id);

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
    rating: 3,
    content: "Its's okay!",
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
console.log("Reviews: ");
console.log(reviews);
process.exit();
