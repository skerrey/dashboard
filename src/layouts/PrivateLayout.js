// Description: Layout for private routes when user is logged in

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import { useSidebar } from '../utils/Responsive';
import { Container } from 'react-bootstrap';

function PrivateLayout() {
  const { isSidebarOpen, toggleSidebar, isMobile } = useSidebar();

  const handleClose = () => {
    if (isSidebarOpen && isMobile) {
      toggleSidebar();
    }
  }

  const TransparentBackground = () => {
    const style = {
      display: isSidebarOpen && isMobile ? "block" : "none",
      backgroundColor: isSidebarOpen && isMobile ? "rgba(255, 255, 255, 0.6)" : "transparent",
      zIndex: "2",
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
    }
  
    return (
      <span style={style} onClick={handleClose} />
    );
  }

  return (
    <>
      <TransparentBackground />

      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
      <Header />
      <div className="private-layout">
        <Container fluid>
          <Outlet />
        </Container>
      </div>
    </>
  );
}

export default PrivateLayout;
