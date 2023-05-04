// Description: Authentication Context for Firebase

import React, { useContext } from 'react';
import { db} from '../firebase.config';
import { doc, updateDoc, arrayUnion, getDoc  } from 'firebase/firestore';
import FormattedDate from '../utils/FormattedDate';

const FirestoreContext = React.createContext();

export function useFirestore() {
  return useContext(FirestoreContext);
};

export default function FirestoreProvider({ children }) {
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
  }

  const value = {
    addMaintenanceRequest,
    getMaintenanceRequests,
    addContactUsMessage
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
}