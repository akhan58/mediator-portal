const axios = require("axios");
const load_test_data = require("./load_test_data");
const reset_database = require("./reset_database");
const jwt = require("jsonwebtoken"); // DELETE THIS WHEN WE HAVE LOGIN THAT WORKS

// This script serves as a mock frontend to test our endpoints.
// Each test is designed so that API calls and flows will be similar to what should be implemented in the frontend.
// These tests are also likely temporary until we can automate tests with git actions.

// This test depends on running load_test_data first.
// That file will create an account with a business and add mock reviews.
// Eventually we will write tests for authentication... whenever that is ready.
beforeEach(async () => {
  await load_test_data();
});

// All tests reset the database. Use at your own peril.
afterEach(async () => {
  await reset_database();
});

const BACKEND_URI = "http://localhost:5000";
const AI_BACKEND_URI = "http://127.0.0.1:3500";
// manually make auth token here
// replace this when we have a better login system
const auth_token = jwt.sign(
  {
    user: "1", // matches user_id created in load_test_data.js
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1h",
  },
);
const auth_headers = {
  Authorization: `Bearer ${auth_token}`,
  "Content-Type": "application/json",
};

// Test our authentication middleware to reject requests without a token.
// We will do more tests eventually, but for an MVP this is enough.
test("Bad auth headers", async () => {
  try {
    const response = await axios.get(BACKEND_URI + "/api/reviews");
    // We want to catch an error with this test, so if we haven't caught the error by now, fail the test
    expect(true).toBe(false);
  } catch (error) {
    expect(error.response.status).toBe(403);
  }
});

// we STILL don't have an endpoint to get reviews by user_id,
// so we get all reviews in this test.
// This also acts to make sure our authentication works.
test("Retrieve user reviews", async () => {
  const response = await axios({
    method: "get",
    url: BACKEND_URI + "/api/reviews",
    headers: auth_headers,
    params: {
      platform: "Google",
    },
  });
  // Honestly, as long as we get a 200 response, I don't care what the returned data is
});

// Test responding to reviews
test("Responding to reviews", async () => {
  const response = await axios({
    method: "get",
    url: BACKEND_URI + "/api/reviews",
    headers: auth_headers,
    params: {
      platform: "Google",
    },
  });

  // Then, pick a review to respond to, and write a reply.
  // We pick review 4 because it has 2 stars.
  const review = response.data.reviews[3];
  const reply = "Your review sucks, and you smell.";

  // The user hits the 'reply' button, which will then respond to the review.
  const respond = await axios({
    method: "post",
    url: BACKEND_URI + "/api/interactions/respond",
    headers: auth_headers,
    data: {
      reviewId: review.review_id,
      responseText: reply,
    },
  });

  // Now, let's get the interactions to see if it worked.
  const interactions = await axios({
    method: "get",
    url: BACKEND_URI + "/api/interactions",
    headers: auth_headers,
  });
  expect(interactions.data.interactions[0].review_id).toBe(review.review_id);
});

// This test also tests to see if we can create disputes
test("Receive AI feedback", async () => {
  // First, get our reviews.
  const response = await axios({
    method: "get",
    url: BACKEND_URI + "/api/reviews",
    headers: auth_headers,
    params: {
      platform: "Google",
    },
  });
  // Then, pick a review to respond to.
  // We pick review 3 because it says we are evil and we should go to jail.
  const review = response.data[2];

  // Our system should automatically call this API key (I think...)
  // However, since we don't have connections, we do it manually here.
  // TODO - use the node endpoint for this instead of the python endpoint.
  const get_ai_feedback = await axios({
    method: "post",
    url: BACKEND_URI + `/api/disputes/analyze/${review.review_id}`,
    headers: auth_headers,
    data: {
      platform: review.platform,
      content: review.content,
    },
  });

  console.log("Got feedback: ");
  console.log(get_ai_feedback.data);

  // In this story, the user just uses the AI's feedback.
  const violation_type = get_ai_feedback.data.violation_type;
}, 20000); // 20 second timeout. We need to determine how long is too long for these operations.

// This review is the same for 'receive AI feedback', but it also involves creating and submitting a dispute.
test("Dispute user reviews", async () => {
  // First, get our reviews.
  const response = await axios({
    method: "get",
    url: BACKEND_URI + "/api/reviews/",
    headers: auth_headers,
    params: {
      platform: "Google",
    },
  });
  // TODO - rewrite this test when we fix the 500 error for getting api reviews
  const review = response.data[2];

  // Our system should automatically call this API key (I think...)
  // However, since we don't have connections, we do it manually here.
  // TODO - use the node endpoint for this instead of the python endpoint.
  const get_ai_feedback = await axios({
    method: "post",
    url: AI_BACKEND_URI + "/analyze-review-text",
    headers: auth_headers,
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
}, 20000); // 20 second timeout. We need to determine how long is too long for these operations.

// Test for creating a business
// This should be part of user creation.
test("Create a business", async () => {
  // We already have a user created from the load_test_data.js file,
  // so we skip to creating a business.

  // First, we create a business.
  const response = await axios({
    method: "post",
    url: BACKEND_URI + "/api/business",
    headers: auth_headers, // TODO - add headers when we have proper auth
    data: {
      businessName: "Contracting",
      facebookPageID: null,
      googlePlaceId: null,
      trustpilotBusinessId: null,
      yelpBusinessId: null,
    },
  });

  // Now, I look to see if the business was created.
  const business = await axios({
    method: "get",
    url: BACKEND_URI + "/api/business",
    headers: auth_headers,
  });

  expect(business.data.business_name).toBe("Contracting");
});

// This test checks for an edge case in which a business has more than one word
test("Create two businesses", async () => {
  const response = await axios({
    method: "post",
    url: BACKEND_URI + "/api/business",
    headers: auth_headers,
    data: {
      businessName: "Very Big Contracting Company",
      facebookPageID: null,
      googlePlaceId: null,
      trustpilotBusinessId: null,
      yelpBusinessId: null,
    },
  });

  const business_response = await axios({
    method: "post",
    url: BACKEND_URI + "/api/business",
    headers: auth_headers,
    data: {
      businessName: "Even Bigger Contracting Company",
      facebookPageID: null,
      googlePlaceId: null,
      trustpilotBusinessId: null,
      yelpBusinessId: null,
    },
  });

  // Now, I look to see if the business was created.
  const business = await axios({
    method: "get",
    url: BACKEND_URI + "/api/business",
    headers: auth_headers,
  });

  console.log(business.data);

  expect(business.data.business_name).toBe("Very Big Contracting Company");
  expect(false).toBe(true); // We manually fail this test until #16 is resolved
});

test("Test review synchronization", async () => {
  // First, we create a business with a Google Place ID and a yelp ID.
  const response = await axios({
    method: "post",
    url: BACKEND_URI + "/api/business",
    headers: auth_headers,
    data: {
      businessName: "Contracting",
      facebookPageID: null,
      googlePlaceId: "5553344967833012882",
      trustpilotBusinessId: null,
      yelpBusinessId: "atlas-pools-keller",
    },
  });

  // Now, we synchronize.
  const sync_response = await axios({
    method: "post",
    url: BACKEND_URI + "/api/reviews/sync",
    headers: auth_headers,
  });

  console.log(sync_response.data);
});
