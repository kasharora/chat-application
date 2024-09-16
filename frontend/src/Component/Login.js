import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Error state for displaying login errors
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      // Use the correct API URL
      const response = await axios.post('https://chat-application-backend-9ejl.onrender.com/login', { email, password });

      // Check if response is not okay
      if (response.status !== 200) {
        throw new Error('Login failed');
      }

      const { token, name, email: userEmail } = response.data; // Extracting data from the response
      localStorage.setItem('token', token);
      localStorage.setItem('name', name);
      localStorage.setItem('email', userEmail);

      if (typeof setUser === 'function') {
        setUser({ name, email: userEmail });
      } else {
        console.warn('setUser is not a function. User state may not be updated.');
      }

      alert('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage); // Set specific error message on failure
    }
  };

  return (
    <div className="page-container">
      <header className="header">
        <div className="nav-buttons">
          <Link to="/login" className="nav-button">Go to Login</Link>
          <Link to="/register" className="nav-button">Go to Register</Link>
        </div>
      </header>
      <main className="login-container">
        <div className="login-form">
          <div className="avatar-container">
            <div className="avatar"></div>
          </div>
          <h2>LOGIN</h2>
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                aria-label="Email"
              />
              <span className="icon email-icon">📧</span>
            </div>
            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                aria-label="Password"
              />
              <span className="icon password-icon">🔒</span>
            </div>
            <button type="submit" className="login-button">LOGIN</button>
          </form>
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Username / Password?</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
