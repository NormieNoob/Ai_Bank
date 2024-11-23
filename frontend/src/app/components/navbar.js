import React from 'react';
import Link from 'next/link'; // Import Link from next/link

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <h1 style={styles.logo}>Banking App</h1>
      <ul style={styles.navLinks}>
        <li style={styles.navItem}>
          <Link href="/" style={styles.link}>Home</Link> {/* Use href instead of to */}
        </li>
        <li style={styles.navItem}>
          <Link href="/accounts/savings" style={styles.link}>Savings Account</Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/accounts/checking" style={styles.link}>Checking Account</Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/accounts/creditcard" style={styles.link}>Credit Card</Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/about" style={styles.link}>About</Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    listStyle: 'none',
  },
  navItem: {
    margin: '0 15px',
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    fontSize: '1rem',
  },
};

export default Navbar;
