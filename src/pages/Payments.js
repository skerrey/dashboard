// Description: Payments page

import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Button, InputGroup, Form, Spinner, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';
import CardPaymentForm from '../components/CardPaymentForm';
import PaymentMethods from '../components/PaymentMethods';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function Payments() {
  const { currentUser } = useAuth();
  const { userData } = useFirestore();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showPayForm, setShowPayForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const newCardRef = useRef(null);
  const balance = 1000;

  // Get the card details
  useEffect(() => {
    if (userData && userData.payments && userData.payments.cards) {
      setCards(userData.payments.cards);
    }
  }, [userData]);

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

  const disablePayButton = () => {
    if (amount <= 100) {
      return true;
    } else {
      return false;
    }
  }

  // Handle amount change because Stripe uses cents
  const handleAmountChange = (e) => {
    const amountInCents = e.target.value * 100;
    setAmount(amountInCents);
  };

  // Create a PaymentIntent with the specified amount.
  useEffect(() => {
    fetch("https://us-central1-dashboard-c48b3.cloudfunctions.net/createPaymentIntentWithoutId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount || 100 }),
    })
    .then((res) => {
      if (!res.ok) {
        return res.text().then(text => {throw new Error(text)});
      }
      return res.json();
    })
    .then((data) => setClientSecret(data.clientSecret))
    .catch((error) => console.error('Error:', error));
  }, [newCardRef, amount]);


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
                        <div>Amount</div>
                        <InputGroup>
                          <InputGroup.Text id="payment">$</InputGroup.Text>
                          <Form.Control
                            placeholder="0"
                            aria-label="payment-input"
                            aria-describedby="payment"
                            onChange={handleAmountChange}
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
                          <option value="newCard" ref={newCardRef}>---Pay with new card---</option>
                        </Form.Select>
                      </Col>
                    </Row>

                    {showCardForm && clientSecret && (
                      <Elements key={clientSecret} options={options} stripe={stripePromise}>
                        <CardPaymentForm clientSecret={clientSecret} />
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
        <PaymentMethods />
      </Row>
    </div>
  )
}

export default Payments