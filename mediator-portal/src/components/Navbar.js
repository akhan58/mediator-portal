// Navbar.js (Front End - React Component)
// This component makes a navigation bar with links to key pages (Home, Login, Signup, Dashboard, Request Review)
// this is just a side piece I was working on so maybe expand it later if needed.
// something to do is work on maybe client-side routing?
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/request-review">Request Review</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;