'use client';

import { useState } from 'react';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    dateOfBirth: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    zipCode: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const fullAddress = [
      formData.addressLine1,
      formData.addressLine2,
      formData.city,
      formData.state,
      formData.zipCode
    ].filter(Boolean).join(', ');

    const payload = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Address: fullAddress,
      PhoneNumber: formData.phone,
      DateOfBirth: formData.dateOfBirth
    };

    try {
      console.log('Sending payload:', payload); // For debugging

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/createAccount`, {
        method: 'POST',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();

      console.log('Response:', data); // For debugging
      
      if (!response.ok) {
        setError(data.message || 'Failed to sign up');
        return;
      }
      
      setMessage('Account created successfully! Please sign in.');
      
    } catch (error) {
      console.error('Error:', error); // For debugging
      setError(error.message || 'An error occurred during signup');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Your Account</h2>
        <p style={styles.subheading}>Sign up to get started</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="text"
            name="addressLine1"
            placeholder="Address Line 1"
            value={formData.addressLine1}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="text"
            name="addressLine2"
            placeholder="Address Line 2"
            value={formData.addressLine2}
            onChange={handleChange}
            style={styles.input}
          />
          <div style={styles.row}>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <input
            type="text"
            name="zipCode"
            placeholder="ZIP Code"
            value={formData.zipCode}
            onChange={handleChange}
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          {message && <p style={styles.success}>{message}</p>}
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        <p style={styles.signinLink}>
          Already have an account? <a href="/signin" style={styles.link}>Sign In</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
  },
  card: {
    maxWidth: '500px',
    width: '100%',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  heading: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '10px',
  },
  subheading: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  row: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  error: {
    marginTop: '10px',
    color: '#dc3545',
    fontSize: '14px',
  },
  success: {
    marginTop: '10px',
    color: '#28a745',
    fontSize: '14px',
  },
  signinLink: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#666',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};