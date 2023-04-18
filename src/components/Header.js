// Description: Header component

import React from 'react';
import './Header.scss';
import logo from "../images/logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import LogoutFunction from '../utils/LogoutFunction';

function Header() {
  const { handleLogout } = LogoutFunction();

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