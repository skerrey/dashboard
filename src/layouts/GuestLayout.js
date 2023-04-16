// Description: Layout for guests

import React from 'react';
import { Outlet } from 'react-router-dom';

function PrivateLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default PrivateLayout;
