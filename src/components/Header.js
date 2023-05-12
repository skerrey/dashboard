// Description: Header component

import React, { useState } from 'react';
import './Header.scss';
import logo from "../images/logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const [error, setError] = useState('');
  const { logout } = useAuth();
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

  return (
    <div className="header">
      <div>
        <img src={logo} alt="logo" className="logo" />
      </div>
      <div>
        <span className="address-title">Property address</span>
        <span className="address">123 Main St, Anytown, USA</span>
        <button className="btn btn-logout" onClick={handleLogout}>
          <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" size="sm" /> Log Out
        </button>
      </div>
    </div>
  )
}

export default Header