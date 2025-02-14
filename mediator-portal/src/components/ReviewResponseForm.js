import React, { useState } from 'react';
import axios from 'axios';

const ReviewResponseForm = ({ reviewId }) => {
    const [response, setResponse] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/reviews/respond', {
                reviewId,
                response,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error submitting response');
        }
    };

    return (
        <div>
            <h2>Respond to Review</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Your response"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    required
                />
                <button type="submit">Submit Response</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ReviewResponseForm;