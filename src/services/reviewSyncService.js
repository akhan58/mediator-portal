const reviewsAccessLayer = require("../models/reviewsAccessLayer");
const disputesAccessLayer = require("../models/disputesAccessLayer");
const businessAccessLayer = require("../models/businessesAccessLayer");

const { fetchGoogleReviews } = require("../routes/googleReviews");
const { fetchTrustpilotReviews } = require("../routes/trustpilotReviews");
const { fetchYelpReviews } = require("../routes/yelpReviews");
const { fetchFacebookReviews } = require("../routes/facebookReviews");

// Check for changes in external platform reviews
async function syncExternalReviews(userId) {
  try {
    // Get business profile
    const business = await businessAccessLayer.getBusinessByUserId(userId);
    if (!business) {
      console.error("Business profile not found for user:", userId);
      return { error: "Business profile not found" };
    }

    // Sync reviews from all available platforms
    if (!business.google_place_id == null) {
      await syncPlatformReviews("google", business.google_place_id, userId);
    }
    if (!business.trustpilot_businessunit_id == null) {
      await syncPlatformReviews(
        "trustpilot",
        business.trustpilot_businessunit_id,
        userId,
      );
    }
    if (!business.yelp_business_id == null) {
      await syncPlatformReviews("yelp", business.yelp_business_id, userId);
    }
    if (!business.facebook_page_id == null) {
      await syncPlatformReviews("facebook", business.facebook_page_id, userId);
    }

    return { success: true };
  } catch (err) {
    console.error("Error syncing external reviews:", err);
    return { error: "Failed to sync reviews" };
  }
}

// Sync reviews for a specific platform
async function syncPlatformReviews(platform, platformId, userId) {
  let reviews, error;

  // Fetch latest reviews from platform
  switch (platform) {
    case "google":
      ({ reviews, error } = await fetchGoogleReviews(platformId));
      break;
    case "trustpilot":
      ({ reviews, error } = await fetchTrustpilotReviews(platformId));
      break;
    case "yelp":
      ({ reviews, error } = await fetchYelpReviews(platformId));
      break;
    case "facebook":
      ({ reviews, error } = await fetchFacebookReviews(platformId));
      break;
    default:
      return;
  }

  if (error) {
    console.error(`Error fetching ${platform} reviews:`, error);
    return;
  }

  // Get existing reviews for this platform
  const existingReviews = await reviewsAccessLayer.getReviewByPlatform(
    platform,
  );
  const existingSourceIds = new Set(existingReviews.map((r) => r.source_id));

  // Map of source_id to review object for quick lookup
  const currentReviewsMap = {};
  reviews.forEach((review) => {
    currentReviewsMap[review.source_id] = review;
  });

  // Process existing reviews - check for removals or updates
  for (const existingReview of existingReviews) {
    // If a review no longer exists in the platform, mark it as removed
    if (!currentReviewsMap[existingReview.source_id]) {
      await reviewsAccessLayer.updateReviewStatus({
        reviewId: existingReview.review_id,
        status: 3, // removed
      });
      continue;
    }

    // Check if review was updated (content or rating changed)
    const currentReview = currentReviewsMap[existingReview.source_id];
    if (
      currentReview.content !== existingReview.content ||
      currentReview.rating !== existingReview.rating
    ) {
      await reviewsAccessLayer.updateReview({
        reviewId: existingReview.review_id,
        rating: currentReview.rating,
        content: currentReview.content,
      });
    }
  }

  // Add new reviews
  for (const review of reviews) {
    if (!existingSourceIds.has(review.source_id)) {
      await reviewsAccessLayer.createReview({
        ...review,
        user_id: userId,
      });
    }
  }
}

module.exports = { syncExternalReviews };
