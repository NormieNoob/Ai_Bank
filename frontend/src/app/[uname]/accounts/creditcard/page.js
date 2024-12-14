import React from 'react';

const CreditCard = () => (
  <div style={styles.container}>
    <div style={styles.contentWrapper}>
      <h2 style={styles.heading}>Credit Card</h2>
      <p style={styles.text}>View and manage your credit card information here.</p>
    </div>
    <div style={styles.overlay}>
      <img 
        src="/icons/under-construction.png"
        alt="Under Construction"
        style={styles.constructionImage}
      />
      <p style={styles.overlayText}>Coming Soon!</p>
    </div>
  </div>
);

const styles = {
  container: {
    position: 'relative',
    maxWidth: '800px',
    margin: '50px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  contentWrapper: {
    filter: 'blur(3px)',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  },
  text: {
    fontSize: '1.1rem',
    color: '#666',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  constructionImage: {
    width: '100px',
    height: '100px',
    marginBottom: '20px',
  },
  overlayText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#007bff',
  }
};

export default CreditCard;
