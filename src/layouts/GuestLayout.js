// Description: Layout for guests

import React from 'react';
import { Outlet } from 'react-router-dom';

function GuestLayout() {
  return (
    <>
      <div className="guest-layout">
        <Outlet />
      </div>
    </>
  );
}

export default GuestLayout;
