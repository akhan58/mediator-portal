const axios = require('axios');
require('dotenv').config();

const extractYelpBusinessId = (url) => {
    try {
        const match = url.match(/yelp\.com\/biz\/([^/?]+)/);
        if (!match) throw new Error('Invalid Yelp URL format');
        return match[1];

    } catch (err) {
        console.error("URL parsing error:", err);
        return null;
    }
};


const fetchYelpReviews = async (identifier) => {
    const yelpApiKey = process.env.YELP_API_KEY;
    let businessId = identifier

    // If identifier is a URL, extract the business ID
    if (identifier.includes('yelp.com')) {
        businessId = extractYelpBusinessId(identifier);

        if (!businessId) {
            return { reviews: [], error: "Invalid Yelp URL" };
        }
    }

    try {
        const response = await axios.get(`https://api.yelp.com/v3/businesses/${businessId}/reviews`,
            {
                headers: {
                    Authorization: `Bearer ${yelpApiKey}`,
                },
            }
        );
        console.log("Yelp API Response:", response.data);

        if (response.data.reviews) {
            const transformedReviews = response.data.reviews.map(review => ({
                platform: 'Yelp',
                rating: parseInt(review.rating) || 0,
                content: review.text || '',
                timestamp: new Date(review.time_created),
                source_id: review.id
            }));
            
            return { reviews: transformedReviews, error: null};
        } else {
            return { reviews: [], error: "No reviews found." };
        }
    } catch (err) {
        console.error("Yelp API fetching error:", err);
        return { reviews: [], error: "Failed to fetch reviews." };
    }
}

module.exports = { fetchYelpReviews };

/* OLD CODE
import React, { useState, useEffect } from "react";
import axios from "axios";

require('dotenv').config();

// First Yelp Review request iteration
const fetchYelpReviews = (businessId) => {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
  
    const yelpApiKey = process.env.YELP_API_KEY;
  
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(`https://api.yelp.com/v3/businesses/${businessId}/reviews`,
            {
              headers: {
                Authorization: `Bearer ${yelpApiKey}`,
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
    }, [yelpApiKey, businessId]);
  
    return { reviews, error };
  };
  
  export default fetchYelpReviews;
  */