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
          {currentUser ? currentUser.email : ""}
        </div>
      </div>
      <NavLink 
        to="/" 
        className="link"
        activeClassName="active"
        style={isActive => ({
          borderLeftColor: isActive ? "#0d6efd" : "transparent"
        })}
      >
        Home
      </NavLink>
      <NavLink 
        to="/payments" 
        className="link"
        activeClassName="active"
        style={isActive => ({
          borderLeftColor: isActive ? "#20c997" : "transparent"
        })}
      >
        Payments
        </NavLink>
      <NavLink 
        to="/maintenance" 
        className="link"
        activeClassName="active"
        style={isActive => ({
          borderLeftColor: isActive ? "#fd7e14" : "transparent"
        })}
      >
        Maintenance
      </NavLink>
      <NavLink 
        to="/contact-us" 
        className="link"
        activeClassName="active"
        style={isActive => ({
          borderLeftColor: isActive ? "#0dcaf0" : "transparent"
        })}
      >
        Contact Us
      </NavLink>
      <NavLink 
        to="/account-profile" 
        className="link"
        activeClassName="active"
        style={isActive => ({
          borderLeftColor: isActive ? "#0d6efd" : "transparent"
        })}
      >
        Account Profile
      </NavLink>
      <NavLink 
        to="/settings" 
        className="link"
        activeClassName="active"
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