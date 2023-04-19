import { useState, useEffect } from 'react'

export const useSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const breakpoint = [ // used so no-unused-vars doesn't complain
      { name: 'xs 0', value: 576 },
      { name: 'sm 1', value: 768 },
      { name: 'md 2', value: 992 },
      { name: 'lg 3', value: 1200 },
      { name: 'xl 4', value: 1400 },
    ];
    
    const handleResize = () => {
      if (window.innerWidth < breakpoint[1].value) {
        setIsMobile(true);
        setIsSidebarOpen(false);
      } else {
        setIsMobile(false);
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isSidebarOpen, toggleSidebar, isMobile };
}
