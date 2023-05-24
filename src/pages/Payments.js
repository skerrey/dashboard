// Description: Payments page

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useAuth } from '../contexts/AuthContext';
import CardPaymentForm from '../components/CardPaymentForm';
import AddCardForm from '../components/AddCardForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function Payments() {
  const { currentUser } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(1000);

  const handleAmountChange = (event) => {
    const amountInCents = event.target.value * 100;
    setAmount(amountInCents);
  };

  const createCustomer = async () => {
    try {
      const response = await fetch("https://us-central1-dashboard-c48b3.cloudfunctions.net/createStripeCustomer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: currentUser }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Stripe customer created successfully');
      } else {
        console.log('Error creating Stripe customer');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetch("https://us-central1-dashboard-c48b3.cloudfunctions.net/createPaymentIntent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount }),
    })
    .then((res) => {
      if (!res.ok) {
        return res.text().then(text => {throw new Error(text)});
      }
      return res.json();
    })
    .then((data) => setClientSecret(data.clientSecret))
    .catch((error) => console.error('Error:', error));
  }, []);

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      <div className="page-title">
        Payments <FontAwesomeIcon icon="fa-solid fa-building-columns" size="xs" />
      </div>
      <Row xs={1} sm={1} md={1} lg={2}>
        <Col className="col">
          <Card className="card-payments">
            <Card.Body>
              <Card.Title>Pay Rent</Card.Title>
              Set up a payment method to pay rent.
              <hr className="text-muted" />

              <Button onClick={createCustomer}>Create Payment</Button>
              <input type="number" min="1" step="any" onChange={handleAmountChange} value={amount / 100} placeholder="Enter amount in dollars" />

              {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <AddCardForm />
                </Elements>
              )}

            </Card.Body>
          </Card>
        </Col>
        <Col className="col">
          <Card className="card-payments">
            <Card.Body>
              <Card.Title>Payment History</Card.Title>
              <hr className="text-muted" />

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Payments