"use client";

export default function WithdrawalPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Withdraw Funds</h1>
      <form style={styles.form}>
        <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          style={styles.input}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          style={styles.input}
        />
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          style={styles.textarea}
        ></textarea>
        <button type="submit" style={styles.button}>
          Withdraw
        </button>
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
};
