// Description: Payments page

import React, { useState, useEffect } from 'react';
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

  // Handle amount change because Stripe uses cents
  const handleAmountChange = (e) => {
    const amountInCents = e.target.value * 100;
    setAmount(amountInCents);
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

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const stripe = await stripePromise;
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: selectedCard,
      customer: currentUser.id,
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        console.log('Success!');
      }
    }
    setLoading(false);
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
                      <Button variant="success" className="mt-3" onClick={handlePayment}>
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