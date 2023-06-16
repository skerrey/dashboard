// Description: Private Routes for authenticated users

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';

export default function PrivateRoutes({ children }) {
  const { currentUser } = useAuth();
  const { userData } = useFirestore()

  if (!currentUser) {
    return <Navigate to="/login" redirect />;
  } else if (userData && userData.isAdmin) {
    return <Navigate to="/admin" redirect />;
  } else {
    return children;
  }
}

