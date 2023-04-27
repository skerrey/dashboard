// Description: Index 

import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import './index.scss';
import App from './App';
import AuthProvider from './contexts/AuthContext';
import FirestoreProvider from './contexts/FirestoreContext';
import StorageProvider from './contexts/StorageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <AuthProvider>
      <FirestoreProvider>
      <StorageProvider>
      <App />
      </StorageProvider>
      </FirestoreProvider>
    </AuthProvider>

  // </React.StrictMode>
);