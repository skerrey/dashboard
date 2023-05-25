import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useFirestore } from "../contexts/FirestoreContext";
import { Button, Form, Spinner } from 'react-bootstrap';

function CardSetupForm() {
  const { userData } = useFirestore();
  const stripe = useStripe();
  const elements = useElements();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        // Include any additional collected billing details
      },
    });

    if (error) {
      console.error(error);
    } else {
      await setupPaymentMethod(paymentMethod.id);
    } 
  };

  // Adds payment method to customer
  const setupPaymentMethod = async (paymentMethodId) => {
    try {
      setLoading(true);

      const response = await fetch("https://us-central1-dashboard-c48b3.cloudfunctions.net/setupPaymentMethod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          paymentMethodId: paymentMethodId,
          customerId: userData.stripeCustomerId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Payment method added');
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        console.log('Payment method not added');
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    } finally {
      setLoading(false);
      elements.getElement(CardElement).clear();
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="">
      <CardElement className="my-3 bg-light p-2" />
      {success && <p className="text-success">Card added successfully</p>}
      {error && <p className="text-danger">Error adding card</p>}
      <div className="d-flex align-items-center">
        <Button type="submit" disabled={!stripe} className="mt-1">
          Add New Card
        </Button>
        {loading && <Spinner animation="border" variant="primary" className="ms-3"/>}
      </div>
    </Form>
  );
}

export default CardSetupForm;
