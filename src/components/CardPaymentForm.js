// Description: Stripe Payment form for card the Payment Page

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button, Form, Spinner } from 'react-bootstrap';

export default function CardPaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();

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
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
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

    const { error } = await stripe.confirmCardPayment({
      elements,
      confirmParams: {
        // Make sure to change this to payment completion page
        return_url: "/",
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }
    setIsLoading(false);
  };

  const userEmail = currentUser ? currentUser.email : "";
  // const userName = currentUser ? currentUser.displayName : "";

  const paymentElementOptions = {
    layout: "tabs",
    defaultValues: {
      billingDetails: {
        email: userEmail,
      }
    }
  }

  return (
    <Form id="payment-form" onSubmit={handleSubmit}>
      <CardElement className="my-3 bg-light p-2" id="payment-element" options={paymentElementOptions} />
      <Button variant="danger" disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <Spinner animation="border" variant="primary" className="ms-3"/> : "Pay"}
        </span>
      </Button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </Form>
  );
}