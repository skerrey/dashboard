// Description: App.js

// Routes
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './components/Home';
import Payments from './components/Payments';
import Maintenance from './components/Maintenance';
import ContactUs from './components/ContactUs';
import AccountProfile from "./components/AccountProfile";
import Settings from './components/Settings';

import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import './App.scss';
import "./helpers/FontAwesomeIcons";

function App() {
  return (
    <>
      <AuthProvider>
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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </div>
        
      </Router> 
      </AuthProvider>
    </>
  );
}

export default App;
