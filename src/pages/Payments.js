// Description: Payments page

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { httpsCallable } from "firebase/functions";
import { functions } from '../firebase.config';
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const createPayment = async (data) => {
  const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
  return createPaymentIntent(data);
};

function PaymentForm({ onSubmit }) {
  const [amount, setAmount] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(amount);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Amount</Form.Label>
        <Form.Control 
          type="number" 
          placeholder="Enter amount" 
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

// This component displays the card input field
function CardInput({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();

  const paymentElementOptions = { layout: "tabs" }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { paymentMethod, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(PaymentElement),
      },
    });

    if (error) {
      console.log('[error]', error);
    } else {
      if (paymentMethod) {
        console.log('[PaymentMethod]', paymentMethod);
        // TODO: send the paymentMethod.id to your server
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" className="pb-3" options={paymentElementOptions} />
      <button type="submit" disabled={!stripe}>Pay Rent</button>
    </form>
  );
}

function Payments() {
  const [clientSecret, setClientSecret] = useState(null);

  const handleSubmit = amount => {
    createPayment({ amount: Number(amount) })
      .then(result => {
        setClientSecret(result.data.clientSecret);
      })
      .catch(error => {
        console.error('Error creating payment intent:', error);
        // Handle error, e.g. by displaying an error message to the user
      });
  };

  if (!clientSecret) {
    // return <PaymentForm onSubmit={handleSubmit} />;
    return <div>Coming Soon!</div>
  }

  return (
    <div>
      <div className="page-title">
        Payments <FontAwesomeIcon icon="fa-solid fa-building-columns" size="xs" />
      </div>
      <Row>
        <Col className="col">
          <Card className="card-payments">
            <Card.Body>
              <Card.Title>Pay Rent</Card.Title>
              <Elements stripe={stripePromise}>
                <CardInput clientSecret={clientSecret} />
              </Elements>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Payments