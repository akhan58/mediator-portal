import React, { useState, useEffect } from "react";
import axios from "axios";

require('dotenv').config(); // Load environment variables from .env file

// Fetch Facebook Reviews Hook
const fetchFacebookReviews = (pageId) => {
    const [reviews, setReviews] = useState([]); // State to store reviews
    const [error, setError] = useState(null); // State to store error messages

    const facebookAPIkey = process.env.FACEBOOK_API_KEY; // Fetch API key from environment variables

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`https://graph.facebook.com/v18.0/${pageId}/ratings`, {
                    params: {
                        access_token: facebookAPIkey, // Pass API key as access token
                        fields: "review_text,reviewer,rating,created_time" // Specify the fields to fetch
                    }
                });

                if (response.data.data && response.data.data.length > 0) {
                    setReviews(response.data.data); // Store fetched reviews in state
                } else {
                    setError("No reviews found."); // Handle case where no reviews are available
                }
            } catch (err) {
                setError("Failed to fetch reviews."); // Handle errors in API call
                console.error(err); // Log error to the console
            }
        };

        fetchReviews(); // Call the function to fetch reviews
    }, [facebookAPIkey, pageId]); // Re-run effect if API key or page ID changes

    return { reviews, error }; // Return the reviews and error state
};

export default fetchFacebookReviews; // Export the custom hook for use in other components
