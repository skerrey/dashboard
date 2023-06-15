// Description: Private Routes for authenticated users

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';

export default function AdminRoutes({ children }) {
  const { currentUser } = useAuth();
  const { userData } = useFirestore();
  
  return (
    currentUser && userData && userData.isAdmin
    ? children 
    : currentUser 
    ? <Navigate to="/" redirect /> // Redirect to home if not an admin
    : <Navigate to="/login" redirect /> // Redirect to login if user is not logged in OR if not admin
  )
}

