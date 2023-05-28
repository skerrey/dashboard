// Description: Stripe Payment form for card the Payment Page

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useFirestore } from "../contexts/FirestoreContext";
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button, Form, Spinner } from 'react-bootstrap';

export default function CardPaymentForm({ clientSecret, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const { saveTransaction, userData } = useFirestore();

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setSuccess("Payment succeeded!");
          setTimeout(() => setSuccess(""), 3000);
          break;
        case "processing":
          setError("Your payment is processing.");
          setTimeout(() => setError(""), 3000);
          break;
        case "requires_payment_method":
          setError("Your payment was not successful, please try again.");
          setTimeout(() => setError(""), 3000);
          break;
        default:
          setError("Something went wrong.");
          setTimeout(() => setError(""), 3000);
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const cardElement = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        console.log("Payment failed");
        setError(error.message);
        setTimeout(() => setError(""), 3000);
      } else {
        console.log("Payment failed");
        setError("An unexpected error occurred.");
        setTimeout(() => setError(""), 3000);
      }
    } else {
      console.log("Payment succeeded");
      setSuccess("Payment Successful!"); 
      setTimeout(() => setSuccess(""), 3000);

      /**
       * --- Add payment transaction in db ---
       * updating db on front end because of Stripe 3D Secure authentication 
       * (confirmCardPayment)
       */
      await saveTransaction(
        userData._id,
        result.paymentIntent.id,
        amount,
        result.paymentIntent.status,
      );
    }
    setIsLoading(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  }

  return (
    <Form id="payment-form" onSubmit={handleSubmit}>
      <CardElement className="my-3 bg-light p-2" id="card" options={cardElementOptions} />
      <Button variant="danger" disabled={isLoading || !stripe || !elements} type="submit">
        <span id="button-text">
          {isLoading ? <Spinner animation="border" variant="primary" className="ms-3"/> : "Pay"}
        </span>
      </Button>
      {success && <div className="text-success">{success}</div>}
      {error && <div className="text-danger">{error}</div>}
    </Form>
  );
}