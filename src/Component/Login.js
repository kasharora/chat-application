import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
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
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <>
           <button onClick={() => navigate('/register')}>Go to Register</button>
       <button onClick={() => navigate('/login')}>Go to Login</button>
    <form onSubmit={handleSubmit}>

      <h2>Login</h2>     
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Login</button>
    </form>
    </>
  );
}

export default Login;