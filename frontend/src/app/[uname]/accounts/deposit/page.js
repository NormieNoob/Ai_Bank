"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function DepositPage() {
    const uname = useParams().uname
  const [selectedAccount, setSelectedAccount] = useState(""); // State to track selected account
  const [amount, setAmount] = useState(""); // State to track deposit amount
  const [message, setMessage] = useState(""); // Success/Error message

  const MAX_DEPOSIT_LIMIT = 250000; // Maximum deposit limit

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    // Validate deposit amount
    if (!selectedAccount) {
      setMessage("Please select an account to deposit into.");
      return;
    }
  
    if (!amount || Number(amount) <= 0) {
      setMessage("Please enter a valid deposit amount.");
      return;
    }
  
    if (Number(amount) > MAX_DEPOSIT_LIMIT) {
      setMessage(`Deposit limit exceeded! You can only deposit up to $${MAX_DEPOSIT_LIMIT}.`);
      return;
    }
  
    try {
      // Send API request
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${uname}/accounts/deposit`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          accountType: selectedAccount,
          depositAmount: Number(amount),
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setMessage(`Failed to deposit: ${data.message || "Unknown error occurred"}`);
        return;
      }
  
      setMessage(`Successfully deposited $${amount} into your ${selectedAccount} account.`);
    } catch (error) {
      console.error("Error:", error);
      setMessage("An unexpected error occurred. Please try again.");
    }
  };  

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Deposit Funds</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          style={styles.select}
        >
          <option value="">Select Account</option>
          <option value="checking">Checking Account</option>
          <option value="savings">Savings Account</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Deposit
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
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  message: {
    marginTop: "20px",
    fontSize: "16px",
    color: "#d9534f", // Red for error messages
    fontWeight: "bold",
  },
};
