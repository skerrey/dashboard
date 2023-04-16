// Description: Layout for private routes when user is logged in

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

function PrivateLayout() {
  return (
    <>
      <Sidebar />
      <Header />
      <div className="main"><Outlet /></div>
    </>
  );
}

export default PrivateLayout;
