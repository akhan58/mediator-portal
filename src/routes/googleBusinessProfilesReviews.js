// googleBusinessProfilesReviews.js
// This module fetches reviews using the Google Business Profiles API. 
// Currently we are waiting to receive a key from Google so this code serves as a placeholder 

const { google } = require("googleapis");
const axios = require("axios");
require("dotenv").config();

/**
 * Fetches reviews for a business using the Google Business Profiles API.
 * @param {string} businessId - The Google Business ID of the business.
 * @returns {Object} - Returns an object with `reviews` array and `error` string if applicable.
 */
const fetchGoogleBusinessReviews = async (businessId) => {  
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );
        oauth2Client.setCredentials({
            refresh_token: /* process.env.GOOGLE_REFRESH_TOKEN */
        });
  
        const { token } = await oauth2Client.getAccessToken();
    
        // Make a GET request to the Business Profiles API for business name and reviews
        const response = await axios.get(
            `https://mybusiness.googleapis.com/v4/accounts/${/* process.env.GOOGLE_ACCOUNT_ID */}/locations/${businessId}/reviews`,
            {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            }
        );
    
        // If reviews are found in the response, format and return them
        if (response.data.reviews) {
            const transformedReviews = response.data.reviews.map(review => ({
                platform: 'Google Business',
                rating: parseInt(review.starRating) || 0,
                content: review.comment || '',
                timestamp: new Date(review.createTime),
                source_id: review.name.split('/').pop(),
            }));
    
            return { reviews: transformedReviews, error: null };
        } else {
            return { reviews: [], error: "No reviews found" };
        }
    } catch (err) {
        console.error("Google Business API error:", err.response?.data || err.message);
        return { reviews: [], error: err.response?.data?.error?.message || "Failed to fetch reviews" };
    }
};

export default googleBusinessProfilesReviews;