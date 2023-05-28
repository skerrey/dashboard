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
  const { userData, saveTransaction, updateBalance } = useFirestore();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(50); // requires value to load (only 50¢)
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showPayForm, setShowPayForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const newCardRef = useRef(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [balance, setBalance] = useState(1000);

  // Get balance
  useEffect(() => {
    if (userData && userData.payments && userData.payments.balance) {
      setBalance(userData.payments.balance);
    }
  }, [userData]);

  // Get the card details
  useEffect(() => {
    if (userData && userData.payments && userData.payments.cards) {
      setCards(userData.payments.cards);
    }
  }, [userData]);

  // Get transactions
  useEffect(() => {
    if (userData && userData.payments && userData.payments.transactions) {
      setTransactions(userData.payments.transactions);
    }
  }, [userData]);

  // Show the payment form
  const handlePaymentOptionChange = async (e) => {
    if (e.target.value === 'newCard') {
      setShowCardForm(true);
      setSelectedCard(null);
    } else if (e.target.value === 'noCardSelected') {
      setSelectedCard(null);
    } else {
      setShowCardForm(false);
      setSelectedCard(e.target.value);
    }
  };

  // Disable payment button until user puts in at least 50¢
  const disablePayButton = () => {
    if (amount <= 50) {
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

  // Create a PaymentIntent for a new card
  useEffect(() => {
    fetch("https://us-central1-dashboard-c48b3.cloudfunctions.net/createPaymentIntentWithoutId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        amount: amount || 50,
        userId: currentUser.uid,
      }),
    })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      return res.json();
    })
    .then((data) => setClientSecret(data.clientSecret))
    .catch((error) => console.error('Error:', error));
  }, [amount, currentUser]);
  
  const handlePayment = async () => {
    try {
      setLoading(true);
  
      const res = await fetch('https://us-central1-dashboard-c48b3.cloudfunctions.net/createPaymentIntent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          customerId: userData.stripeCustomerId,
          payment_method: selectedCard,
        }),
      });
  
      if (!res.ok) {
        throw new Error('Error creating payment intent');
      }
  
      const data = await res.json();
      const clientSecret = data.clientSecret;
  
      // Use Stripe.js to confirm the payment with the client secret
      const stripe = await stripePromise;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: selectedCard,
      });
  
      if (result.error) {
        console.error(result.error);
        setError(result.error.message);
        setTimeout(() => setError(""), 3000);
      } else {
        // Payment successful
        console.log('Payment succeeded');
        setSuccess("Your payment was successful!");
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

        // Update balance
        const newBalance = balance - (amount / 100);
        setBalance(newBalance);
        updateBalance(userData._id, newBalance);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    } 
    setLoading(false);
  };
  
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
                          <option value="noCardSelected">Select Payment Option</option>
                          {cards && cards.map((card) => (
                            <option key={card._id} value={card._id}>{`${card.brand.toUpperCase()} ending in ${card.last4}`}</option>
                          ))}
                          <option value="newCard" ref={newCardRef}>---Pay with new card---</option>
                        </Form.Select>
                      </Col>
                    </Row>

                    {showCardForm && clientSecret && (
                      <Elements key={clientSecret} options={options} stripe={stripePromise}>
                        <CardPaymentForm clientSecret={clientSecret} amount={amount} />
                      </Elements>
                    )}
                    
                    <div className="d-flex align-items-center">
                      {selectedCard && 
                        <Button 
                          variant="success" 
                          className="mt-3" 
                          onClick={handlePayment}
                          disabled={disablePayButton() || loading}
                        >
                            Pay
                        </Button>
                      }
                      {loading && <Spinner animation="border" variant="primary" className="ms-3"/> }
                    </div>
                    
                    {success && <div className="text-success">{success}</div>}
                    {error && <div className="text-danger">{error}</div>}
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
              {transactions && transactions.map((transaction) => (
                <div 
                  key={transaction._id} 
                  value={transaction._id}
                >
                  Payment made on {transaction.paidOn} for ${transaction.amount}.00 - {transaction.status}
                  <hr className="text-muted m-1" />
                </div>
              ))}
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