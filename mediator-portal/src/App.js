// App.js (Front End - React Component)
// This is the main piece for the Mediator Portal front end.
// It sets up client-side routing, defining routes for home,
// login, signup, review dashboard, and review request form.
// It also includes a Navbar component for navigation and applies styles from App.css.

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import ReviewDashboard from './components/ReviewDashboard';
import ReviewRequestForm from './components/ReviewRequestForm';
import Navbar from './components/Navbar'; // Optional: Add a navigation bar
import './App.css';

function App() {
  return (
      <Router>
        <div className="App">
          {/* Optional: Add a navigation bar */}
          <Navbar />

          {/* Define routes for different components */}
          <Routes>
            <Route path="/" element={<h1>Welcome to Mediator Portal</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ReviewDashboard />} />
            <Route path="/request-review" element={<ReviewRequestForm />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;






/*
OLD CODE
import React from 'react';

import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
      <div className="App">
        <h1>Welcome to Mediator Portal</h1>
        <Login />
        <Signup />
      </div>
  );
}

export default App;

*/