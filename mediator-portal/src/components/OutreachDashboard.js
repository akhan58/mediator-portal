// OutreachDashboard.js (Front End - React Component)
// This part fetches reviews for a given business (using its businessId) from the backend,
// filters the reviews to include only those with a rating of 2 or lower,
// and displays them in a table with details such as platform, rating, date, and review text.
// Each review row includes a "Flag for Outreach" button that, when clicked,
// sends a POST request to flag the review for outreach, then displays the response message.

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OutreachDashboard = ({ businessId }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`/api/reviews/getReviews?businessId=${businessId}`);
                setReviews(response.data.filter((review) => review.rating <= 2));
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, [businessId]);

    return (
        <div>
            <h2>Outreach Dashboard</h2>
            <table>
                <thead>
                <tr>
                    <th>Platform</th>
                    <th>Rating</th>
                    <th>Date</th>
                    <th>Text</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {reviews.map((review) => (
                    <tr key={review.id}>
                        <td>{review.platform}</td>
                        <td>{review.rating}</td>
                        <td>{new Date(review.review_date).toLocaleDateString()}</td>
                        <td>{review.review_text}</td>
                        <td>
                            <button onClick={() => handleOutreach(review.id)}>Flag for Outreach</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    const handleOutreach = async (reviewId) => {
        try {
            const response = await axios.post('/api/reviews/flagOutreach', { reviewId });
            alert(response.data.message);
        } catch (error) {
            alert('Error flagging review for outreach');
        }
    };
};

export default OutreachDashboard;