// Description: Authentication Context for Firebase database

import React, { useContext, useState, useEffect } from 'react';
import { db } from '../firebase.config';
import FormattedDate from '../utils/FormattedDate';
import { useAuth } from '../contexts/AuthContext';
import { Stripe } from 'stripe';
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  getDoc, 
  onSnapshot, 
  setDoc, 
  arrayRemove,
} from 'firebase/firestore';

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);

const FirestoreContext = React.createContext();

export function useFirestore() {
  return useContext(FirestoreContext);
};

export default function FirestoreProvider({ children }) {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const { formattedDateDay, formattedDateHour } = FormattedDate();

  // Add Maintenance request to db
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
          status: "open"
        }
      )
    }, { merge: true });
  };

  // Get maintenance requests from db and sets them to state
  const getMaintenanceRequests = async (userId, setMaintenanceRequests) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      setMaintenanceRequests(userDoc.data().maintenanceRequests);
    }
  };

  // Add Contact Us message to db
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

  // Get user phone from db
  const getUserPhone = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().phone;
    }
    return null;
  };

  // Update user address in d
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

  // Get user address from db
  const getAddress = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().address;
    }
    return null;
  };

  // Update email verification status
  const updateEmailVerificationStatus = async (userId) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      emailVerification: "verified"
    }, { merge: true });
  };

  // Save transaction to the db
  const saveTransaction = async (userId, paymentIntentId, amount, paymentStatus, paymentMethodId) => {
    const userRef = doc(db, "users", userId);
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    const lastFourDigits = paymentMethod.card.last4;

    await setDoc(userRef, {
      payments: {
        transactions: arrayUnion({
          _id: paymentIntentId,          
          paidOn: formattedDateDay, 
          amount: amount / 100,
          status: paymentStatus,
          paymentMethodId: paymentMethodId,
          last4: lastFourDigits
        })
      }
    }, { merge: true });
  };

  // Update balance in db
  const updateBalance = async (userId, balance) => {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      payments: {
        balance: balance
      }
    }, { merge: true });
  };

  // Delete saved card from db
  const deleteCard = async (userId, cardId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
  
    if (userDoc.exists()) {
      const updatedCards = userDoc.data().payments.cards.filter((card) => card._id !== cardId);
      await updateDoc(userRef, {
        payments: {
          cards: updatedCards
        }
      }, { merge: true });
    }
  };

  // Get user data from db
  const getUser = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  };
  
  // Set up Firestore snapshot listener
  useEffect(() => {
    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setUserData(doc.data());
        }
        setLoading(false);
      });

      // Clean up subscription on unmount
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const value = {
    userData,
    addMaintenanceRequest,
    getMaintenanceRequests,
    addContactUsMessage,
    getUserPhone,
    updateAddress,
    getAddress,
    updateEmailVerificationStatus,
    saveTransaction,
    updateBalance,
    deleteCard,
    getUser,
  };

  return (
    <FirestoreContext.Provider value={value}>
      {!loading && children}
    </FirestoreContext.Provider>
  );
}
