// Description: Admin home page

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function AdminHome() {
  const { currentUser } = useAuth();

  return (
    <div>AdminHome</div>
  )
}

export default AdminHome