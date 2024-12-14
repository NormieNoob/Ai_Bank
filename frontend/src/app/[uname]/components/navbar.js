// import React from 'react';
// import Link from 'next/link'; // Import Link from next/link

// const Navbar = () => {
//   return (
//     <nav style={styles.navbar}>
//       <h1 style={styles.logo}>Banking App</h1>
//       <ul style={styles.navLinks}>
//         <li style={styles.navItem}>
//           <Link href="/" style={styles.link}>Dashboard</Link> {/* Use href instead of to */}
//         </li>
//         <li style={styles.navItem}>
//           <Link href="/accounts/savings" style={styles.link}>Savings Account</Link>
//         </li>
//         <li style={styles.navItem}>
//           <Link href="/accounts/checking" style={styles.link}>Checking Account</Link>
//         </li>
//         <li style={styles.navItem}>
//           <Link href="/accounts/creditcard" style={styles.link}>Credit Card</Link>
//         </li>
//         <li style={styles.navItem}>
//           <Link href="/about" style={styles.link}>About</Link>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// const styles = {
//   navbar: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     padding: '10px 20px',
//   },
//   logo: {
//     fontSize: '1.5rem',
//     fontWeight: 'bold',
//   },
//   navLinks: {
//     display: 'flex',
//     listStyle: 'none',
//   },
//   navItem: {
//     margin: '0 15px',
//   },
//   link: {
//     textDecoration: 'none',
//     color: '#fff',
//     fontSize: '1rem',
//   },
// };

// export default Navbar;

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const Navbar = () => {
  const uname = useParams().uname;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      console.log('performing logout function')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
      })
      const data = await response.json();
      console.log('Response:', data); // For debugging
      if (response.ok){
        router.push("/");
      }
    }
    catch (error) {
      console.error('Error:', error); // For debugging
      // setSuccess(false);
      // setMessage('An unexpected error occurred. Please try again.');
      alert("Logout failed")
    }
  };

  return (
    <nav style={styles.navbar}>
      <h1 style={styles.logo}>Banking App</h1>
      <ul style={styles.navLinks}>
        <li style={styles.navItem}>
          <Link href={`/${uname}/dashboard`} style={styles.link}>
            Dashboard
          </Link>
        </li>
        <li
          style={styles.navItem}
          onMouseEnter={toggleDropdown}
          onMouseLeave={closeDropdown}
        >
          <div style={styles.link}>
            Accounts{" "}
            <span
              style={{
                ...styles.arrow,
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)",
              }}
            >
              ▼
            </span>
          </div>
          {dropdownOpen && (
            <ul
              style={{
                ...styles.dropdown,
                opacity: dropdownOpen ? 1 : 0,
                transform: dropdownOpen ? "translateY(0)" : "translateY(-10px)",
                pointerEvents: dropdownOpen ? "auto" : "none",
              }}
            >
              <li style={styles.dropdownItem}>
                <Link href={`/${uname}/accounts/savings`} style={styles.dropdownLink}>
                  Savings Account
                </Link>
              </li>
              <li style={styles.dropdownItem}>
                <Link href={`/${uname}/accounts/checking`} style={styles.dropdownLink}>
                  Checking Account
                </Link>
              </li>
              <li style={styles.dropdownItem}>
                <Link href={`/${uname}/accounts/creditcard`} style={styles.dropdownLink}>
                  Credit Card
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li style={styles.navItem}>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 30px",
    fontFamily: "Arial, sans-serif",
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    listStyle: "none",
    gap: "30px",
  },
  navItem: {
    position: "relative",
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "1.1rem",
    cursor: "pointer",
    padding: "10px 15px",
    display: "flex",
    alignItems: "center",
    transition: "background-color 0.3s, color 0.3s",
  },
  arrow: {
    marginLeft: "5px",
    fontSize: "0.8rem",
    transition: "transform 0.3s ease",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: "0",
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: "5px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    listStyle: "none",
    padding: "10px 0",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    zIndex: 1000,
  },
  dropdownItem: {
    padding: "10px 20px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  dropdownLink: {
    textDecoration: "none",
    color: "#000",
    fontSize: "0.9rem",
    display: "block",
    transition: "color 0.3s ease",
  },
  logoutButton: {
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  logoutButtonHover: {
    "&:hover": {
      backgroundColor: "#e60000",
    },
  },
};

export default Navbar;




