// Description: Authentication Context for Firebase

import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase.config';
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword, 
  sendEmailVerification,
  deleteUser,
} from 'firebase/auth';

import { deleteDoc, doc, setDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [userId, setUserId] = useState();
  const [loading, setLoading] = useState(true);
  const [, setIsUserEmailVerified] = useState(false);
  const [, setDisplayName] = useState();

   // Signup
  function signup(firstName, lastName, email, password) {
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

  // Update user info
  function updateInfo(name) { 
    return updateProfile(auth.currentUser, {displayName: name})

    // Update user info in database
    .then(async () => {
      try {
        const ref = doc(db, "users", auth.currentUser.uid);
        // Destructure first and last name from name
        const firstName = name.split(" ")[0]; 
        const lastName = name.split(" ")[1];
        await setDoc(ref, { 
          name: { 
            firstName: firstName, 
            lastName: lastName 
          } 
        }, { merge: true })
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    })
  };
  
  // Login
  function login(email, password) { 
    return signInWithEmailAndPassword(auth, email, password); 
  };

  // Logout
  function logout() { 
    return auth.signOut();
  };

  // Reset password
  function resetPassword(email) { 
    return sendPasswordResetEmail(auth, email);
  };


  // Update phone
  async function updatePhone(phone) {
    try {
      const ref = doc(db, "users", auth.currentUser.uid)
      await setDoc(ref, { phone }, { merge: true })
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };


  // Update email
  function updateUserEmail(email) { 
    return updateEmail(auth.currentUser, email)

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

  // Verify email
  function verifyEmail() {
    return sendEmailVerification(auth.currentUser)

    // Update email verification in database
    .then(async () => {
      try {
        const ref = doc(db, "users", auth.currentUser.uid)
        await setDoc(ref, { emailVerification: "sent" }, { merge: true })
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    })
  }

  // Reload user (for email verification)
  async function reloadUserEmail() {
    await auth.currentUser.reload();
    await auth.currentUser.getIdToken(true);
    setIsUserEmailVerified(auth.currentUser.emailVerified);
  }

  // Reload user 
  async function reloadUserDisplayName() {
    await auth.currentUser.reload();
    await auth.currentUser.getIdToken(true);
    setDisplayName(auth.currentUser.displayName);
  }

  // Verify password
  function verifyPassword(password) {
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password,
    )
  
    return reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  // Update password
  function updateUserPassword(newPassword) { 
    return updatePassword(auth.currentUser, newPassword)
  };

// Delete user
function deleteAccount() {
  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);

  return deleteDoc(userRef) // Delete user from database
    .then(() => {
      return deleteUser(user); // Delete user from Auth
    })
    .catch((error) => {
      console.error("Error deleting user: ", error);
    });
}


  useEffect(() => { // set user on mount
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setUserId(user?.uid)
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userId,
    login,
    signup,
    logout,
    resetPassword,
    updatePhone,
    updateUserEmail,
    verifyEmail,
    reloadUserEmail,
    reloadUserDisplayName,
    updateUserPassword,
    verifyPassword,
    updateInfo,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
