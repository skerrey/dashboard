// Description: Sidebar component

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Sidebar.scss';

function Sidebar({ isSidebarOpen, toggleSidebar, isMobile }) {
  const { currentUser } = useAuth();

  // Toggles sidebar on mobile when a link is clicked
  const handleClose = () => {
    if (isSidebarOpen && isMobile) {
      toggleSidebar();
    }
  }

  return (
    <>
      <button onClick={toggleSidebar} className={`btn sidebar-toggle ${isMobile ? "isMobile" : "isNotMobile"}`}>
        <FontAwesomeIcon icon="fa-solid fa-bars" size="2xl" />
      </button>

      <div className={`sidebar sidebar-background ${isSidebarOpen ? "expanded" : "collapsed"} ${isMobile ? "isMobile" : "isNotMobile"}`}>
        <div className="sidebar-title">
          <div className="welcome-message">Hello</div>
          <div className="username">
            <div className="text-break">
              {currentUser ? currentUser.displayName : ''}
            </div>
            <div className="text-break">
              {currentUser ? currentUser.email : ''}
            </div>
          </div>
        </div>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'active link' : 'none link'
          }
          style={(isActive) => ({
            borderLeftColor: isActive ? '#0d6efd' : 'transparent',
          })}
          onClick={handleClose}
        >
          Home
        </NavLink>

        <NavLink
          to="/payments"
          className={({ isActive }) =>
            isActive ? 'active link' : 'none link'
          }
          style={(isActive) => ({
            borderLeftColor: isActive ? '#20c997' : 'transparent',
          })}
          onClick={handleClose}
        >
          Payments
        </NavLink>

        <NavLink
          to="/maintenance"
          className={({ isActive }) =>
            isActive ? 'active link' : 'none link'
          }
          style={(isActive) => ({
            borderLeftColor: isActive ? '#fd7e14' : 'transparent',
          })}
          onClick={handleClose}
        >
          Maintenance
        </NavLink>

        <NavLink
          to="/contact-us"
          className={({ isActive }) =>
            isActive ? 'active link' : 'none link'
          }
          style={(isActive) => ({
            borderLeftColor: isActive ? '#0dcaf0' : 'transparent',
          })}
          onClick={handleClose}
        >
          Contact Us
        </NavLink>

        <NavLink
          to="/account-profile"
          className={({ isActive }) =>
            isActive ? 'active link' : 'none link'
          }
          style={(isActive) => ({
            borderLeftColor: isActive ? '#0d6efd' : 'transparent',
          })}
          onClick={handleClose}
        >
          Account Profile
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? 'active link' : 'none link'
          }
          style={(isActive) => ({
            borderLeftColor: isActive ? '#6f42c1' : 'transparent',
          })}
          onClick={handleClose}
        >
          Settings
        </NavLink>
        
      </div>
    </>
  );
}

export default Sidebar;
