import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Button, Spinner } from 'react-bootstrap';
import { useFirestore } from '../contexts/FirestoreContext';
import { useAuth } from '../contexts/AuthContext';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import UserCard from './UserCard';
import AddCardForm from './AddCardForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function PaymentMethods() {
  const { userData } = useFirestore();
  const { currentUser } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create a Setup Intent to save a card
  useEffect(() => {
    fetch("https://us-central1-dashboard-c48b3.cloudfunctions.net/createSetupIntent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => res.json())
    .then((data) => setClientSecret(data.clientSecret))
    .catch((error) => console.error('Error:', error));
  }, []);


  // Get the card details
  useEffect(() => {
    if (userData && userData.payments && userData.payments.cards) {
      setCards(userData.payments.cards);
    }
  }, [userData]);
  
  // Render the user's cards
  const renderUserCard = (card) => {
    return (
      <div key={card._id}>
        <UserCard card={card} />
      </div>
    )
  };

  // Create a Stripe customer
  const createCustomer = async () => {
    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Col className="col">
      <Card className="card-payments">
        <Card.Body>
          <Card.Title>Payment Methods</Card.Title>
          <hr className="text-muted mt-0 mb-2" />
          <Row xs={1} sm={2} md={2} lg={2}>
            <Col>
              <h5>Add New Card</h5>
              {userData && !userData.stripeCustomerId && (
                <div className="d-flex align-items-center">
                  <Button onClick={createCustomer} className="mt-1">
                    Add New Card
                  </Button>
                  {loading && <Spinner animation="border" variant="primary" className="ms-3"/>}
                </div>
              )}
              {userData && userData.stripeCustomerId && clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <AddCardForm />
                </Elements>
              )}
            </Col>
            <Col className="justify-content-end">
              <h5>Saved Cards</h5>
              <div>
              {cards && cards.map(renderUserCard)}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default PaymentMethods