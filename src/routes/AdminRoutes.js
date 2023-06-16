// Description: Private Routes for authenticated users

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';

export default function AdminRoutes({ children }) {
  const { currentUser } = useAuth();
  const { userData } = useFirestore();
  
  return (
    (currentUser && userData && userData.isAdmin) ? children : <Navigate to="/login/admin" redirect />
  )
}

