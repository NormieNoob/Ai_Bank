// 'use client'; // Mark this file as a client component

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';

// const SavingsAccount = () => {
//   const [balance, setBalance] = useState(null); // State to store the balance
//   const [error, setError] = useState(null);    // State to handle errors
//   const [loading, setLoading] = useState(true); // State to indicate loading
//   const params = useParams(); // Get the `uname` from the URL parameters

//   useEffect(() => {
//     // Fetch the balance when the component mounts
//     const fetchBalance = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/accounts/savings`,
//           {
//             method: 'GET',
//             credentials: 'include', // Include cookies for session
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`Error: ${response.statusText}`);
//         }

//         const data = await response.json();
//         setBalance(data.balance);
//         console.log(data.account_id) // Assuming the backend sends a balance field
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBalance();
//   }, [params.uname]); // Depend on params.uname to refetch if it changes

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div>
//       <h2>Savings Account</h2>
//       <p>Your balance is: ${balance}</p>
//     </div>
//   );
// };

// export default SavingsAccount;

'use client'; // Mark this file as a client component

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const SavingsAccount = () => {
  const [accountDetails, setAccountDetails] = useState(null); // State to store account details
  const [transactions, setTransactions] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null); // State to handle errors
  const [loading, setLoading] = useState(true); // State to indicate loading
  const params = useParams(); // Get the `uname` from the URL parameters
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    // Fetch the savings account details when the component mounts
    const fetchAccountDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/accounts/savings`,
          {
            method: 'GET',
            credentials: 'include', // Include cookies for session
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setAccountDetails(data.account_id);
        setTransactions(data.transactionHistory || []); // Set to an empty array if undefined
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [params.uname]); // Depend on params.uname to refetch if it changes

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Savings Account</h2>
      <p style={styles.accountDetails}>
        <strong>Account Number:</strong> {accountDetails?.accountNumber}
      </p>
      <p style={styles.accountDetails}>
        <strong>Current Balance:</strong> ${accountDetails?.balance}
      </p>

      <button
        style={styles.depositButton}
        onClick={() => router.push(`/${params.uname}/accounts/deposit`)}
      >
        Deposit Funds
      </button>

      <h3 style={styles.subHeading}>Recent Transactions</h3>
      {transactions && transactions.length > 0 ? ( // Add null check and length check
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 5).map((transaction) => (
              <tr key={transaction.transactionID}>
                <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                <td>{transaction.description || 'N/A'}</td>
                <td>${transaction.amount}</td>
                <td>{transaction.transactionType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    color: '#007bff',
  },
  accountDetails: {
    fontSize: '1.2rem',
    margin: '10px 0',
  },
  depositButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  subHeading: {
    fontSize: '1.5rem',
    marginTop: '30px',
    color: '#333',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    borderBottom: '1px solid #ddd',
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
};

export default SavingsAccount;

