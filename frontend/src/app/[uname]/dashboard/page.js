"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from 'next/navigation'

export default function DashboardPage() {
  const [username, setUsername] = useState(""); 
  const params = useParams();

  return (
    <div style={styles.container}>
      <h1 style={styles.welcomeMessage}>Welcome {username}!</h1>
      <div style={styles.cardContainer}>
      <Link href={`/${params.uname}/accounts/savings`} passHref>
          <div style={styles.card}>
            <div style={styles.iconContainer}>
              <img
                src="../icons/savings-acc-icon.png"
                alt="Savings Account"
                style={styles.icon}
              />
            </div>
            <p style={styles.cardTitle}>Savings Accounts</p>
          </div>
        </Link>
        <Link href={`/${params.uname}/accounts/checking`} passHref>
          <div style={styles.card}>
            <div style={styles.iconContainer}>
              <img
                src="../icons/checking-acc-icon.png"
                alt="Checking Account"
                style={styles.icon}
              />
            </div>
            <p style={styles.cardTitle}>Checking Accounts</p>
          </div>
        </Link>
        <Link href={`/${params.uname}/accounts/creditcard`} passHref>
          <div style={styles.card}>
            <div style={styles.iconContainer}>
              <img
                src="../icons/credit-card-icon.png"
                alt="Credit Card"
                style={styles.icon}
              />
            </div>
            <p style={styles.cardTitle}>Credit Cards</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "50px auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  welcomeMessage: {
    fontSize: "2rem",
    color: "#007bff",
    marginBottom: "40px",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },
  card: {
    width: "250px",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  cardHover: {
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
    },
  },
  iconContainer: {
    backgroundColor: "#f9f9ff",
    padding: "35px",
    borderRadius: "50%",
    display: "inline-block",
    marginBottom: "10px",
  },
  icon: {
    width: "40px",
    height: "40px",
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#007bff",
    marginTop: "10px",
  },
};
