// Description: App.js

import React, { useState, useEffect } from 'react';

// Routes
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";

// Pages
import Home from './pages/Home';
import Payments from './pages/Payments';
import Maintenance from './pages/Maintenance';
import ContactUs from './pages/ContactUs';
import AccountProfile from "./pages/AccountProfile";
import Settings from './pages/Settings';

// Components
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";

// Layouts
import PrivateLayout from "./layouts/PrivateLayout";
import GuestLayout from "./layouts/GuestLayout";

// Styling
import './App.scss';
import "./utils/FontAwesomeIcons";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>

            {/* Routes when no user authenticated */}
            <Route element={<GuestLayout />}>
              <Route path="/login"            element={<PublicRoutes><Login /></PublicRoutes>} />
              <Route path="/signup"           element={<PublicRoutes><Signup /></PublicRoutes>} />
              <Route path="/forgot-password"  element={<PublicRoutes><ForgotPassword /></PublicRoutes>} />
            </Route>

            {/* Routes for authenticated users */}
            <Route element={<PrivateLayout />}>
              <Route path="/"                 element={<PrivateRoutes><Home /></PrivateRoutes>} />
              <Route path="/payments"         element={<PrivateRoutes><Payments /></PrivateRoutes>} />
              <Route path="/maintenance"      element={<PrivateRoutes><Maintenance /></PrivateRoutes>} />
              <Route path="/contact-us"       element={<PrivateRoutes><ContactUs /></PrivateRoutes>} />
              <Route path="/account-profile"  element={<PrivateRoutes><AccountProfile /></PrivateRoutes>} />
              <Route path="/settings"         element={<PrivateRoutes><Settings /></PrivateRoutes>} />
            </Route>
            
          </Routes>
        </Router> 
      </AuthProvider>
    </>
  );
}

export default App;
