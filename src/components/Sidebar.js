// Description: Sidebar component

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.scss';

function Sidebar() {
  const { currentUser } = useAuth();

  return (
    <div className="sidebar">
      <div className="sidebar-title">
        <div className="welcome-message">Hello</div>
        <div className="username">
          {currentUser ? currentUser.displayName : ""}
        </div>
      </div>
      <NavLink 
        to="/" 
        className={({isActive}) => (isActive ? "active link" : "none link")} 
        style={isActive => ({
          borderLeftColor: isActive ? "#0d6efd" : "transparent"
        })}
      >
        Home
      </NavLink>
      <NavLink 
        to="/payments" 
        className={({isActive}) => (isActive ? "active link" : "none link")} 
        style={isActive => ({
          borderLeftColor: isActive ? "#20c997" : "transparent"
        })}
      >
        Payments
        </NavLink>
      <NavLink 
        to="/maintenance" 
        className={({isActive}) => (isActive ? "active link" : "none link")} 
        style={isActive => ({
          borderLeftColor: isActive ? "#fd7e14" : "transparent"
        })}
      >
        Maintenance
      </NavLink>
      <NavLink 
        to="/contact-us" 
        className={({isActive}) => (isActive ? "active link" : "none link")} 
        style={isActive => ({
          borderLeftColor: isActive ? "#0dcaf0" : "transparent"
        })}
      >
        Contact Us
      </NavLink>
      <NavLink 
        to="/account-profile" 
        className={({isActive}) => (isActive ? "active link" : "none link")} 
        style={isActive => ({
          borderLeftColor: isActive ? "#0d6efd" : "transparent"
        })}
      >
        Account Profile
      </NavLink>
      <NavLink 
        to="/settings" 
        className={({isActive}) => (isActive ? "active link" : "none link")} 
        style={isActive => ({
          borderLeftColor: isActive ? "#6f42c1" : "transparent"
        })}
      >
        Settings
      </NavLink>
    </div>
  )
}

export default Sidebar