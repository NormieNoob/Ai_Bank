"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from 'next/navigation';

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/user/info`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        const data = await response.json();
        if (data.success) {
          setUserInfo(data.user);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserInfo();
  }, [params.uname]);

  const handleUpgrade = async () => {
    try {
      console.log("Starting upgrade process..."); // Debug log
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/user/upgrade-subscription`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log("Response received:", response.status); // Debug log

      const data = await response.json();
      console.log("Response data:", data); // Debug log

      if (data.success) {
        // Refresh user data after upgrade
        const refreshResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/user/info`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setUserInfo(refreshData.user);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to upgrade subscription. Please try again.');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.welcomeMessage}>
        <span style={styles.welcomeText}>Welcome </span>
        <span style={styles.userName}>
          {userInfo ? `${userInfo.firstName} ${userInfo.lastName}!` : ''}
        </span>
      </h1>
      
      {/* Subscription Status and Upgrade Button */}
      {userInfo && userInfo.subscription === 'free' && (
        <div style={styles.subscriptionBanner}>
          <div style={styles.subscriptionInfo}>
            <span style={styles.planBadge}>Free Plan</span>
            <p style={styles.upgradeText}>Upgrade to Premium for AI Banking Assistant and more features!</p>
          </div>
          <button onClick={handleUpgrade} style={styles.upgradeButton}>
            Upgrade to Premium
          </button>
        </div>
      )}

      <div style={styles.cardContainer}>
        {/* Savings Account Card */}
        <Link href={`/${params.uname}/accounts/savings`} passHref>
          <div style={styles.card}>
            <div style={styles.iconContainer}>
              <img
                src="/icons/savings-acc-icon.png"
                alt="Savings Account"
                style={styles.icon}
              />
            </div>
            <p style={styles.cardTitle}>Savings Accounts</p>
          </div>
        </Link>

        {/* Checking Account Card */}
        <Link href={`/${params.uname}/accounts/checking`} passHref>
          <div style={styles.card}>
            <div style={styles.iconContainer}>
              <img
                src="/icons/checking-acc-icon.png"
                alt="Checking Account"
                style={styles.icon}
              />
            </div>
            <p style={styles.cardTitle}>Checking Accounts</p>
          </div>
        </Link>

        {/* Credit Card */}
        <Link href={`/${params.uname}/accounts/creditcard`} passHref>
          <div style={styles.card}>
            <div style={styles.iconContainer}>
              <img
                src="/icons/credit-card-icon.png"
                alt="Credit Card"
                style={styles.icon}
              />
            </div>
            <p style={styles.cardTitle}>Credit Cards</p>
          </div>
        </Link>

        {/* Transaction Card */}
        <Link href={`/${params.uname}/accounts/transfer`} passHref>
          <div style={styles.card}>
            <div style={styles.iconContainer}>
              <img
                src="/icons/transfer.png"
                alt="transfer"
                style={styles.icon}
              />
            </div>
            <p style={styles.cardTitle}>Transfer</p>
          </div>
        </Link>

        {/* Deposit Card */}
        <Link href={`/${params.uname}/accounts/deposit`} passHref>
          <div style={styles.card}>
            <div style={styles.iconContainer}>
              <img
                src="/icons/deposit.png"
                alt="Deposit"
                style={styles.icon}
              />
            </div>
            <p style={styles.cardTitle}>Deposit</p>
          </div>
        </Link>
        {/* Withdrawal */}
        <Link href={`/${params.uname}/accounts/withdrawal`} passHref>
          <div style={styles.card}>
            <div style={styles.iconContainer}>
              <img
                src="/icons/withdrawal.png"
                alt="Deposit"
                style={styles.icon}
              />
            </div>
            <p style={styles.cardTitle}>Withdrawal</p>
          </div>
        </Link>
        {userInfo && userInfo.subscription === 'premium' && (
          <Link href={`/${params.uname}/chat`} passHref>
            <div style={styles.card}>
              <div style={styles.iconContainer}>
                <img
                  src="/icons/ai-chat.png"
                  alt="AI Chat"
                  style={styles.icon}
                />
              </div>
              <p style={styles.cardTitle}>AI Assistant</p>
            </div>
          </Link>
        )}

        {userInfo && userInfo.subscription === 'free' && (
          <div style={{...styles.card, ...styles.disabledCard}}>
            <div style={styles.iconContainer}>
              <img
                src="/icons/ai-chat.png"
                alt="AI Chat"
                style={{...styles.icon, opacity: 0.5}}
              />
            </div>
            <p style={styles.cardTitle}>AI Assistant</p>
            <p style={styles.upgradeText}>Premium Feature</p>
          </div>
        )}
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
    marginBottom: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
  },
  welcomeText: {
    color: "#007bff",
  },
  userName: {
    color: "#000000",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // First three cards in one row
    gap: "20px", // Space between cards
    justifyItems: "center",
    marginTop: "20px", // Space between rows
  },
  card: {
    width: "200px", // Uniform width
    height: "200px", // Uniform height
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
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
  disabledCard: {
    opacity: 0.5,
  },
  upgradeText: {
    fontSize: "0.9rem",
    color: "#666",
    marginTop: "10px",
  },
  subscriptionBanner: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  planBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: '#e8f4ff',
    color: '#007bff',
    fontSize: '14px',
    fontWeight: '600',
  },
  upgradeText: {
    margin: 0,
    fontSize: '16px',
    color: '#495057',
  },
  upgradeButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
};