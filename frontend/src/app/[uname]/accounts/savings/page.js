'use client'; // Mark this file as a client component

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const SavingsAccount = () => {
  const [balance, setBalance] = useState(null); // State to store the balance
  const [error, setError] = useState(null);    // State to handle errors
  const [loading, setLoading] = useState(true); // State to indicate loading
  const params = useParams(); // Get the `uname` from the URL parameters

  useEffect(() => {
    // Fetch the balance when the component mounts
    const fetchBalance = async () => {
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
        setBalance(data.balance);
        console.log(data.account_id) // Assuming the backend sends a balance field
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [params.uname]); // Depend on params.uname to refetch if it changes

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Savings Account</h2>
      <p>Your balance is: ${balance}</p>
    </div>
  );
};

export default SavingsAccount;
