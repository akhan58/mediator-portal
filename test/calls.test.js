const axios = require("axios");
const load_test_data = require("./load_test_data");
const reset_database = require("./reset_database");

// This script serves as a mock frontend to test our endpoints.
// Each test is designed so that API calls and flows will be similar to what should be implemented in the frontend.
// These tests are also likely temporary until we can automate tests with git actions.

// This test depends on running load_test_data first.
// That file will create an account with a business and add mock reviews.
// Eventually we will write tests for authentication... whenever that is ready.
beforeEach(async () => {
  await load_test_data();
  const testName = expect.getState().currentTestName;
  console.log(
    `========================== ${testName} BEGIN ==========================`,
  );
});

// All tests reset the database. Use at your own peril.
afterEach(async () => {
  await reset_database();
  const testName = expect.getState().currentTestName;
  console.log(
    `========================== ${testName} END ==========================`,
  );
});

const BACKEND_URI = "http://localhost:5000";
const AI_BACKEND_URI = "http://127.0.0.1:3500";

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
        reviewId: review.review_id,
        responseText: reply,
      },
    });
    console.log(respond);
    expect(true).toBe(true);

    // TODO - finish completing test when above code works.
  } catch (error) {
    expect(true).toBe(false); // Manually fail the test
  }
});

test("Dispute a review", async () => {
  // First, get our reviews.
  try {
    const response = await axios.get(BACKEND_URI + "/api/reviews/all");
    // Then, pick a review to respond to.
    // We pick review 3 because it says we are evil and we should go to jail.
    const review = response.data[2];

    // Our system should automatically call this API key (I think...)
    // However, since we don't have connections, we do it manually here.
    // TODO - use the node endpoint for this instead of the python endpoint.
    const get_ai_feedback = await axios({
      method: "post",
      url: AI_BACKEND_URI + "/analyze-review-text",
      headers: {}, // TODO - add headers when we have proper auth
      data: {
        platform: review.platform,
        content: review.content,
      },
    });

    console.log("Got feedback: ");
    console.log(get_ai_feedback.data);

    // In this story, the user just uses the AI's feedback.
    const violation_type = get_ai_feedback.data.violation_type;

    // TODO - replace this with the actual endpoint.
    // This test is going to fail until we have an endpoint to create a dispute.
    expect(true).toBe(false);

    // The user writes their reply.
  } catch (error) {
    expect(true).toBe(false); // Manually fail the test
  }
}, 20000); // 20 second timeout. We need to determine how long is too long for these operations.

// I'm not going to test authentication until we have something that isn't a placeholder.
