// Description: Admin Sidebar component

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Sidebar.scss';

function AdminSidebar({ isSidebarOpen, toggleSidebar, isMobile }) {
  const { currentUser } = useAuth();
  const { userData } = useFirestore();

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
        
      </div>
    </>
  );
}

export default AdminSidebar;
