// Description: Stripe Payment form for card the Payment Page

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button, Form, Spinner } from 'react-bootstrap';

export default function CardPaymentForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
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
          setTimeout(() => setSuccess(null), 3000);
          break;
        case "processing":
          setError("Your payment is processing.");
          setTimeout(() => setError(null), 3000);
          break;
        case "requires_payment_method":
          setError("Your payment was not successful, please try again.");
          setTimeout(() => setError(null), 3000);
          break;
        default:
          setError("Something went wrong.");
          setTimeout(() => setError(null), 3000);
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

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setError(error.message);
        setTimeout(() => setError(null), 3000);
      } else {
        setError("An unexpected error occurred.");
        setTimeout(() => setError(null), 3000);
      }
    } else {
      setSuccess("Payment Successful!"); 
      setTimeout(() => setSuccess(null), 3000);
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
      {/* Show any error or success messages */}
      {success && <div className="text-success">{success}</div>}
      {error && <div className="text-danger">{error}</div>}
    </Form>
  );
}