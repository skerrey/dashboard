// Description: Authentication Context for Firebase

import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase.config';
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) { // Signup
    return createUserWithEmailAndPassword(auth, email, password);
  };

  function updateInfo(name) { // Update user info
    return updateProfile(auth.currentUser, {displayName: name});
  };
  
  function login(email, password) { // Login
    return signInWithEmailAndPassword(auth, email, password); // Change this function to log into server (firebase alternative)
  };

  function logout() { // Logout
    return auth.signOut();
  };

  function resetPassword(email) { // Reset password
    return sendPasswordResetEmail(auth, email);
  };

  function updateEmail(email) { // Update email
    return currentUser.updateEmail(email);
  };

  function updatePassword(password) { // Update password
    return currentUser.updatePassword(password);
  };

  useEffect(() => { // set user on mount
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    updateInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
