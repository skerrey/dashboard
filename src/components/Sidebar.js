// Description: Sidebar component

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Sidebar.scss';

function Sidebar() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  let breakpointXs = 576;
  let breakpointSm = 768;
  let breakpointMd = 992;
  let breakpointLg = 1200;
  let breakpointXl = 1400;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < breakpointSm) {
        setIsMobile(true);
        setIsSidebarOpen(false);
      } else {
        setIsMobile(false);
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <button onClick={toggleSidebar} className={`btn sidebar-toggle ${isMobile ? "isMobile" : "isNotMobile"}`}>
        <FontAwesomeIcon icon="fa-solid fa-bars" size="2xl" />
      </button>
        <div className={`sidebar ${isSidebarOpen ? "expanded" : "collapsed"} ${isMobile ? "isMobile" : "isNotMobile"}`}>
          <div className="sidebar-title">
            <div className="welcome-message">Hello</div>
            <div className="username">
              {currentUser ? currentUser.displayName : ''}
              <br />
              {currentUser ? currentUser.email : ''}
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
          >
            Settings
          </NavLink>
        </div>
    </>
  );
}

export default Sidebar;
