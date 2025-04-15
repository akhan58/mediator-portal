const axios = require('axios');
require('dotenv').config();

// Extracts Trustpilot business ID from URL
const extractTrustpilotBusinessId = (url) => {
    try {
        // Handle different Trustpilot URL formats
        const match = url.match(/trustpilot\.com\/review\/([^/?]+)/i);
        if (!match) throw new Error('Invalid Trustpilot URL format');
        return match[1];
    } catch (err) {
        console.error("URL parsing error:", err);
        return null;
    }
};

// Finds Business Unit ID from business ID (domain name)
const findTrustpilotBusinessUnitId = async (businessId) => {
    try {
        const response = await axios.get(
            `https://api.trustpilot.com/v1/business-units/find?name=${businessId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.TRUSTPILOT_API_KEY}`,
              },
            }
        );

        return response.data?.id || null;
    } catch (err) {
        console.error("Business Unit ID lookup error:", err.response?.data || err.message);
        return null;
    }
};

const fetchTrustpilotReviews = async (identifier) => {
    const trustpilotApiKey = process.env.TRUSTPILOT_API_KEY;
    let businessUnitId = identifier;
    let businessId = null;

    // If identifier is a URL, extract the business ID first
    if (identifier.includes('trustpilot.com')) {
        businessId = extractTrustpilotBusinessId(identifier);
        if (!businessId) {
            return { reviews: [], error: "Invalid Trustpilot URL" };
        }
        
        // Then find the Business Unit ID
        businessUnitId = await findTrustpilotBusinessUnitId(businessId);
        if (!businessUnitId) {
            return { reviews: [], error: "Could not find Business Unit ID" };
        }
    }

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
                source_id: review.id
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