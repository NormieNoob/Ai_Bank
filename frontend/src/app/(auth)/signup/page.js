"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    dateOfBirth: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    city: "",
    zipCode: "",
    accountType: { checking: false, savings: false }, // Added for account type
    subscriptionType: 'free'
  });

  useEffect(() => {
    // Get the selected plan from localStorage when component mounts
    const selectedPlan = localStorage.getItem('selectedPlan');
    if (selectedPlan) {
      setFormData(prev => ({
        ...prev,
        subscriptionType: selectedPlan
      }));
      // Clear the stored plan
      localStorage.removeItem('selectedPlan');
    }
  }, []);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Check if at least one account type is selected
    if (!formData.accountType.checking && !formData.accountType.savings) {
      setError("You must select at least one account type (Checking or Savings).");
      return;
    }

    const fullAddress = [
      formData.addressLine1,
      formData.addressLine2,
      formData.city,
      formData.state,
      formData.zipCode,
    ]
      .filter(Boolean)
      .join(", ");

    const payload = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: fullAddress,
      phoneNumber: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      accountType: formData.accountType, // Include selected account types
      subscriptionType: formData.subscriptionType
    };

    try {
      console.log("Sending payload:", payload); // For debugging

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/createAccount`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      console.log("Response:", data); // For debugging

      if (!response.ok) {
        setError(data.message || "Failed to sign up");
        return;
      }

      setMessage("Account created successfully! Please sign in.");
    } catch (error) {
      console.error("Error:", error); // For debugging
      setError(error.message || "An error occurred during signup");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      accountType: { ...prevData.accountType, [name]: checked },
    }));
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

          {/* Subscription Type Toggle */}
          <div style={styles.subscriptionToggle}>
            <p style={styles.subscriptionLabel}>Select Your Plan:</p>
            <div style={styles.toggleContainer}>
              <label style={{
                ...styles.subscriptionOption,
                ...(formData.subscriptionType === 'free' ? styles.activeSubscription : {})
              }}>
                <input
                  type="radio"
                  name="subscriptionType"
                  value="free"
                  checked={formData.subscriptionType === 'free'}
                  onChange={handleChange}
                  style={styles.radioInput}
                />
                Free Plan
              </label>
              <label style={{
                ...styles.subscriptionOption,
                ...(formData.subscriptionType === 'premium' ? styles.activeSubscription : {})
              }}>
                <input
                  type="radio"
                  name="subscriptionType"
                  value="premium"
                  checked={formData.subscriptionType === 'premium'}
                  onChange={handleChange}
                  style={styles.radioInput}
                />
                Premium Plan ($4.99/month)
              </label>
            </div>
          </div>

          {/* Account Type Checkboxes */}
          <div style={styles.checkboxContainer}>
            <label style={styles.switch}>
              <input
                type="checkbox"
                name="checking"
                checked={formData.accountType.checking}
                onChange={handleCheckboxChange}
              />
              <span style={styles.slider}></span>
              <p style={styles.switchLabel}>Open Checking Account</p>
            </label>
            <label style={styles.switch}>
              <input
                type="checkbox"
                name="savings"
                checked={formData.accountType.savings}
                onChange={handleCheckboxChange}
              />
              <span style={styles.slider}></span>
              <p style={styles.switchLabel}>Open Savings Account</p>
            </label>
          </div>

          {error && <p style={styles.error}>{error}</p>}
          {message && <p style={styles.success}>{message}</p>}
          <button type="submit" style={styles.button}>
            Sign Up
          </button>
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
  },
  card: {
    maxWidth: "500px",
    width: "100%",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "10px",
  },
  subheading: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  row: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0px", // Reduced space between checkboxes
    margin: "5px 0", // Adjusted overall margin for better layout
  },
  switch: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "0px 0", // Reduced vertical padding
  },
  switchLabel: {
    fontSize: "14px",
    color: "#333",
  },
  slider: {
    width: "40px",
    height: "20px",
    backgroundColor: "#ccc",
    borderRadius: "50px",
    position: "relative",
    transition: "background-color 0.3s",
    cursor: "pointer",
  },
  sliderChecked: {
    backgroundColor: "#007bff",
  },
  button: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    marginTop: "10px",
    color: "#dc3545",
    fontSize: "14px",
  },
  success: {
    marginTop: "10px",
    color: "#28a745",
    fontSize: "14px",
  },
  signinLink: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#666",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  subscriptionToggle: {
    marginBottom: "20px",
    textAlign: "left",
  },
  subscriptionLabel: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "10px",
  },
  toggleContainer: {
    display: "flex",
    gap: "15px",
  },
  subscriptionOption: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "2px solid #007bff",
    color: "#007bff",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  activeSubscription: {
    backgroundColor: "#007bff",
    color: "#ffffff",
  },
  radioInput: {
    display: "none",
  },
};
