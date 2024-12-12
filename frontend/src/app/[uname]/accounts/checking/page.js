'use client'; // Mark this file as a client component

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const CheckingAccount = () => {
  const [balance, setBalance] = useState(null); // State to store the balance
  const [error, setError] = useState(null);    // State to handle errors
  const [loading, setLoading] = useState(true); // State to indicate loading
  const [data, setData] = useState(null)
  const params = useParams(); // Get the `uname` from the URL parameters

  useEffect(() => {
    // Fetch the balance when the component mounts
    const fetchBalance = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/accounts/checking`,
          {
            method: 'GET',
            credentials: 'include', // Include cookies for session
          }
        );

        // if (!response.ok) {
        //   throw new Error(`Error: ${response.statusText}`);
        // }

        const data = await response.json();
        setData(data)
        if (data.success) {
          setBalance(data.balance); 
        }
        else{
          console.log(data)
          setBalance(data.message)
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [params.uname]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Checking Account</h2>
      {data && (data.success ? ( <p>Your balance is: {balance}</p>) : (<p>{data.message}</p>))}
    </div>
  );
};

export default CheckingAccount;
