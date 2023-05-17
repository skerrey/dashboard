// Description: Address form for Account Profile page

import React, { useState, useRef, useEffect } from 'react';
import { Col, Card, Form, Button, Alert } from 'react-bootstrap';

import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';

function AccountProfileAddress() {
  const { userId } = useAuth();
  const { updateAddress, getAddress } = useFirestore(); 

  const addressRef = useRef();
  const address2Ref = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const zipRef = useRef();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [address, setAddress] = useState('');

  // List of states for select dropdown
  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  // Get user phone from Firestore
  useEffect(() => {
    getAddress(userId)
      .then((address) => {
        setAddress(address);
      })
      .catch((error) => {
        console.log("Error getting user phone:", error);
      });
  }, [getAddress, userId]);

  console.log("address:", address);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await updateAddress (
        userId, 
        addressRef.current.value, 
        address2Ref.current.value, 
        cityRef.current.value, 
        stateRef.current.value,
        zipRef.current.value
      );
      setSuccess('Address successfully updated');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (e) {
      setError('Failed to add address');
    }
  }

  return (
    <Col className="col">
      <Card className="card-account ap-address">
        <Card.Body>
          <Card.Title>Address</Card.Title>
          <div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="address-1" >
                <Form.Label>Address 1</Form.Label>
                <Form.Control aria-labelledby="address-1" type="text" autoComplete="address" ref={addressRef} required defaultValue={address ? address.address : ''} />
              </Form.Group>
              <Form.Group id="address-2" className="my-2">
                <Form.Label>Address 2</Form.Label>
                <Form.Control aria-labelledby="address-2" type="text" autoComplete="addressLine2" ref={address2Ref} required defaultValue={address ? address.address2 : ''} />
              </Form.Group>
              <div className="d-flex my-2">
                <Form.Group id="city" className="me-2">
                  <Form.Label>City</Form.Label>
                  <Form.Control aria-labelledby="city" type="text" autoComplete="home city"  ref={cityRef} required defaultValue={address ? address.city : ''}/>
                </Form.Group>
                <Form.Group id="state" className="ms-2 me-2">
                  <Form.Label>State</Form.Label>
                  <Form.Select
                    aria-labelledby="state-select"
                    autoComplete="state"
                    ref={stateRef}
                    value={address ? address.state : '' || selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state} id={state} aria-labelledby={state}>
                        {state}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group id="zip-code" className="ms-2">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control aria-labelledby="zip-code" type="text" autoComplete="postal-code" ref={zipRef} required defaultValue={address ? address.zip : ''} maxLength="5" />
                </Form.Group>
              </div>
              <Button disabled={loading} className="mt-3" type="submit">
                Update
              </Button>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default AccountProfileAddress