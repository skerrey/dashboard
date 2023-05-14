// Description: User Details form for Account Profile page

import React, { useState, useEffect, useRef } from 'react';
import { Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase.config';
import { doc, getDoc } from "firebase/firestore";

function AccountProfileUserDetails() {
  const { 
    userId,
    currentUser, 
    updatePhone,
    updateUserEmail, 
    updateInfo, 
    verifyEmail,
    verifyPassword,
  } = useAuth();

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const verifyPasswordRef = useRef();

  const userPhone = currentUser.phoneNumber;
  
  const [errorUserDetails, setErrorUserDetails] = useState('');
  const [successUserDetails, setSuccessUserDetails] = useState('');
  const [verifyPasswordIfInactive, setVerifyPasswordIfInactive] = useState(false);
  const [emailVerifyClicked, setEmailVerifyClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userEmailVerified, setUserEmailVerified] = useState(currentUser.emailVerified);

  // Split up current user's name into first and last name
  var nameArr = currentUser.displayName.split(/\s+/);

  // Capitalize first letter of first and last name upon signup
  const capitalize = (name) => {
    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get user phone from firestore
  function getPhone() {
    const docRef = doc(db, "users", userId);
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const userPhone = data.phone;
          return userPhone;

      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
    console.log(userPhone);
  }

  // Update user details
  async function handleSubmitUserDetails(e) {
    e.preventDefault();

    // Join current user's first and last name
    const name = firstNameRef.current.value + " " + lastNameRef.current.value;

    try {
      setErrorUserDetails('');
      setLoading(true);
    
      if(verifyPasswordIfInactive === true) {
        await verifyPassword(verifyPasswordRef.current.value);
      }
      await updateInfo(capitalize(name));
      await updatePhone(phoneRef.current.value);
      await updateUserEmail(emailRef.current.value);

      setVerifyPasswordIfInactive(false);
      setSuccessUserDetails('Account successfully updated');
      setTimeout(() => { 
        setSuccessUserDetails('');
      }, 3000);
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setErrorUserDetails('An account with that email already exists');
      } else if (e.code === 'auth/invalid-email') {
        setErrorUserDetails('Invalid email format');
      } else if (e.code === 'auth/requires-recent-login') {
        setErrorUserDetails('Please verify your password to update your email');
        setVerifyPasswordIfInactive(true); // Show verify password input if inactive
      } else {
        setErrorUserDetails('Failed to update account');
      }
      console.log(e);
    }
    setLoading(false);
  }

  // Send email verification
  function handleEmailVerify() {
    verifyEmail();
    setEmailVerifyClicked(true);
    setTimeout(() => {
      setEmailVerifyClicked(false);
    }, 4000);
  }

  // Watch user email verified state
  useEffect(() => {
    setUserEmailVerified(currentUser.emailVerified);
  }, [currentUser.emailVerified]);

  return (
    <Col className="col">
      <Card className="card-account">
        <Card.Body>
          <Card.Title>User Details</Card.Title>
          <div>
            {errorUserDetails && <Alert variant="danger">{errorUserDetails}</Alert>}
            {successUserDetails && <Alert variant="success">{successUserDetails}</Alert>}
            <Form onSubmit={handleSubmitUserDetails}>
              <Form.Group id="first-name" >
                <Form.Label>First Name</Form.Label>
                <Form.Control aria-labelledby="first-name" type="text" autoComplete="given-name" ref={firstNameRef} required defaultValue={nameArr[0]} />
              </Form.Group>
              <Form.Group id="last-name" className="my-2">
                <Form.Label>Last Name</Form.Label>
                <Form.Control aria-labelledby="last-name" type="text" autoComplete="family-name" ref={lastNameRef} required defaultValue={nameArr[1]} />
              </Form.Group>
              <Form.Group id="phone" className="my-2">
                <Form.Label>Phone</Form.Label>
                <Form.Control aria-labelledby="phone" type="tel" autoComplete="tel" ref={phoneRef} required defaultValue={getPhone()} />
              </Form.Group>

              {/* Conditional form group for users w/ and w/out email verified */}
              {userEmailVerified === true 
                ? (
                  <Form.Group id="email" className="my-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control aria-labelledby="email" type="email" autoComplete="email"  ref={emailRef} required defaultValue={currentUser.email}/>
                  </Form.Group>
                ) : (
                  <Form.Group id="email" className="my-2">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <Form.Control aria-labelledby="email" type="email" autoComplete="email"  ref={emailRef} required defaultValue={currentUser.email}/>
                      <InputGroup.Text id="email-verify">
                        <Button className="btn-verify-email" onClick={handleEmailVerify}>
                          <FontAwesomeIcon icon="fa-solid fa-envelope" /> 
                          &nbsp; Verify Email
                        </Button>
                      </InputGroup.Text>
                    </InputGroup>
                    {emailVerifyClicked &&
                      <Alert variant="success" className="p-1 mt-2 ms-auto">
                      An email verification has been sent your inbox.
                      </Alert>
                    }
                  </Form.Group>
                )
              }
              {verifyPasswordIfInactive === true &&
                <Form.Group id="verify-password" className="my-2">
                  <Form.Label>Verify Password</Form.Label>
                  <Form.Control aria-labelledby="verify-password" type="password" autoComplete="current-password" ref={verifyPasswordRef} required />
                </Form.Group>
              }
              <Button disabled={loading} className="mt-3" type="submit">
                Update User Details
              </Button>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default AccountProfileUserDetails