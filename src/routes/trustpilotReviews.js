const axios = require('axios');
require('dotenv').config();

const fetchTrustpilotReviews = async (businessUnitId) => {
    const trustpilotApiKey = process.env.TRUSTPILOT_API_KEY;

    try {
        const response = await axios.get(
            `https://api.trustpilot.com/v1/business-units/${businessUnitId}/reviews`,
            {
                headers: {
                    Authorization: `Bearer ${trustpilotApiKey}`,
                },
            }
        );
        console.log("Trustpilot API Response:", response.data);

        if (response.data.reviews) {
            const transformedReviews = response.data.reviews.map(review => ({
                platform: 'Trustpilot',
                rating: parseInt(review.rating || review.stars) || 0,
                content: review.text || '',
                timestamp: new Date(review.createdAt),
                source_ID: review.id
            }));
            
            return { reviews: transformedReviews, error: null};
        } else {
            return { reviews: [], error: "No reviews found." };
        }
    } catch (err) {
        console.error("Trustpilot API fetching error.", err);
        return { reviews: [], error: "Failed to fetch reviews." };
    }
}

module.exports = { fetchTrustpilotReviews };

/* OLD CODE
import React, { useState, useEffect } from "react";
import axios from "axios";

require('dotenv').config();

const fetchTrustpilotReviews = (businessUnitId) => {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
  
    const trustpilotApiKey = process.env.TRUSTPILOT_API_KEY;
  
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(
            `https://api.trustpilot.com/v1/business-units/${businessUnitId}/reviews`,
            {
              headers: {
                Authorization: `Bearer ${trustpilotApiKey}`,
              },
            }
          );
  
          if (response.data.reviews) {
            setReviews(response.data.reviews);
          } else {
            setError("No reviews found.");
          }
        } catch (err) {
          setError("Failed to fetch reviews.");
          console.error(err);
        }
      };
  
      fetchReviews();
    }, [trustpilotApiKey, businessUnitId]);
  
    return { reviews, error };
  };
  
  export default fetchTrustpilotReviews;
  */