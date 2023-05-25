// Description: Payments page

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, InputGroup, Form, Spinner, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';
import CardPaymentForm from '../components/CardPaymentForm';
import AddCardForm from '../components/AddCardForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function UserCard({ card }) {
  // Icon card types
  const getCardIcon = (brand) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return "fa-brands fa-cc-visa";
      case 'mastercard':
        return "fa-brands fa-cc-mastercard";
      case 'discover':
        return "fa-brands fa-cc-discover";
      case 'applepay':
        return "fa-brands fa-cc-apple-pay";
      case 'amazonpay':
        return "fa-brands fa-cc-amazon-pay";
      case 'paypal':
        return "fa-brands fa-cc-paypal";
      default:
        return "fa-solid fa-credit-card";  // default icon for unknown types
    }
  };

  return (
    <div className="d-inline-flex justify-content-between align-items-center bg-light rounded w-100 mt-1">
      <FontAwesomeIcon icon={getCardIcon(card.brand)} size="2xl" />
      <span>ending in {card.last4}</span>
      <Button variant="light">
        <FontAwesomeIcon icon="fa-solid fa-trash" size="xs" className="text-danger" />
      </Button>
    </div>
  );
}

function Payments() {
  const { currentUser } = useAuth();
  const { userData } = useFirestore();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(100000);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showPayForm, setShowPayForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const balance = 1000;

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

  // Handler for selecting payment option
  const handlePaymentOptionChange = (e) => {
    if (e.target.value === 'newCard') {
      setShowCardForm(true);
      setSelectedCard(null);
    } else {
      setShowCardForm(false);
      setSelectedCard(e.target.value);
    } 
  };

  // Handle amount change
  const handleAmountChange = (e) => {
    const amountInCents = e.target.value * 100;
    setAmount(amountInCents);
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

  // Create a PaymentIntent with the specified amount.
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
              <hr className="text-muted" />
              <div className="d-flex justify-content-between">
                <div> 
                  <h5>Balance:</h5>
                  <h1>${balance}</h1>
                  <div className="text-danger">Due Date: 1/1/2025</div>
                </div>
                <div>
                  <h5>Items:</h5>
                  <ul className="list-style-none mt-0">
                    <li>Rent: $900</li>
                    <li>Water: $25</li>
                    <li>Trash: $25</li>
                    <li>Garage: $50</li>
                  </ul>
                </div>
              </div>
              <hr className="text-muted mt-1" />

              <Button
                  onClick={() => setShowPayForm(!showPayForm)}
                  aria-controls="pay-form"
                  aria-expanded={showPayForm}
                  variant={showPayForm ? "secondary" : "primary"}
                  className="mb-3"
                >
                  {showPayForm ? "Cancel" : "Pay Now"}
                </Button>
                <Collapse in={showPayForm}>
                  <div id="pay-form">
                    <h3>Checkout</h3>
                    <Row>
                      <Col>
                        <div>Total</div>
                        <InputGroup>
                          <InputGroup.Text id="payment">$</InputGroup.Text>
                          <Form.Control
                            placeholder={amount / 100}
                            aria-label="payment-input"
                            aria-describedby="payment"
                          />
                        </InputGroup>
                      </Col>
                      <Col>
                        <div>
                          Payment Method:
                        </div>
                        <Form.Select
                          aria-label="asdf" 
                          aria-describedby="asdf"
                          onChange={handlePaymentOptionChange}
                        >
                          <option value="notSelected">Select Payment Option</option>
                          {cards && cards.map((card) => (
                            <option key={card._id} value={card._id}>{`${card.brand.toUpperCase()} ending in ${card.last4}`}</option>
                          ))}
                          <option value="newCard">---Pay with new card---</option>
                        </Form.Select>
                      </Col>
                    </Row>

                    {showCardForm && clientSecret && (
                      <Elements stripe={stripePromise}>
                        <CardPaymentForm key={clientSecret} options={options} stripe={stripePromise} />
                      </Elements>
                    )}
                    
                    {selectedCard && (
                      <Button variant="success" className="mt-3">
                        Pay
                      </Button>
                    )}

                  </div>
                </Collapse>       
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
      <Row xs={1} sm={1} md={1} lg={2}>
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
      </Row>
    </div>
  )
}

export default Payments