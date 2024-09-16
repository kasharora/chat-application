import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaMobileAlt, FaEnvelope, FaLock } from 'react-icons/fa'; // Importing Font Awesome icons

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://new-folder-backend.onrender.com/register', formData);
      alert('User registered successfully');
    } catch (error) {
      console.error(error);
      alert('Error registering user');
    }
  };

  return (
    <div className="register-container">
      <div className="button-group">
        <button onClick={() => navigate('/register')}>Go to Register</button>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <h2>SIGN UP</h2>
        
        <div className="input-container">
          <FaUser className="input-icon" />
          <input type="text" name="name" placeholder="Username" onChange={handleChange} />
        </div>

        <div className="input-container">
          <FaMobileAlt className="input-icon" />
          <input type="text" name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} />
        </div>

        <div className="input-container">
          <FaEnvelope className="input-icon" />
          <input type="email" name="email" placeholder="E-mail" onChange={handleChange} />
        </div>

        <div className="input-container">
          <FaLock className="input-icon" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        </div>

        <div className="input-container">
          <FaLock className="input-icon" />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
        </div>

        <button type="submit">Create Account</button>
        <p className="login-link">
          Already have an account? <span onClick={() => navigate('/login')}>Login here</span>
        </p>
      </form>
    </div>
  );
}

export default Register;
