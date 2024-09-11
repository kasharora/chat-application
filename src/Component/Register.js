import React, { useState } from 'react';
import axios from 'axios';
import './Style.css';
import { useNavigate } from 'react-router-dom';

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
      await axios.post('http://localhost:5000/register', formData);
      alert('User registered successfully');
    } catch (error) {
      console.error(error);
      alert('Error registering user');
    }
  };

  return (
    <>
       <button onClick={() => navigate('/register')}>Go to Register</button>
       <button onClick={() => navigate('/login')}>Go to Login</button>
    <form onSubmit={handleSubmit}><br/>

      <input type="text" name="name" placeholder="Name" onChange={handleChange} />
      <input type="text" name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
      <button type="submit">Create Account</button>
    </form>
    
    </>
  );
}

export default Register;
