// Description: Authentication Context for Firebase

import React, { useContext, useState, useEffect } from 'react';
import { db} from '../firebase.config';

import { doc, updateDoc, arrayUnion, getDoc  } from 'firebase/firestore';
import FormattedDate from '../utils/FormattedDate';
import { useAuth } from './AuthContext';


const FirestoreContext = React.createContext();

export function useFirestore() {
  return useContext(FirestoreContext);
};

export default function FirestoreProvider({ children }) {
  const { currentUser } = useAuth();
  const { formattedDateDay, formattedDateHour } = FormattedDate();
  const userId = currentUser.uid; 
  const userRef = doc(db, "users", userId);

  // Update Firestore database with maintenance request
  const updateFirestore = async (maintenanceId, file, issue, otherMessage, message) => {
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
          open: true
        }
      )
    }, { merge: true });
  };

  // Fetch maintenance requests from Firestore database and sets them to state
  const fetchMaintenanceRequests = async (setMaintenanceRequests) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      setMaintenanceRequests(userDoc.data().maintenanceRequests);
    }
  };

  const value = {
    updateFirestore,
    fetchMaintenanceRequests
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
}
