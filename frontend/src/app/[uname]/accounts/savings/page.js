// 'use client'; // Mark this file as a client component

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';

// const SavingsAccount = () => {
//   const [balance, setBalance] = useState(null); // State to store the balance
//   const [error, setError] = useState(null);    // State to handle errors
//   const [loading, setLoading] = useState(true); // State to indicate loading
//   const [data, setData] = useState(null)
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

//         const data = await response.json();
//         setData(data)
//         if (data.success) {
//           setBalance(data.balance); 
//         }
//         else{
//           console.log(data.message)
//           console.log(data.status)
//           if(data.status==="accountNotFound"){
//             setBalance(data.message)
//           }
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBalance();
//   }, [params.uname]);

//   const handleCreateAccount = async () => {
//     setCreating(true);
//     setError(null);
    
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/accounts/create`,
//         {
//           method: 'POST',
//           credentials: 'include',
//         }
//       );

//       const result = await response.json();
      
//       if (result.success) {
//         // Refresh the account data after creation
//         setData(result);
//         setBalance(result.balance);
//       } else {
//         setError(result.message || 'Failed to create account');
//       }
//     } catch (err) {
//       setError(err.message || 'An error occurred while creating the account');
//     } finally {
//       setCreating(false);
//     }
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div>
//       <h2>Savings Account</h2>
//       {data && (data.success ? ( <p>Your balance is: {balance}</p>) : (
//       <div>
//         <p>{data.message}</p>
//         <p>Click here to Create a new Account <button onClick={}>Open Savings Account</button></p>
//       </div>
//       ))}
//     </div>
//   );
// };

// export default SavingsAccount;

// 'use client'; // Mark this file as a client component

// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';

// const SavingsAccount = () => {
//   const [accountDetails, setAccountDetails] = useState(null); // State to store account details
//   const [transactions, setTransactions] = useState([]); // Initialize as an empty array
//   const [error, setError] = useState(null); // State to handle errors
//   const [loading, setLoading] = useState(true); // State to indicate loading
//   const params = useParams(); // Get the `uname` from the URL parameters
//   const router = useRouter(); // Router for navigation

//   useEffect(() => {
//     // Fetch the savings account details when the component mounts
//     const fetchAccountDetails = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/accounts/savings`,
//           {
//             method: 'GET',
//             credentials: 'include', // Include cookies for session
//           }
//         );
//         console.log(response.json())
//         if (!response.ok) {
//           throw new Error(`Error: ${response.statusText}`);
//         }

//         const data = await response.json();
//         setAccountDetails(data.account_id);
//         setTransactions(data.transactionHistory || []); // Set to an empty array if undefined
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAccountDetails();
//   }, [params.uname]); // Depend on params.uname to refetch if it changes

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>Savings Account</h2>
//       <p style={styles.accountDetails}>
//         <strong>Account Number:</strong> {accountDetails?.accountNumber}
//       </p>
//       <p style={styles.accountDetails}>
//         <strong>Current Balance:</strong> ${accountDetails?.balance}
//       </p>

//       <button
//         style={styles.depositButton}
//         onClick={() => router.push(`/${params.uname}/accounts/deposit`)}
//       >
//         Deposit Funds
//       </button>

//       <h3 style={styles.subHeading}>Recent Transactions</h3>
//       {transactions && transactions.length > 0 ? ( // Add null check and length check
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Description</th>
//               <th>Amount</th>
//               <th>Type</th>
//             </tr>
//           </thead>
//           <tbody>
//             {transactions.slice(0, 5).map((transaction) => (
//               <tr key={transaction.transactionID}>
//                 <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
//                 <td>{transaction.description || 'N/A'}</td>
//                 <td>${transaction.amount}</td>
//                 <td>{transaction.transactionType}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No transactions found.</p>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: '800px',
//     margin: '0 auto',
//     fontFamily: 'Arial, sans-serif',
//     padding: '20px',
//     textAlign: 'center',
//   },
//   heading: {
//     fontSize: '2rem',
//     color: '#007bff',
//   },
//   accountDetails: {
//     fontSize: '1.2rem',
//     margin: '10px 0',
//   },
//   depositButton: {
//     padding: '10px 20px',
//     fontSize: '1rem',
//     backgroundColor: '#28a745',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     marginBottom: '20px',
//   },
//   subHeading: {
//     fontSize: '1.5rem',
//     marginTop: '30px',
//     color: '#333',
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse',
//     marginTop: '20px',
//   },
//   th: {
//     borderBottom: '1px solid #ddd',
//     padding: '10px',
//     textAlign: 'left',
//     backgroundColor: '#f8f9fa',
//   },
//   td: {
//     padding: '10px',
//     borderBottom: '1px solid #ddd',
//   },
// };

// export default SavingsAccount;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';

// const SavingsAccount = () => {
//   const [balance, setBalance] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState(null);
//   const [creating, setCreating] = useState(false);
//   const params = useParams();

//   const fetchBalance = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/accounts/savings`,
//         {
//           method: 'GET',
//           credentials: 'include',
//         }
//       );

//       const data = await response.json();
//       setData(data);
//       if (data.success) {
//         setBalance(data.balance);
//       } else {
//         console.log(data.message);
//         console.log(data.status);
//         if (data.status === "accountNotFound") {
//           setBalance(data.message);
//         }
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBalance();
//   }, [params.uname]);

//   const handleCreateAccount = async () => {
//     setCreating(true);
//     setError(null);
    
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/accounts/create`,
//         {
//           method: 'POST',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             accountType: 'savings'
//           })
//         }
//       );

//       const result = await response.json();
      
//       if (result.success) {
//         // After successful creation, fetch the updated account details
//         setLoading(true);
//         await fetchBalance();
//       } else {
//         setError(result.message || 'Failed to create account');
//       }
//     } catch (err) {
//       setError(err.message || 'An error occurred while creating the account');
//     } finally {
//       setCreating(false);
//     }
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div>
//       <h2>Savings Account</h2>
//       {data && (data.success ? (
//         <p>Your balance is: {balance}</p>
//       ) : (
//         <div>
//           <p>{data.message}</p>
//           <p>
//             Click here to Create a new Account{' '}
//             <button 
//               onClick={handleCreateAccount}
//               disabled={creating}
//             >
//               {creating ? 'Creating...' : 'Open Savings Account'}
//             </button>
//           </p>
//           {error && <p className="text-red-500">Error: {error}</p>}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SavingsAccount;

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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/accounts/savings/recent-transactions`,
        {
          method: 'GET',
          credentials: 'include',
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

