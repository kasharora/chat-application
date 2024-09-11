import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Error state used
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, { email, password }); // Use dynamic API base URL
      const { token, name, email: userEmail } = response.data;
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
      setError('Login failed. Please check your credentials.'); // Set error message on failure
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
              />
              <span className="icon password-icon">🔒</span>
            </div>
            <button type="submit" className="login-button">LOGIN</button>
          </form>
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Username / Password?</Link> {/* Use Link component */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
