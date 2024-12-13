"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function TransferPage() {
  const params = useParams(); // Use useParams hook at the top level
  const [fromAccount, setFromAccount] = useState(""); // State to track selected "From Account"
  const [toUsername, setToUsername] = useState(""); // State to track "To Username"
  const [amount, setAmount] = useState(""); // State to track transfer amount
  const [description, setDescription] = useState(""); // State to track transfer description
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // State to track error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!fromAccount || !toUsername || !amount) {
      setError("Please fill out all required fields to complete the transfer.");
      return;
    }

    try {
      console.log(`accountType - ${fromAccount}, to - ${toUsername}, amount - ${amount}`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/accounts/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountType: fromAccount,
          toUsername,
          transferAmount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `Successfully transferred $${amount} from your ${fromAccount} account to ${toUsername}.`
        );
        setFromAccount("");
        setToUsername("");
        setAmount("");
        setDescription("");
      } else {
        setError(data.message || "An error occurred during the transfer.");
      }
    } catch (err) {
      console.log(err);
      setError("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Transfer Funds</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* From Account Dropdown */}
        <select
          value={fromAccount}
          onChange={(e) => setFromAccount(e.target.value)}
          style={styles.select}
        >
          <option value="">Select From Account</option>
          <option value="checking">Checking Account</option>
          <option value="savings">Savings Account</option>
        </select>

        {/* To Username */}
        <input
          type="text"
          value={toUsername}
          onChange={(e) => setToUsername(e.target.value)}
          placeholder="To Username"
          style={styles.input}
        />

        {/* Amount */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          style={styles.input}
        />

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          style={styles.textarea}
        ></textarea>

        {/* Submit Button */}
        <button type="submit" style={styles.button}>
          Transfer
        </button>

        {/* Success Message */}
        {message && <p style={{ ...styles.message, color: "#28a745" }}>{message}</p>}

        {/* Error Message */}
        {error && <p style={{ ...styles.message, color: "#dc3545" }}>{error}</p>}
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
  textarea: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    height: "80px",
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
  },
};
