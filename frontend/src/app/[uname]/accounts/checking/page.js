'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const CheckingAccount = () => {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [creating, setCreating] = useState(false);
  const params = useParams();

  const fetchBalance = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/accounts/checking`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      const data = await response.json();
      setData(data);
      if (data.success) {
        setBalance(data.balance);
      } else {
        console.log(data.message);
        console.log(data.status);
        if (data.status === "accountNotFound") {
          setBalance(data.message);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [params.uname]);

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
            accountType: 'checking'
          })
        }
      );

      const result = await response.json();
      
      if (result.success) {
        // After successful creation, fetch the updated account details
        setLoading(true);
        await fetchBalance();
      } else {
        setError(result.message || 'Failed to create account');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the account');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Checking Account</h2>
      {data && (data.success ? (
        <p>Your balance is: {balance}</p>
      ) : (
        <div>
          <p>{data.message}</p>
          <p>
            Click here to Create a new Account{' '}
            <button 
              onClick={handleCreateAccount}
              disabled={creating}
            >
              {creating ? 'Creating...' : 'Open Checking Account'}
            </button>
          </p>
          {error && <p className="text-red-500">Error: {error}</p>}
        </div>
      ))}
    </div>
  );
};

export default CheckingAccount;