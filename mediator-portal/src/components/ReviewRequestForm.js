import React, { useState } from 'react';
import axios from 'axios';

const ReviewRequestForm = ({ businessId }) => {
    const [contact, setContact] = useState('');
    const [platform, setPlatform] = useState('Google');
    const [method, setMethod] = useState('email');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/reviewGeneration/sendRequest', {
                contact,
                platform,
                method,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error sending review request');
        }
    };

    return (
        <div>
            <h2>Send Review Request</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Email or Phone Number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                />
                <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    <option value="Google">Google</option>
                    <option value="Yelp">Yelp</option>
                </select>
                <select value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                </select>
                <button type="submit">Send Request</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ReviewRequestForm;