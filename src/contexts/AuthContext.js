// Description: Authentication Context for Firebase

import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase.config';
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

import { doc, setDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(firstName, lastName, email, password) { // Signup
    return createUserWithEmailAndPassword(auth, email, password)

    // Add user to database
    .then(async (result) => {
      try {
        const ref = doc(db, "users", result.user.uid)
        await setDoc(ref, { 
          _id: `${result.user.uid}`,
          name: {
            firstName: firstName,
            lastName: lastName,
          },
          email, 
          createdAt: new Date().toLocaleString()
        })
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    })
  };

  function updateInfo(name) { // Update user info
    return updateProfile(auth.currentUser, {displayName: name})

    // Update user info in database
    // .then(async () => {
    //   try {
    //     const ref = doc(db, "users", auth.currentUser.uid)
    //     await setDoc(ref, { name }, { merge: true })
    //   } catch (e) {
    //     console.error("Error updating document: ", e);
    //   }
    // })
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
    return currentUser.updateEmail(email)

    // Update email in database
    .then(async () => {
      try {
        const ref = doc(db, "users", auth.currentUser.uid)
        await setDoc(ref, { email }, { merge: true })
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    })
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
