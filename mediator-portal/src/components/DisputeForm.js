// DisputeForm.js (Front End - React Component)
// This part makes a form to allow users to flag a review for dispute.
// It takes a reviewId as a prop and lets the user input a reason for the dispute.
// When submission happens, it sends a POST request with the reviewId and reason.
// The response message is then displayed, showing the result of this whole thing.

import React, { useState } from 'react';
import axios from 'axios';

const DisputeForm = ({ reviewId }) => {
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/reviews/flagDispute', {
                reviewId,
                reason,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error flagging review for dispute');
        }
    };

    return (
        <div>
            <h2>Flag Review for Dispute</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Reason for dispute"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                />
                <button type="submit">Submit Dispute</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default DisputeForm;