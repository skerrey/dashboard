// Description: Header component

import React, { useState, useEffect } from 'react';
import './Header.scss';
import logo from "../images/logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';

function Header() {
  const [error, setError] = useState('');
  const [address, setAddress] = useState(''); 
  const { logout, userId } = useAuth();
  const { getAddress } = useFirestore();
  const navigate = useNavigate();

  async function handleLogout() { // logout user on click
    setError('');

    try {
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to log out');
      console.log(error);
    }
  }

  // Get user phone from Firestore
  useEffect(() => {
    getAddress(userId)
      .then((address) => {
        setAddress(address);
      })
      .catch((error) => {
        console.log("Error getting user address:", error);
      });
  }, [getAddress, userId]);

  return (
    <div className="header">
      <div>
        <NavLink to="/" className="nav-link">
          <img src={logo} alt="logo" className="logo" />
        </NavLink>
      </div>
      <div>
        <span className="address-title">Property address</span>
        <span className="address">
          {address && address.address2 ?
            `${address.address} ${address.address2}, ${address.city}, ${address.state} ${address.zip}`  
            : address 
            ? `${address.address}, ${address.city}, ${address.state} ${address.zip}`
            : 
              <NavLink to="/account-profile">(add address)</NavLink>
          }
        </span>
        <button className="btn btn-logout" onClick={handleLogout}>
          <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" size="sm" /> Log Out
        </button>
      </div>
    </div>
  )
}

export default Header