import React from 'react';
import TransactionHistory from '@/app/components/TransactionHistory';


const SavingsAccount = () => (
  <div>
    <h2>Savings Account</h2>
    <p>Manage your savings account here.</p>
    <TransactionHistory accountId="1 " />
  </div>
);

export default SavingsAccount;
