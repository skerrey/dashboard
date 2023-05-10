import React, { useEffect } from 'react';
import Stripe from 'stripe';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { auth } from '../firebase.config';

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);

function StripeIntegration() {
  async function createStripeCustomer(user) {
    const customer = await stripe.customers.create({
      email: user.email,
    });

    // Store the Stripe customer ID in your Firebase database
    const db = firebase.firestore();
    db.collection('users').doc(user.uid).set({
      stripeCustomerId: customer.id,
    }, { merge: true });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await createStripeCustomer(user);
      }
    });

    return unsubscribe;
  }, []);

  return <div>Stripe Integration</div>;
}

export default StripeIntegration;
