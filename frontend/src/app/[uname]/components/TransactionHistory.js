"use client";

import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import Image from 'next/image';
import './TransactionHistory.css';

const TransactionHistory = ({ accountId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'savings',
      name: 'Transfer to Savings',
      amount: 500.00,
      status: 'Success',
      date: 'Wed 1:00pm',
      category: 'Transfer'
    },
    {
      id: 2,
      type: 'checking',
      name: 'Direct Deposit',
      amount: 2500.00,
      status: 'Success',
      date: 'Wed 2:45am',
      category: 'Deposit'
    },
    {
      id: 3,
      type: 'credit',
      name: 'Amazon Purchase',
      amount: -156.78,
      status: 'Processing',
      date: 'Mon 1:10pm',
      category: 'Shopping'
    },
  ]);

  const getTransactionIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'savings':
        return '/icons/savings-acc-icon.png';
      case 'checking':
        return '/icons/checking-acc-icon.png';
      case 'credit':
        return '/icons/credit-card-icon.png';
      default:
        return '/icons/checking-acc-icon.png'; // Default fallback
    }
  };

  return (
    <div className="transaction-history">
      <div className="header">
        <h1>Transaction history</h1>
        <p>Gain Insights and Track Your Transactions Over Time</p>
        
        <div className="account-card">
          <div className="account-info">
            <h2>Chase</h2>
            <p>Chase Growth Savings Account</p>
            <p>•••• •••• •••• 9999</p>
          </div>
          <div className="balance">
            <p>Current Balance</p>
            <h2>{formatCurrency(41382.80)}</h2>
          </div>
        </div>
      </div>

      <div className="transactions-table">
        <div className="table-header">
          <div className="transaction-col">Transaction</div>
          <div className="amount-col">Amount</div>
          <div className="status-col">Status</div>
          <div className="date-col">Date</div>
          <div className="category-col">Category</div>
        </div>

        {transactions.map(transaction => (
          <div key={transaction.id} className="transaction-row">
            <div className="transaction-col">
              <span className="transaction-icon">
                <Image
                  src={getTransactionIcon(transaction.type)}
                  alt={transaction.name}
                  width={24}
                  height={24}
                />
              </span>
              <span className="transaction-name">{transaction.name}</span>
            </div>
            <div className={`amount-col ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
              {formatCurrency(transaction.amount)}
            </div>
            <div className="status-col">
              <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                {transaction.status}
              </span>
            </div>
            <div className="date-col">{transaction.date}</div>
            <div className="category-col">
              <span className="category-badge">{transaction.category}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</button>
        <div className="page-numbers">
          {[1, 2, 3, '...', 8, 9, 10].map((page, index) => (
            <button 
              key={index}
              className={currentPage === page ? 'active' : ''}
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
        <button onClick={() => setCurrentPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default TransactionHistory; 