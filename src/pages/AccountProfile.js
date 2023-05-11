// Description: Account Profile page

import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./AccountProfile.scss";

import { useAuth } from '../contexts/AuthContext';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function AccountProfile() {
  const { currentUser, updatePassword, updateEmail, updateInfo } = useAuth();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const [errorUserDetails, setErrorUserDetails] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [successUserDetails, setSuccessUserDetails] = useState('');
  const [successPassword, setSuccessPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const userPhone = currentUser.phoneNumber;
  const userEmailVerified = currentUser.emailVerified;
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

  // Update user details
  function handleSubmitUserDetails(e) {
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

    const promises = []; // Update email and username
    setLoading(true);
    setErrorUserDetails('');

    if (name !== currentUser.displayName) {
      promises.push(updateInfo(capitalize(name)))
    }

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value))
    }
    Promise.all(promises).then(() => {
      setSuccessUserDetails('Account successfully updated');
      setTimeout(() => {
        setSuccessUserDetails('');
      }, 3000); 
    }).catch(() => {
      setErrorUserDetails('Failed to update account');
      setTimeout(() => {
        setErrorUserDetails('');
      }, 3000); 
    }).finally(() => {
      setLoading(false);
    })
  }

  // Update user password
  function handleSubmitUserPassword(e) { 
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) { // check if passwords match
      return setErrorPassword('Passwords do not match')
    }

    const promises = []; // Update password
    setLoading(true);
    setErrorPassword('');

    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value))
    }
    
    Promise.all(promises).then(() => {
      setSuccessPassword('Password successfully updated');
      setTimeout(() => {
        setSuccessPassword('');
      }, 3000); 
    }).catch(() => {
      setErrorPassword('Failed to update account');
      setTimeout(() => {
        setErrorPassword('');
      }, 3000); 
    }).finally(() => {
      setLoading(false);
    })
  }

  // Split up current user's name into first and last name
  var nameArr = currentUser.displayName.split(/\s+/);

  console.log("currentUser: ", currentUser);

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
                <Form.Group id="first-name">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control aria-labelledby="first-name" type="text" autoComplete="first-name" ref={firstNameRef} required defaultValue={nameArr[0]} />
                </Form.Group>
                <Form.Group id="last-name">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control aria-labelledby="last-name" type="text" autoComplete="family-name" ref={lastNameRef} required defaultValue={nameArr[1]} />
                </Form.Group>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control aria-labelledby="email" type="email" autoComplete="email"  ref={emailRef} required defaultValue={currentUser.email}/>
                </Form.Group>
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
              <Form.Group id="password" className="my-2">
                <Form.Label>Password</Form.Label>
                <Form.Control aria-labelledby="password" type="password"  autoComplete="new-password" ref={passwordRef} placeholder='Leave blank to keep the same' />
              </Form.Group>
              <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control aria-labelledby="password-confirm" type="password" autoComplete="new-password" ref={passwordConfirmRef} placeholder='Leave blank to keep the same' />
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