import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router for routing
import App from './App';

test('renders welcome message', () => {
  render(
      <Router>
        <App />
      </Router>
  );
  const welcomeMessage = screen.getByText(/Welcome to Mediator Portal/i);
  expect(welcomeMessage).toBeInTheDocument();
});

test('renders login link', () => {
  render(
      <Router>
        <App />
      </Router>
  );
  const loginLink = screen.getByText(/Login/i);
  expect(loginLink).toBeInTheDocument();
});

test('renders signup link', () => {
  render(
      <Router>
        <App />
      </Router>
  );
  const signupLink = screen.getByText(/Signup/i);
  expect(signupLink).toBeInTheDocument();
});
