// Description: Public Routes for non-authenticated users

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PublicRoutes({ children }) {
  const { currentUser } = useAuth();
  
  return (
    !currentUser ? children : <Navigate to="/" redirect />
  )
}

