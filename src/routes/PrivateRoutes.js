// Description: Private Routes for authentication

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoutes({ children }) {
  const { currentUser } = useAuth();
  
  return (
    currentUser ? children : <Navigate to="/login" redirect />
  )
}

