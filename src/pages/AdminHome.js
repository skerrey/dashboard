import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function AdminHome() {
  const { currentUser } = useAuth();

  console.log(currentUser);

  return (
    <div>AdminHome</div>
  )
}

export default AdminHome