// Working with links

// Description: App.js

// Routes
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./contexts/AuthContext";
import PrivateRoutes from "./routes/PrivateRoutes";

// Pages
import Home from './pages/Home';
import Payments from './pages/Payments';
import Maintenance from './pages/Maintenance';
import ContactUs from './pages/ContactUs';
import AccountProfile from "./pages/AccountProfile";
import Settings from './pages/Settings';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";

// Layouts
import PrivateLayout from "./layouts/PrivateLayout";
import GuestLayout from "./layouts/GuestLayout";

// Styling
import "bootstrap/dist/css/bootstrap.min.css";
import './App.scss';
import "./utils/FontAwesomeIcons";
import { Fragment } from "react";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />


            <Route element={<PrivateLayout />}>
              <Route path="/" element={<PrivateRoutes><Home /></PrivateRoutes>} />
              <Route path="/payments" element={<PrivateRoutes><Payments /></PrivateRoutes>} />
              <Route path="/maintenance" element={<PrivateRoutes><Maintenance /></PrivateRoutes>} />
              <Route path="/contact-us" element={<PrivateRoutes><ContactUs /></PrivateRoutes>} />
              <Route path="/account-profile" element={<PrivateRoutes><AccountProfile /></PrivateRoutes>} />
              <Route path="/settings" element={<PrivateRoutes><Settings /></PrivateRoutes>} />
            </Route>
          </Routes>
        </Router> 
      </AuthProvider>
    </>
  );
}

export default App;
