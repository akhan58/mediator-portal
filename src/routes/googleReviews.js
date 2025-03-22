const axios = require('axios');
require('dotenv').config();

const fetchGoogleReviews = async (placeId) => {
    const googleApiKey = process.env.GOOGLE_API_KEY;

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,reviews&key=${googleApiKey}`);
        console.log("Google API Response:", response.data);

        if (response.data.result && response.data.result.reviews) {
            const transformedReviews = response.data.result.reviews.map(review => ({
                platform: 'Google',
                rating: parseInt(review.rating) || 0,
                content: review.text || '',
                timestamp: new Date(review.time * 1000)
            }));
            
            return { reviews: transformedReviews, error: null};
        } else {
            return { reviews: [], error: "No reviews found." };
        }
    } catch (err) {
        console.error("Google API fetching error:", err);
        return { reviews: [], error: "Failed to fetch reviews." };
    }
}

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