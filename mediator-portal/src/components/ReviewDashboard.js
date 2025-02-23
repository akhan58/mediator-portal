// ReviewDashboard.js (Front End - React Component)
// This component retrieves and displays reviews for a specific business.
// It uses the businessId prop to fetch review data
// and then makes a table displaying each review's platform, rating, date, and text.

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReviewDashboard = ({ businessId }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`/api/reviews/getReviews?businessId=${businessId}`);
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, [businessId]);

    return (
        <div>
            <h2>Review Dashboard</h2>
            <table>
                <thead>
                <tr>
                    <th>Platform</th>
                    <th>Rating</th>
                    <th>Date</th>
                    <th>Text</th>
                </tr>
                </thead>
                <tbody>
                {reviews.map((review) => (
                    <tr key={review.id}>
                        <td>{review.platform}</td>
                        <td>{review.rating}</td>
                        <td>{new Date(review.review_date).toLocaleDateString()}</td>
                        <td>{review.review_text}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReviewDashboard;