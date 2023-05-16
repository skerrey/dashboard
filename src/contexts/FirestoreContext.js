// Description: Authentication Context for Firebase

import React, { useContext, useState, useEffect } from 'react';
import { db} from '../firebase.config';
import { doc, updateDoc, arrayUnion, getDoc, onSnapshot } from 'firebase/firestore';
import FormattedDate from '../utils/FormattedDate';
import { useAuth } from '../contexts/AuthContext';

const FirestoreContext = React.createContext();

export function useFirestore() {
  return useContext(FirestoreContext);
};

export default function FirestoreProvider({ children }) {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState();
  const { formattedDateDay, formattedDateHour } = FormattedDate();

  // Add Maintenance request to Firestore database
  const addMaintenanceRequest = async (userId, maintenanceId, file, issue, otherMessage, message) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      maintenanceRequests: arrayUnion(
        {
          _id: maintenanceId,
          date: {
            day: formattedDateDay,
            time: formattedDateHour
          },
          hasFiles: file ? true : false,
          issue: { 
            issue, 
            otherMessage
          },
          message: message,
          status: {
            open: true,
            received: false,
            inProgress: false,
            completed: false,
          }
        }
      )
    }, { merge: true });
  };

  // Get maintenance requests from Firestore database and sets them to state
  const getMaintenanceRequests = async (userId, setMaintenanceRequests) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      setMaintenanceRequests(userDoc.data().maintenanceRequests);
    }
  };

  // Add Contact Us message to Firestore database
  const addContactUsMessage = async (userId, messageId, subject, message) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      messages: arrayUnion(
        {
          _id: messageId,
          message: message,
          date: {
            day: formattedDateDay,
            time: formattedDateHour
          },
          subject: subject
        }
      )
    }, { merge: true });
  };

  // Get user phone from Firestore
  const getUserPhone = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().phone;
    }
    return null;
  };

  const updateAddress = async (userId, address, address2, city, state, zip) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      address: {
        address: address,
        address2: address2,
        city: city,
        state: state,
        zip: zip
      }
    }, { merge: true });
  };

  const getAddress = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().address;
    }
    return null;
  };
  

  useEffect(() => {
    if (currentUser) {
      // Set up Firestore snapshot listener
      const userRef = doc(db, "users", currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setUserData(doc.data());
        }
      });

      // Clean up subscription on unmount
      return () => unsubscribe();
    }
  }, [currentUser]);

  const value = {
    userData,
    addMaintenanceRequest,
    getMaintenanceRequests,
    addContactUsMessage,
    getUserPhone,
    updateAddress,
    getAddress
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
}
