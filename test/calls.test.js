const axios = require("axios");
const load_test_data = require("./load_test_data");
const reset_database = require("./reset_database");

// This script serves as a mock frontend to test our endpoints.
// Each test is designed so that API calls and flows will be similar to what should be implemented in the frontend.
// These tests are also likely temporary until we can automate tests with git actions.

// This test depends on running load_test_data first.
// That file will create an account with a business and add mock reviews.

beforeEach(async () => {
  await load_test_data();
});

// All tests reset the database. Use at your own peril.
afterEach(async () => {
  await reset_database();
});

const BACKEND_URI = "http://localhost:5000";

// we STILL don't have an endpoint to get reviews by user_id,
// so we get all reviews in this test.
test("Retrieve user reviews", async () => {
  try {
    const response = await axios.get(BACKEND_URI + "/api/reviews/all");
    var count = 1;
    for (review of response.data) {
      expect(review.review_id).toBe(count);
      count = count + 1;
    }
  } catch (error) {
    console.log(error);
    expect(true).toBe(false); // Manually fail the test
  }
});

// Test responding to reviews
test("Responding to reviews", async () => {
  // First, get our reviews.
  try {
    const response = await axios.get(BACKEND_URI + "/api/reviews/all");
    // Then, pick a review to respond to.
    // We pick review 4 because it has 2 stars.
    const review = response.data[3];

    // The user writes their reply.
    const reply = "Your review sucks, and you smell.";

    // The user hits the 'reply' button, which will then respond to the review.
    const respond = await axios({
      method: "post",
      url: BACKEND_URI + "/api/interactions/respond",
      headers: {}, // TODO - add headers when we have proper auth
      data: {
        reviewId: 4,
        responseText: reply,
      },
    });
    console.log(respond);

    // TODO - finish completing test when above code works.
  } catch (error) {
    console.log(error);
    expect(true).toBe(false); // Manually fail the test
  }
});
