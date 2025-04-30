// googleReviews.js
// This module fetches reviews using the Google Places API (not the Business Profiles API).
// The Places API allows us to pull publicly visible reviews from Google Maps based on the Place ID.
// This API does not support replying to reviews or accessing private business data.

const axios = require('axios');
require('dotenv').config();

/**
 * Fetches reviews for a business using the Google Places API.
 * @param {string} placeId - The Google Place ID of the business.
 * @returns {Object} - Returns an object with `reviews` array and `error` string if applicable.
 */
const fetchGoogleReviews = async (placeId) => {
    const googleApiKey = process.env.GOOGLE_API_KEY;

    try {
        // Make a GET request to the Places API for business name and reviews
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,reviews&key=${googleApiKey}`);
        console.log("Google API Response:", response.data);

        // If reviews are found in the response, format and return them
        if (response.data.result && response.data.result.reviews) {
            const transformedReviews = response.data.result.reviews.map(review => ({
                platform: 'Google',
                rating: parseInt(review.rating) || 0,
                content: review.text || '',
                timestamp: new Date(review.time * 1000), // Convert UNIX timestamp to JS Date
                source_id: review.author_name // Using author_name as a unique identifier
            }));
            
            return { reviews: transformedReviews, error: null };
        } else {
            return { reviews: [], error: "No reviews found." };
        }
    } catch (err) {
        console.error("Google API fetching error:", err);
        return { reviews: [], error: "Failed to fetch reviews." };
    }
};

module.exports = { fetchGoogleReviews };


/* OLD CODE
import React, { useState, useEffect } from "react";
import axios from "axios";

require('dotenv').config();

// First Google Review request iteration
const fetchGoogleReviews = (placeId) => {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);

    const googleApiKey = process.env.GOOGLE_API_KEY;
    
    useEffect(() => {
        const fetchReviews= async () => {
            try {
                const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,reviews&key=${googleApiKey}`);
                
                if (response.data.result && response.data.result.reviews) {
                    setReviews(response.data.result.reviews);
                } else {
                    setError("No reviews found.");
                }
            } catch (err) {
                setError("Failed to fetch reviews.")
                console.error(err);
            }
        };

        fetchReviews();
    }, [googleApiKey, placeId]);

    return {reviews, error};
};

export default fetchGoogleReviews;
*/
