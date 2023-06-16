// Description: App.js

import React from 'react';

// Routes
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";

// Contexts
import AuthProvider from './contexts/AuthContext';
import FirestoreProvider from './contexts/FirestoreContext';
import StorageProvider from './contexts/StorageContext';

// Pages
import Home from './pages/Home';
import Payments from './pages/Payments';
import Maintenance from './pages/Maintenance';
import ContactUs from './pages/ContactUs';
import AccountProfile from "./pages/AccountProfile";
import Settings from './pages/Settings';
import AdminHome from './pages/AdminHome';

// Components
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";

// Layouts
import PrivateLayout from "./layouts/PrivateLayout";
import GuestLayout from "./layouts/GuestLayout";
import AdminLayout from "./layouts/AdminLayout";

// Styling
import './App.scss';
import './styles/_global.scss';
import "./utils/FontAwesomeIcons";

function App() {
  return (
    <>
      <AuthProvider>
      <FirestoreProvider>
      <StorageProvider>
        <Router>
          <Routes>

            {/* Routes when no user authenticated */}
            <Route element={<GuestLayout />}>
              <Route path="/login"            element={<PublicRoutes><Login /></PublicRoutes>} />
              <Route path="/signup"           element={<PublicRoutes><Signup /></PublicRoutes>} />
              <Route path="/forgot-password"  element={<PublicRoutes><ForgotPassword /></PublicRoutes>} />
              <Route path="*"                 element={<PublicRoutes><Navigate to="/login" replace /></PublicRoutes>} />
            </Route>

            {/* Routes for authenticated users */}
            <Route element={<PrivateLayout />}>
              <Route path="/"                 element={<PrivateRoutes><Home /></PrivateRoutes>} />
              <Route path="/payments"         element={<PrivateRoutes><Payments /></PrivateRoutes>} />
              <Route path="/maintenance"      element={<PrivateRoutes><Maintenance /></PrivateRoutes>} />
              <Route path="/contact-us"       element={<PrivateRoutes><ContactUs /></PrivateRoutes>} />
              <Route path="/account-profile"  element={<PrivateRoutes><AccountProfile /></PrivateRoutes>} />
              <Route path="/settings"         element={<PrivateRoutes><Settings /></PrivateRoutes>} />
              <Route path="*"                 element={<PrivateRoutes><Navigate to="/" replace /></PrivateRoutes>} /> 
            </Route>

            {/* Routes for admin */}
            <Route element={<AdminLayout />}>
              <Route path="/admin"            element={<AdminRoutes><AdminHome /></AdminRoutes>} />
              {/* <Route path="*"                 element={<AdminRoutes><Navigate to="/admin" replace /></AdminRoutes>} /> */}
            </Route>
            
          </Routes>
        </Router> 
      </StorageProvider>
      </FirestoreProvider>
      </AuthProvider>
    </>
  );
}

export default App;
