"use client";

import React from 'react';
import { useState, useEffect } from "react";
import { getGeminiResponse } from "@/utils/gemini";
import Navbar from "../components/navbar";
import { useParams } from 'next/navigation';
import SpendingGraph from '@/utils/SpendingGraph';
import TransactionLineChart from '@/utils/TransactionLineChart';

const TransactionSection = ({ transactions, error }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const getAmountColor = (amount) => {
    const numAmount = parseFloat(amount);
    return numAmount >= 0 ? '#28a745' : '#dc3545';
  };

  const getTransactionIcon = (type) => {
    const typeToLower = type.toLowerCase();
    
    // Simplified map of transaction types to icons
    const iconMap = {
      deposit: '💵',
      withdrawal: '💳',
      transfer: '↔️'
    };

    // Return matching icon or default icon
    return iconMap[typeToLower] || '🔄';
  };

  if (error) {
    return (
      <div style={styles.transactionSection}>
        <div style={styles.transactionHeader}>
          <h2 style={styles.transactionTitle}>Recent transactions</h2>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={styles.viewAllButton}
          >
            {isCollapsed ? 'View all' : 'View less'}
          </button>
        </div>
        <div style={{
          ...styles.transactionContent,
          maxHeight: isCollapsed ? '200px' : '600px',
          overflow: 'hidden'
        }}>
          <div style={styles.emptyState}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.transactionSection}>
      <div style={styles.transactionHeader}>
        <h2 style={styles.transactionTitle}>Recent transactions</h2>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={styles.viewAllButton}
        >
          {isCollapsed ? 'View all' : 'View less'}
        </button>
      </div>
      <div style={{
        ...styles.transactionContent,
        maxHeight: isCollapsed ? '200px' : '600px',
        overflow: 'hidden'
      }}>
        {transactions.length > 0 ? (
          <div style={styles.transactionList}>
            {transactions.map((transaction, index) => (
              <div key={index} style={styles.transactionItem}>
                <div style={styles.transactionIcon}>
                  {getTransactionIcon(transaction.type)}
                </div>
                <div style={styles.transactionDetails}>
                  <div style={styles.transactionType}>{transaction.type}</div>
                  <div style={styles.transactionDate}>{transaction.date}</div>
                </div>
                <div style={styles.transactionRight}>
                  <div style={{
                    ...styles.transactionAmount,
                    color: getAmountColor(transaction.amount)
                  }}>
                    $ {transaction.amount}
                  </div>
                  <div style={styles.transactionStatus(transaction.status)}>
                    {transaction.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            No transactions to display
          </div>
        )}
      </div>
    </div>
  );
};

const TransactionAnalytics = ({ transactions }) => {
  const [isChartsVisible, setIsChartsVisible] = useState(true);

  return (
    <div style={styles.analyticsSection}>
      <div style={styles.analyticsHeader}>
        <h2 style={styles.analyticsTitle}>Analytics</h2>
        <button 
          onClick={() => setIsChartsVisible(!isChartsVisible)}
          style={styles.toggleButton}
        >
          {isChartsVisible ? 'Hide Charts' : 'Show Charts'}
        </button>
      </div>
      
      <div style={{
        ...styles.chartsRow,
        display: isChartsVisible ? 'flex' : 'none',
        transition: 'all 0.3s ease-in-out'
      }}>
        <div style={styles.chartContainer}>
          <SpendingGraph transactions={transactions} />
        </div>
        <div style={styles.chartContainer}>
          <TransactionLineChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const params = useParams();

  // Add useEffect to fetch user info
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
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    fetchUserInfo();
  }, [params.uname]);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      role: "assistant",
      content: "Hello! I'm your AI Banking Assistant. I can help you with:\n\n" +
        "-Account Information: Check balances and recent transactions\n" +
        "-Transaction Analysis: Get insights about your spending\n" +
        "-Banking Services: Learn about our products and services\n\n" +
        "How can I assist you today?"
    };
    setMessages([welcomeMessage]);
  }, []);

  // Fetch transactions periodically
  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTransactions = async () => {
    try {
      const checkingResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${params.uname}/accounts/recent-transactions`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accountType: 'checking',
          }),
        }
      );

      const savingsResponse = await fetch(
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

      const checkingData = await checkingResponse.json();
      const savingsData = await savingsResponse.json();

      if (checkingData.success && savingsData.success) {
        const allTransactions = [...checkingData.transactions, ...savingsData.transactions]
          .sort((a, b) => new Date(b.TransactionDate) - new Date(a.TransactionDate))
          .map(t => ({
            type: t.TransactionType,
            date: new Date(t.TransactionDate).toLocaleString(),
            amount: t.Amount.toFixed(2),
            status: 'confirmed',
            accountType: t.AccountType
          }))
          .slice(0, 4);
        
        setTransactions(allTransactions);
      } else {
        setError(checkingData.message || savingsData.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError('An error occurred while fetching transactions');
      console.error('Transaction fetch error:', err);
    }
  };

  const handleTransactionSummary = async (userInput) => {
    if (userInput.toLowerCase().includes('yes')) {
      setIsLoading(true);
      try {
        const allTransactions = [...transactions];
        
        const totalDeposits = allTransactions
          .filter(t => parseFloat(t.amount) > 0)
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        const totalWithdrawals = allTransactions
          .filter(t => parseFloat(t.amount) < 0)
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const summaryMessage = {
          role: "assistant",
          content: "Here's your transaction summary for this month:\n\n" +
            `-Total Deposits: $${totalDeposits.toFixed(2)}\n` +
            `-Total Withdrawals: $${Math.abs(totalWithdrawals).toFixed(2)}\n` +
            `-Net Change: $${(totalDeposits + totalWithdrawals).toFixed(2)}\n\n` +
            "You can see your most recent transactions in the panel to the right. " +
            "Would you like to:\n" +
            "-Analyze your spending patterns?\n" +
            "-Get details about specific transactions?\n" +
            "-Learn about ways to optimize your banking?"
        };
        
        setMessages(prev => [...prev, summaryMessage]);
      } catch (err) {
        const errorMessage = {
          role: "assistant",
          content: "I apologize, but I couldn't fetch your transaction summary at the moment. " +
            "However, you can view your recent transactions in the panel to the right. " +
            "Is there something specific you'd like to know about your transactions?"
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    } else {
      const response = {
        role: "assistant",
        content: "No problem! You can always view your recent transactions in the panel to the right. " +
          "Is there anything else I can help you with regarding your banking needs?"
      };
      setMessages(prev => [...prev, response]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = messages
        .slice(-4)
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const contextualInput = `
        User Information:
        - Name: ${userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'User'}
        - Subscription: ${userInfo ? userInfo.subscription : 'unknown'} plan
        
        Previous conversation:
        ${conversationHistory}

        User's current question: ${input}

        Current context:
        - User has access to their recent transactions panel
        - Recent transactions: ${JSON.stringify(transactions)}
        - User's account activity is visible in the right panel

        Instructions:
        - Address the user by their first name when appropriate
        - Provide personalized responses based on their subscription status
        - Maintain a professional but friendly tone
        - Respond in a contextually appropriate way, maintaining conversation continuity
      `;

      const response = await getGeminiResponse(contextualInput);
      const aiMessage = {
        role: "assistant",
        content: response,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. In the meantime, you can check your recent transactions in the panel to the right. Please try your question again."
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (text) => {
    // First check if the text contains a table
    if (text.includes('|')) {
      const lines = text.split('\n');
      const tableLines = [];
      const otherLines = [];
      let isInTable = false;

      lines.forEach(line => {
        if (line.trim().startsWith('|')) {
          isInTable = true;
          tableLines.push(line);
        } else {
          if (isInTable) {
            // If we were in a table but this line isn't part of it,
            // render the table and start collecting normal lines
            otherLines.push(renderTable(tableLines));
            tableLines.length = 0;
            isInTable = false;
          }
          otherLines.push(line);
        }
      });

      // If we ended while still collecting table lines
      if (tableLines.length > 0) {
        otherLines.push(renderTable(tableLines));
      }

      return otherLines.map((line, index) => {
        if (React.isValidElement(line)) {
          return line;
        }
        return formatLine(line, index);
      });
    }

    // If no table, process as before
    return text.split('\n').map((line, index) => formatLine(line, index));
  };

  const renderTable = (tableLines) => {
    // Parse table structure
    const rows = tableLines.map(line => 
      line.trim()
        .split('|')
        .filter(cell => cell.trim() !== '')
        .map(cell => cell.trim())
    );

    if (rows.length < 2) return null; // Need at least header and separator

    const headers = rows[0];
    const isValidSeparator = rows[1].every(cell => cell.match(/^[-:]+$/));
    const dataRows = isValidSeparator ? rows.slice(2) : rows.slice(1);

    return (
      <div style={styles.tableWrapper} key={`table-${Date.now()}`}>
        <table style={styles.table}>
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i} style={styles.th}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, i) => (
              <tr key={i} style={styles.tr}>
                {row.map((cell, j) => {
                  // Special formatting for amounts
                  const isAmount = cell.includes('$') || (!isNaN(parseFloat(cell)) && cell.includes('.'));
                  const amount = isAmount ? parseFloat(cell.replace('$', '')) : null;
                  
                  return (
                    <td 
                      key={j} 
                      style={{
                        ...styles.td,
                        ...(isAmount && {
                          color: amount >= 0 ? '#28a745' : '#dc3545',
                          textAlign: 'right'
                        })
                      }}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const formatLine = (line, index) => {
    // Handle bold text with ** or __
    const boldPattern = /\*\*(.*?)\*\*|__(.*?)__/g;
    if (boldPattern.test(line)) {
      const parts = line.split(boldPattern);
      return (
        <div key={index} style={styles.lineBreak}>
          {parts.map((part, i) => {
            if (i % 3 === 1 || i % 3 === 2) { // Bold text parts
              return part ? <strong key={i} style={styles.boldText}>{part}</strong> : null;
            }
            return part;
          })}
        </div>
      );
    }

    // Handle bullet points/lists
    if (line.trim().startsWith('-')) {
      const [title, ...rest] = line.substring(1).split(':');
      return (
        <div key={index} style={styles.listItem}>
          <strong style={styles.boldText}>{title.trim()}</strong>
          <span>{rest.length > 0 ? `:${rest.join(':')}` : ''}</span>
        </div>
      );
    }
    
    // Handle AI introduction line
    if (line.includes('As an AI Language Model:')) {
      return (
        <div key={index} style={styles.introduction}>
          {line}
        </div>
      );
    }

    // Handle empty lines
    if (!line.trim()) {
      return <div key={index} style={styles.emptyLine}></div>;
    }
    
    // Default text line
    return <div key={index} style={styles.lineBreak}>{line}</div>;
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.chatSection}>
            <h1 style={styles.heading}>AI Banking Assistant</h1>
            <div style={styles.chatContainer}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={message.role === "user" ? styles.userMessage : styles.aiMessage}
                >
                  {formatMessage(message.content)}
                </div>
              ))}
              {isLoading && (
                <div style={styles.aiMessage}>
                  <p>Thinking...</p>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about banking..."
                style={styles.input}
                disabled={isLoading}
              />
              <button type="submit" style={styles.button} disabled={isLoading}>
                Send
              </button>
            </form>
          </div>
          <div style={styles.rightPanel}>
            <TransactionSection transactions={transactions} error={error} />
            <TransactionAnalytics transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Proxima Nova, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  content: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px', // Add space below navbar
  },
  chatSection: {
    flex: '2',
    maxWidth: '800px',
  },
  rightPanel: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  heading: {
    textAlign: "center",
    color: "#007bff",
    marginBottom: "20px",
    fontWeight: "600",
    fontFamily: 'Proxima Nova, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  chatContainer: {
    height: "60vh",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    fontFamily: 'Proxima Nova, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  userMessage: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 15px",
    borderRadius: "15px",
    marginBottom: "10px",
    maxWidth: "70%",
    marginLeft: "auto",
    fontFamily: 'Proxima Nova, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  aiMessage: {
    backgroundColor: "#f0f0f0",
    padding: "15px",
    borderRadius: "15px",
    marginBottom: "10px",
    maxWidth: "70%",
    whiteSpace: "pre-line",
    fontSize: "16px",
    lineHeight: "1.5",
    fontFamily: 'Proxima Nova, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  form: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
    fontFamily: 'Proxima Nova, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontFamily: 'Proxima Nova, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  header: {
    fontWeight: 'bold',
    fontSize: '1.1em',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  paragraph: {
    marginBottom: '10px',
    lineHeight: '1.5',
  },
  bulletPoint: {
    marginLeft: '20px',
    marginBottom: '5px',
    listStyleType: 'disc',
  },
  emphasis: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  lineBreak: {
    marginBottom: '8px',
    lineHeight: '1.5',
  },
  boldText: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  listItem: {
    marginBottom: '8px',
    paddingLeft: '20px',
    position: 'relative',
    lineHeight: '1.5',
    '&::before': {
      content: '•',
      position: 'absolute',
      left: '8px',
    },
  },
  introduction: {
    marginBottom: '16px',
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderLeft: '3px solid #007bff',
    borderRadius: '4px',
  },
  emptyLine: {
    height: '0.5em',
  },
  transactionSection: {
    flex: '1',
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
  },
  transactionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  transactionTitle: {
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  viewAllButton: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px 10px',
    borderRadius: '4px',
    ':hover': {
      backgroundColor: '#f0f0f0',
    },
  },
  transactionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  transactionItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  transactionIcon: {
    marginRight: '10px',
    fontSize: '1.5em', // Make icons slightly larger
    width: '30px',     // Fixed width to align transactions
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionDetails: {
    flex: '1',
  },
  transactionType: {
    fontWeight: 'bold',
  },
  transactionDate: {
    color: '#666',
    fontSize: '0.85em',  // Make the date text smaller
    marginTop: '2px',    // Add a small gap between type and date
  },
  transactionRight: {
    display: 'flex',
    flexDirection: 'column',  // Stack amount and status vertically
    alignItems: 'flex-end',   // Align items to the right
    gap: '4px',              // Add space between amount and status
    minWidth: '100px',       // Ensure consistent width for the right section
  },
  transactionAmount: {
    fontWeight: 'bold',
    marginBottom: '2px',
  },
  transactionStatus: (status) => ({
    color: status === 'confirmed' ? '#007bff' : '#ff0000',
    fontSize: '0.85em',     // Make status text smaller
    opacity: 0.8,           // Make it slightly more subtle
  }),
  emptyState: {
    textAlign: 'center',
    color: '#666',
    marginTop: '10px',
  },
  analyticsSection: {
    marginTop: '20px',
    width: '100%'
  },
  chartsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    width: '100%'
  },
  chartContainer: {
    flex: 1,
    maxWidth: 'calc(50% - 10px)', // 50% width minus half of the gap
    height: '200px', // Reduced height
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  sideSection: {
    width: '400px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderLeft: '1px solid #dee2e6',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  transactionContent: {
    transition: 'max-height 0.3s ease-in-out',
  },
  tableWrapper: {
    margin: '10px 0',
    overflowX: 'auto',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    fontSize: '0.9rem',
  },
  
  th: {
    backgroundColor: '#f8f9fa',
    color: '#495057',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #dee2e6',
    fontWeight: '600',
  },
  
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #dee2e6',
    color: '#212529',
  },
  
  tr: {
    '&:hover': {
      backgroundColor: '#f8f9fa',
    },
  },
  analyticsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  analyticsTitle: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    margin: 0,
  },
  toggleButton: {
    padding: '6px 12px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    color: '#007bff',
    fontSize: '0.9em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#e9ecef',
    },
  },
}; 