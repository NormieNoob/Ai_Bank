"use client";
import { useState } from 'react';

export default function CreditCardPage() {
  const [activeCard, setActiveCard] = useState(null);
  
  const creditCards = [
    {
      name: 'Platinum Rewards Card',
      image: '/cards/platinum-card.png',
      requirements: [
        'Minimum income of $50,000 annually',
        'Credit score of 700+',
      ],
      benefits: [
        '5% cashback on groceries',
        '2% cashback on dining and fuel',
        'Complimentary airport lounge access',
      ],
    },
    {
      name: 'Gold Credit Card',
      image: '/cards/gold-card.png',
      requirements: [
        'Minimum income of $35,000 annually',
        'Credit score of 650+',
      ],
      benefits: [
        '3% cashback on utilities',
        '1% cashback on all purchases',
        'Low interest rates on outstanding balance',
      ],
    },
    {
      name: 'Silver Cashback Card',
      image: '/cards/silver-card.png',
      requirements: [
        'Minimum income of $25,000 annually',
        'Credit score of 600+',
      ],
      benefits: [
        'Flat 1.5% cashback on all transactions',
        'No annual fee for the first year',
        'Zero liability for unauthorized transactions',
      ],
    },
    {
      name: 'Student Credit Card',
      image: '/cards/student-card.png',
      requirements: [
        'Must be a college student (proof required)',
        'No minimum income required',
      ],
      benefits: [
        '1% cashback on all purchases',
        'Build your credit score as a student',
        'No annual fees',
      ],
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Explore Our Credit Cards</h1>
        <p style={styles.subtitle}>
          Choose the card that best suits your needs and lifestyle.
        </p>
      </div>

      <div style={styles.cardGrid}>
        {creditCards.map((card, index) => (
          <div 
            key={index} 
            style={{
              ...styles.card,
              ...(activeCard === index ? styles.activeCard : {}),
            }}
            onMouseEnter={() => setActiveCard(index)}
            onMouseLeave={() => setActiveCard(null)}
          >
            {/* Highlight Badge */}
            {activeCard === index && (
              <div style={styles.highlightBadge}>
                Selected Card
              </div>
            )}
            
            {/* Existing card content */}
            <div style={styles.cardImageWrapper}>
              <img
                src={card.image}
                alt={card.name}
                style={styles.cardImage}
              />
            </div>
            <h2 style={styles.cardTitle}>{card.name}</h2>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Requirements:</h3>
              <ul style={styles.list}>
                {card.requirements.map((req, reqIndex) => (
                  <li key={reqIndex} style={styles.listItem}>{req}</li>
                ))}
              </ul>
            </div>
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Benefits:</h3>
              <ul style={styles.list}>
                {card.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} style={styles.listItem}>{benefit}</li>
                ))}
              </ul>
            </div>
            <button 
              style={{
                ...styles.applyButton,
                ...(activeCard === index ? styles.activeButton : {})
              }}
              onClick={() => alert(`Application for ${card.name} has been submitted`)}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '2rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#4b5563',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    minHeight: '600px',
    position: 'relative',
    cursor: 'pointer',
  },
  cardImage: {
    width: '16rem',
    height: '10rem',
    objectFit: 'cover',
    marginBottom: '1.5rem',
    padding: '0',
    display: 'block',
    borderRadius: '8px',
    maxWidth: '90%',
    maxHeight: '100%',
  },
  cardImageWrapper: {
    width: '100%',
    maxWidth: '280px',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0',
    margin: '0 auto',
    overflow: 'hidden',
    borderRadius: '8px',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem',
  },
  section: {
    width: '100%',
    textAlign: 'left',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  list: {
    listStyle: 'disc',
    paddingLeft: '1.5rem',
  },
  listItem: {
    color: '#4b5563',
    marginBottom: '0.25rem',
  },
  applyButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: 'auto',
    width: '100%',
  },
  activeCard: {
    transform: 'scale(1.05)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
    border: '2px solid #007bff',
  },
  highlightBadge: {
    position: 'absolute',
    top: '-12px',
    right: '-12px',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  activeButton: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
};