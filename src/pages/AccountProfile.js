// Description: Account Profile page

import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./AccountProfile.scss";

import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase.config';
import { doc, getDoc } from "firebase/firestore";
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function AccountProfile() {
  
  const { 
    userId,
    currentUser, 
    updateUserPassword, 
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
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmNewPasswordRef = useRef();

  const [errorUserDetails, setErrorUserDetails] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [successUserDetails, setSuccessUserDetails] = useState('');
  const [verifyPasswordIfInactive, setVerifyPasswordIfInactive] = useState(false);
  const [successPassword, setSuccessPassword] = useState('');
  const [emailVerifyClicked, setEmailVerifyClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Current user details
  const userPhone = currentUser.phoneNumber;
  const [userEmailVerified, setUserEmailVerified] = useState(currentUser.emailVerified);
  const userCreatedAt = currentUser.metadata.creationTime;

  // Get time difference between now and creation time
  function getTimeDifference(createdAt) {
    const creationDate = new Date(createdAt);
    const today = new Date();
    const diffInMs = today - creationDate;

    if (diffInMs < 1000 * 60 * 60 * 24) { // less than 24 hours
      return "today";
    }
  
    let diff, unit;
    if (diffInMs < 1000 * 60 * 60 * 24 * 7) { // less than 1 week
      diff = Math.round(diffInMs / (1000 * 60 * 60 * 24));
      unit = 'day';
    } else if (diffInMs < 1000 * 60 * 60 * 24 * 30) { // less than 1 month
      diff = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 7));
      unit = 'week';
    } else if (diffInMs < 1000 * 60 * 60 * 24 * 365) { // less than 1 year
      diff = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 30));
      unit = 'month';
    } else { // more than 1 year
      diff = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 365));
      unit = 'year';
    }
  
    const diffString = diff === 1 ? 'almost one' : `almost ${diff}`;
    const unitString = `${unit}${diff === 1 ? '' : 's'}`;
  
    return `${diffString} ${unitString} ago`;
  }

  // Calculate percentage of profile completion
  function checkPercentage() {
    let percentage = 33;
    if (userPhone != null) {
      percentage += 33;
    }
    if (userEmailVerified === true) {
      percentage += 33;
    }
    return percentage;
  }

  // Re-enter password to update email
  // function verifyPasswordIfInactive() {
  //   const password = prompt("Please enter your password to update your email");
  //   if (password != null) {
  //     verifyPassword(password).then((result) => {
  //       if (result === true) {
  //         updateUserEmail(emailRef.current.value)
  //       } else {
  //         alert("Incorrect password");
  //       }
  //     });
  //   }
  // }

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

    const name = firstNameRef.current.value + " " + lastNameRef.current.value;

    // Capitalize first letter of first and last name upon signup
    const capitalize = (name) => {
      return name
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    try {
      setErrorUserDetails('');
      setLoading(true);
      if(verifyPasswordIfInactive === true) {
        await verifyPassword(verifyPasswordRef.current.value);
      }
      await updateInfo(capitalize(name));
      await updatePhone(phoneRef.current.value);
      await updateUserEmail(emailRef.current.value);
      setSuccessUserDetails('Account successfully updated');
      setTimeout(() => { 
        setSuccessUserDetails('');
      }, 3000);
      setVerifyPasswordIfInactive(false);
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setErrorUserDetails('An account with that email already exists');
      } else if (e.code === 'auth/invalid-email') {
        setErrorUserDetails('Invalid email format');
      } else if (e.code === 'auth/requires-recent-login') {
        setErrorUserDetails('Please verify your password to update your email');
        setVerifyPasswordIfInactive(true);
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

  // Update user password
  async function handleSubmitUserPassword(e) { 
    e.preventDefault();

    const oldPassword = oldPasswordRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const confirmNewPassword = confirmNewPasswordRef.current.value;

    // check if current password is correct from firebase
    const isPasswordCorrect = await verifyPassword(oldPassword);
    if (!isPasswordCorrect) { 
      return setErrorPassword('Current password is incorrect')
    }

    if (oldPassword && !newPassword) { // check if new password is empty
      return setErrorPassword('New password cannot be empty')
    }

    if (newPassword !== confirmNewPassword) { // check if passwords match
      return setErrorPassword('Passwords do not match')
    }

    try { // try to update user password
      setErrorPassword('');
      setLoading(true);
      await updateUserPassword(newPassword);
      setSuccessPassword('Password successfully updated');

      // Clear input fields
      oldPasswordRef.current.value = '';
      newPasswordRef.current.value = '';
      confirmNewPasswordRef.current.value = '';

      setTimeout(() => {
        setSuccessPassword('');
      }, 3000); 
    } catch (e) {
      setErrorPassword('Failed to update account');
      console.log(e);
    }
    setLoading(false);
  }

  // Split up current user's name into first and last name
  var nameArr = currentUser.displayName.split(/\s+/);

  useEffect(() => {
    setUserEmailVerified(currentUser.emailVerified);
  }, [currentUser.emailVerified]);

  console.log("currentUser: " + currentUser);
  console.log(userId.email);

  return (
    <div className="account-profile">
      <div className="page-title">
        Account Profile <FontAwesomeIcon icon="fa-solid fa-user" size="xs" />
      </div>
      <Row>
        <Col className="col">
            <Card className="card-account">
              <Card.Body>
                <Card.Title>Account Setup</Card.Title>
                <Row>
                  <Col align="center">
                    <div className="cpb-parent">
                      <CircularProgressbarWithChildren value={checkPercentage()}>
                        <div>{checkPercentage()}%</div>
                        <div>Complete</div>
                      </CircularProgressbarWithChildren>
                    </div>

                  </Col>
                </Row>
                <Row align="center">
                  <Col className="icon-col">
                    <div className="icon-circle-activated">
                      <FontAwesomeIcon icon="fa-solid fa-user-plus" />
                    </div>
                    <div className="text-muted text-start ps-2">
                      <div>Account Activated</div>
                      <div>{getTimeDifference(userCreatedAt)}</div>
                    </div>
                  </Col>
                  <Col className="icon-col">
                    <div className={userPhone != null ? "icon-circle-activated" : "icon-circle-not-activated"}>
                      <FontAwesomeIcon icon="fa-solid fa-phone" />
                    </div>
                    <div className="text-muted text-start ps-2">
                    {
                        userPhone != null ?
                        <>
                          <div>Phone Added</div>
                          <div></div>
                        </>
                        :
                        <div>Phone Not Added</div>
                      }
                    </div>
                  </Col>
                  <Col className="icon-col">
                    <div className={userEmailVerified === true ? "icon-circle-activated" : "icon-circle-not-activated"}>
                      <FontAwesomeIcon icon="fa-solid fa-user-plus" />
                    </div>
                    <div className="text-muted text-start ps-2">
                      {
                        userEmailVerified === true ?
                        <>
                          <div>Email Verified</div>
                          <div></div>
                        </>
                        :
                        <div>Email Not Verified</div>
                      }
                    </div>
                  </Col>
                </Row>
            </Card.Body>
          </Card>
        </Col>
    </Row>
    <Row xs={1} sm={1} md={1} lg={2}>
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
                {userEmailVerified === true ?
                  <Form.Group id="email" className="my-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control aria-labelledby="email" type="email" autoComplete="email"  ref={emailRef} required defaultValue={currentUser.email}/>
                  </Form.Group>
                :
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
      <Col className="col">
        <Card className="card-account">
          <Card.Body>
            <Card.Title>Password</Card.Title>
            <Form onSubmit={handleSubmitUserPassword}>
              {errorPassword && <Alert variant="danger">{errorPassword}</Alert>}
              {successPassword && <Alert variant="success">{successPassword}</Alert>}
              <Form.Group id="old-password" className="my-2">
                <Form.Label>Current Password</Form.Label>
                <Form.Control aria-labelledby="old-password" type="password"  autoComplete="current-password" ref={oldPasswordRef} />
              </Form.Group>
              <Form.Group id="new-password" className="my-2">
                <Form.Label>New Password</Form.Label>
                <Form.Control aria-labelledby="new-password" type="password"  autoComplete="new-password" ref={newPasswordRef} />
              </Form.Group>
              <Form.Group id="confirm-new-password">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control aria-labelledby="confirm-new-password" type="password" autoComplete="new-password" ref={confirmNewPasswordRef} />
              </Form.Group>
              <Button disabled={loading} className="mt-3" type="submit">
                Update Password
              </Button>
            </Form>
          </Card.Body>
          </Card>
      </Col>
    </Row>
  </div>
  )
}

export default AccountProfile