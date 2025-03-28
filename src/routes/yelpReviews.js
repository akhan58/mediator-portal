const axios = require('axios');
require('dotenv').config();

const fetchYelpReviews = async (businessId) => {
    const yelpApiKey = process.env.YELP_API_KEY;

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
                source_ID: review.id
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