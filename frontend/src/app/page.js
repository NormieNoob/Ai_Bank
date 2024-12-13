"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState('free');
  const router = useRouter();

  const handleSignup = (plan) => {
    localStorage.setItem('selectedPlan', plan);
    router.push('/signup');
  };

  return (
    <main style={styles.container}>
      <div style={styles.contentSection}>
        <div style={styles.heroSection}>
          <div style={styles.heroText}>
            <h1 style={styles.heading}>
              Welcome to the <span style={styles.highlight}>Online AI Banking</span> System.
            </h1>
            <p style={styles.subtext}>
              Experience modern banking with AI assistance. Manage your accounts, 
              track transactions, and get personalized financial insights - all in one place.
            </p>
            <div style={styles.buttonGroup}>
              <a href="/signin" style={styles.loginButton}>Sign In</a>
              <button 
                onClick={() => handleSignup(selectedPlan)} 
                style={styles.signupButton}
              >
                Sign Up
              </button>
            </div>
          </div>
          <div style={styles.imageSection}>
            <img 
              src="/icons/banking-ai.png" 
              alt="AI Banking Assistant"
              style={styles.illustration}
            />
          </div>
        </div>

        <div style={styles.pricingSection}>
          <h2 style={styles.pricingTitle}>
            Pick the plan <span style={styles.highlight}>that's right for you</span>
          </h2>
          
          {/* Plan Selection Toggle */}
          <div style={styles.planToggle}>
            <button 
              style={{
                ...styles.planToggleButton,
                ...(selectedPlan === 'free' ? styles.planToggleButtonActive : {})
              }}
              onClick={() => setSelectedPlan('free')}
            >
              Free Plan
            </button>
            <button 
              style={{
                ...styles.planToggleButton,
                ...(selectedPlan === 'premium' ? styles.planToggleButtonActive : {})
              }}
              onClick={() => setSelectedPlan('premium')}
            >
              Premium Plan
            </button>
          </div>

          <div style={styles.pricingContainer}>
            {/* Free Plan */}
            <div 
              onClick={() => handleSignup('free')} 
              style={styles.cardLink}
            >
              <div style={{
                ...styles.pricingCard,
                ...(selectedPlan === 'free' ? styles.selectedCard : {})
              }}>
                <div style={styles.planBadge}>Free</div>
                <div style={styles.planPrice}>
                  <span style={styles.currency}>$</span>
                  <span style={styles.amount}>0</span>
                  <span style={styles.period}>/month</span>
                </div>
                <ul style={styles.featureList}>
                  <li>✓ Basic checking account</li>
                  <li>✓ Basic savings account</li>
                  <li>✓ Standard transfers</li>
                  <li>✓ Basic transaction history</li>
                  <li style={styles.disabledFeature}>✗ AI Banking Assistant</li>
                </ul>
                <div style={styles.signupButton}>Get Started Free</div>
              </div>
            </div>

            {/* Premium Plan */}
            <div 
              onClick={() => handleSignup('premium')} 
              style={styles.cardLink}
            >
              <div style={{
                ...styles.pricingCard,
                ...styles.premiumCard,
                ...(selectedPlan === 'premium' ? styles.selectedCard : {})
              }}>
                <div style={{...styles.planBadge, ...styles.premiumBadge}}>Premium</div>
                <div style={styles.planPrice}>
                  <span style={styles.currency}>$</span>
                  <span style={styles.amount}>4.99</span>
                  <span style={styles.period}>/month</span>
                </div>
                <ul style={styles.featureList}>
                  <li>✓ Everything in Free plan</li>
                  <li>✓ AI Banking Assistant</li>
                  <li>✓ Personalized financial insights</li>
                  <li>✓ Smart savings recommendations</li>
                  <li>✓ Priority support</li>
                </ul>
                <div style={styles.premiumSignupButton}>Select Premium</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const styles = {
  container: {
    display: 'flex',
    padding: '40px 80px',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: 'Proxima Nova, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  contentSection: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '24px',
    textAlign: 'left',
  },
  highlight: {
    color: '#007bff',
  },
  subtext: {
    fontSize: '18px',
    color: '#666666',
    marginBottom: '40px',
    textAlign: 'left',
    lineHeight: '1.6',
  },
  heroSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '80px',
    gap: '40px',
  },
  heroText: {
    flex: '1',
    maxWidth: '600px',
  },
  imageSection: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '500px',
  },
  illustration: {
    maxWidth: '100%',
    height: 'auto',
  },
  pricingSection: {
    marginTop: '60px',
  },
  pricingTitle: {
    fontSize: '36px',
    textAlign: 'center',
    marginBottom: '40px',
    color: '#2c3e50',
  },
  pricingContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
  },
  pricingCard: {
    width: '340px',
    padding: '40px',
    borderRadius: '16px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '2px solid transparent',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    },
  },
  premiumCard: {
    backgroundColor: '#ffffff',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  planBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: '#e8f4ff',
    color: '#007bff',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  premiumBadge: {
    backgroundColor: '#007bff',
    color: '#ffffff',
  },
  planPrice: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  currency: {
    fontSize: '24px',
    verticalAlign: 'top',
    color: '#2c3e50',
  },
  amount: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  period: {
    fontSize: '16px',
    color: '#666666',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 30px',
    fontSize: '16px',
    lineHeight: '2',
    color: '#2c3e50',
  },
  disabledFeature: {
    color: '#999999',
  },
  signupButton: {
    display: 'block',
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
    color: '#007bff',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '600',
    border: '2px solid #007bff',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#e8f4ff',
    },
  },
  premiumSignupButton: {
    display: 'block',
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '600',
    border: '2px solid #007bff',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  planToggle: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '40px',
  },
  planToggleButton: {
    padding: '12px 24px',
    borderRadius: '30px',
    border: '2px solid #007bff',
    backgroundColor: 'transparent',
    color: '#007bff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#e8f4ff',
    },
  },
  planToggleButtonActive: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  selectedCard: {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 123, 255, 0.2)',
    border: '2px solid #007bff',
  },
  buttonGroup: {
    display: 'flex',
    gap: '20px',
    marginTop: '30px',
  },
  loginButton: {
    padding: '12px 32px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
    cursor: 'pointer',
    border: 'none',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  signupButton: {
    padding: '12px 32px',
    backgroundColor: 'white',
    color: '#007bff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
    border: '2px solid #007bff',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#e8f4ff',
    },
  },
};
