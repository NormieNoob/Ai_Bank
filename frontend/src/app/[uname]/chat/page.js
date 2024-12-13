"use client";

import { useState, useEffect } from "react";
import { getGeminiResponse } from "@/utils/gemini";
import Navbar from "../components/navbar";
import { useParams } from 'next/navigation';
import SpendingGraph from '@/utils/SpendingGraph';

const TransactionSection = ({ transactions, error }) => {
  const getAmountColor = (amount) => {
    const numAmount = parseFloat(amount);
    return numAmount >= 0 ? '#28a745' : '#dc3545'; // Green for positive, red for negative
  };

  if (error) {
    return (
      <div style={styles.transactionSection}>
        <div style={styles.transactionHeader}>
          <h2 style={styles.transactionTitle}>Recent transactions</h2>
        </div>
        <div style={styles.emptyState}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.transactionSection}>
      <div style={styles.transactionHeader}>
        <h2 style={styles.transactionTitle}>Recent transactions</h2>
        <button style={styles.viewAllButton}>View all</button>
      </div>
      {transactions.length > 0 ? (
        <div style={styles.transactionList}>
          {transactions.map((transaction, index) => (
            <div key={index} style={styles.transactionItem}>
              <div style={styles.transactionIcon}>
                🔄
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
  );
};

const TransactionAnalytics = ({ transactions, error }) => {
  if (error) {
    return null;
  }

  return (
    <div style={styles.analyticsSection}>
      <SpendingGraph transactions={transactions} />
    </div>
  );
};

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const params = useParams();

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      role: "assistant",
      content: "Hello! I'm your AI Banking Assistant. I can help you with:\n\n" +
        "-Account Information: Check balances and recent transactions\n" +
        "-Transaction Analysis: Get insights about your spending\n" +
        "-Banking Services: Learn about our products and services\n\n" +
        "I notice you have some recent transactions in the panel to the right. Would you like me to provide a summary of your transactions for this month?"
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
      if (messages.length === 1 && messages[0].content.includes("Would you like me to provide a summary")) {
        await handleTransactionSummary(input);
      } else {
        // Check if the question is about spending or transactions
        const spendingKeywords = ['spend', 'spent', 'spending', 'transaction', 'purchase', 'bought', 'pay', 'paid'];
        const isSpendingQuery = spendingKeywords.some(keyword => 
          input.toLowerCase().includes(keyword)
        );

        if (isSpendingQuery && transactions.length > 0) {
          // Calculate spending insights
          const allTransactions = [...transactions];
          const totalSpent = allTransactions
            .filter(t => parseFloat(t.amount) < 0)
            .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
          
          const spendingByType = allTransactions
            .filter(t => parseFloat(t.amount) < 0)
            .reduce((acc, t) => {
              acc[t.type] = (acc[t.type] || 0) + Math.abs(parseFloat(t.amount));
              return acc;
            }, {});

          // Format spending breakdown
          const spendingBreakdown = Object.entries(spendingByType)
            .map(([type, amount]) => `-${type}: $${amount.toFixed(2)}`)
            .join('\n');

          const response = {
            role: "assistant",
            content: `Based on your recent transactions (visible in the right panel), here's your spending breakdown:\n\n` +
              `Total Spent: $${totalSpent.toFixed(2)}\n\n` +
              `Breakdown by transaction type:\n${spendingBreakdown}\n\n` +
              `You can see your most recent transactions in detail in the panel to the right. ` +
              `Would you like me to analyze any specific type of transaction or provide more detailed insights?`
          };
          setMessages(prev => [...prev, response]);
        } else {
          // Enhance Gemini's context with transaction awareness
          const contextualInput = `User has access to their recent transactions panel showing their latest banking activities. 
                                 Their question is: ${input}
                                 Consider referencing the transaction panel when relevant to the response.
                                 Recent transactions summary: ${JSON.stringify(transactions)}`;
          
          const response = await getGeminiResponse(contextualInput);
          const aiMessage = {
            role: "assistant",
            content: response,
          };
          setMessages(prev => [...prev, aiMessage]);
        }
      }
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
    // Remove excessive blank lines and asterisks
    const cleanText = text
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/\* \*\*/g, '-')  // Replace "* **" with "-"
      .replace(/\*\*/g, '')      // Remove remaining "**"
      .replace(/\*/g, '');       // Remove single "*"
    
    // Split into lines and process each line
    const lines = cleanText.split('\n').map((line, index) => {
      // Check if line starts with a hyphen
      if (line.trim().startsWith('-')) {
        const [title, ...rest] = line.substring(1).split(':');
        return (
          <div key={index} style={styles.listItem}>
            <strong style={styles.boldText}>{title.trim()}</strong>
            <span>:{rest.join(':')}</span>
          </div>
        );
      }
      // Check if it's the introduction line
      if (line.includes('As an AI Language Model:')) {
        return (
          <div key={index} style={styles.introduction}>
            {line}
          </div>
        );
      }
      // Regular line
      return <div key={index} style={styles.lineBreak}>{line}</div>;
    });

    return lines;
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
            <TransactionAnalytics transactions={transactions} error={error} />
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
  },
  boldText: {
    fontWeight: 'bold',
    display: 'inline',
  },
  listItem: {
    marginBottom: '8px',
    paddingLeft: '20px',
    position: 'relative',
  },
  introduction: {
    marginBottom: '16px',
    fontSize: '1.2em',
    fontWeight: 'bold',
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
  },
  transactionDetails: {
    flex: '1',
  },
  transactionType: {
    fontWeight: 'bold',
  },
  transactionDate: {
    color: '#666',
  },
  transactionRight: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionAmount: {
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  transactionStatus: (status) => ({
    color: status === 'confirmed' ? '#007bff' : '#ff0000',
  }),
  emptyState: {
    textAlign: 'center',
    color: '#666',
    marginTop: '10px',
  },
  analyticsSection: {
    marginTop: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  }
}; 