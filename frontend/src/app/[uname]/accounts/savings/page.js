'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const SavingsAccount = () => {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const params = useParams();

  const fetchBalance = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/accounts/savings`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      const data = await response.json();
      if (data.success) {
        setBalance(data.balance);
      } else {
        if (data.status === 'accountNotFound') {
          setBalance(data.message);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/accounts/recent-transactions`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accountType: 'savings',
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
        setError(data.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching transactions');
    }
  };

  const handleCreateAccount = async () => {
    setCreating(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/accounts/create`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accountType: 'savings',
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setLoading(true);
        await fetchBalance();
        await fetchTransactions();
      } else {
        setError(result.message || 'Failed to create account');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the account');
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [params.uname]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Savings Account</h2>
      {balance !== null && (
        <p style={styles.balance}>Your balance is: ${balance}</p>
      )}
      {transactions.length > 0 && (
        <div style={styles.transactionContainer}>
          <h3 style={styles.subHeading}>Recent Transactions</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.TransactionID}>
                  <td>{transaction.TransactionID}</td>
                  <td>${transaction.Amount}</td>
                  <td>{transaction.TransactionType}</td>
                  <td>{new Date(transaction.TransactionDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {balance === null && (
        <div>
          <p>No account found.</p>
          <button
            onClick={handleCreateAccount}
            disabled={creating}
            style={styles.button}
          >
            {creating ? 'Creating...' : 'Open Savings Account'}
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '50px auto',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  balance: {
    fontSize: '1.5rem',
    color: '#007bff',
    marginBottom: '20px',
  },
  transactionContainer: {
    marginTop: '30px',
  },
  subHeading: {
    fontSize: '1.2rem',
    marginBottom: '15px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
    backgroundColor: '#f4f4f4',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default SavingsAccount;

