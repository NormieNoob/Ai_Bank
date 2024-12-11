"use client";

import { useState } from "react";
import { useParams, useRouter } from 'next/navigation';

export default function WithdrawPage() {
  const [selectedAccount, setSelectedAccount] = useState(""); // Track selected account
  const [withdrawAmount, setWithdrawAmount] = useState(""); // Track withdrawal amount
  const [message, setMessage] = useState(""); // Display success/error messages
  const uname = useParams().uname; // Get the `uname` from the URL parameters

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validation
    if (!selectedAccount) {
      setMessage("Please select an account to withdraw from.");
      return;
    }

    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setMessage("Please enter a valid withdrawal amount.");
      return;
    }

    try {
      // API Request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${uname}/accounts/withdraw`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            accountType: selectedAccount, // Send the selected account type
            withdrawAmount: Number(withdrawAmount),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to withdraw funds.");
      }

      setMessage(data.message || "Withdrawal successful!");
    } catch (error) {
      setMessage(error.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Withdraw Funds</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Select Account Type:</label>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Account</option>
          <option value="checking">Checking Account</option>
          <option value="savings">Savings Account</option>
        </select>

        <label style={styles.label}>Enter Withdrawal Amount:</label>
        <input
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Withdrawal Amount"
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Withdraw
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    textAlign: "left",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "5px",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#333",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  message: {
    marginTop: "20px",
    fontSize: "16px",
    color: "#007bff",
    fontWeight: "bold",
  },
};
