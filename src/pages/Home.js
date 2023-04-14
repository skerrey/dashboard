// Description: Home page

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.scss';

function Main() {
  const { currentUser } = useAuth();


  return (
    <div>
      Main
      { currentUser ? 
        <div>Logged in as {currentUser.email}</div> 
        : 
        <div>Not logged in</div> 
        
      }

    </div>
  )
}

export default Main