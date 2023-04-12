

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './components/Home';
import Payments from './components/Payments';
import Maintenance from './components/Maintenance';
import ContactUs from './components/ContactUs';
import AccountProfile from "./components/AccountProfile";
import Settings from './components/Settings';
import './App.scss';

function App() {
  return (
    <>
      <Router>
        <Sidebar />
        <Header />

        <div className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/account-profile" element={<AccountProfile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        
      </Router> 
    </>
  );
}

export default App;
