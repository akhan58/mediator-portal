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