import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('/api/reviews/getReviews');
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, []);

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <table>
                <thead>
                <tr>
                    <th>Platform</th>
                    <th>Rating</th>
                    <th>Date</th>
                    <th>Text</th>
                    <th>Dispute</th>
                    <th>Outreach</th>
                </tr>
                </thead>
                <tbody>
                {reviews.map((review) => (
                    <tr key={review.id}>
                        <td>{review.platform}</td>
                        <td>{review.rating}</td>
                        <td>{new Date(review.review_date).toLocaleDateString()}</td>
                        <td>{review.review_text}</td>
                        <td>{review.is_disputed ? 'Yes' : 'No'}</td>
                        <td>{review.is_outreach ? 'Yes' : 'No'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;