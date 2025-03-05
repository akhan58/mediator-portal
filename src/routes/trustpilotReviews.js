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