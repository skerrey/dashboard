// Description: Signup component

import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../images/logo.svg';

export default function Signup() {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, updateInfo } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) { // signup user on submit
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) { // check if passwords match
      return setError('Passwords do not match')
    }

    const name = firstNameRef.current.value + " " + lastNameRef.current.value;

    // Capitalize first letter of first and last name upon signup
    const capitalize = (name) => {
      return name
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    try { // try to signup user
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      await updateInfo(capitalize(name));
      // await auth.currentUser.reload();
      navigate('/');
      // let user = auth.currentUser;
      // await user.reload();
      // user = auth.currentUser; // Reload the user object
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setError('An account with that email already exists');
      } else if (e.code === 'auth/invalid-email') {
        setError('Invalid email');
      } else if (e.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters');
      } else {
        setError('Failed to create an account');
      }
      console.log(e);
    }
    setLoading(false);
  }


  return (
    <>
      <Container className="px-sm-0 px-md-1">
        <Row className="pt-sm-5 mb-0">
          <Col sm={9} md={7} lg={6} xl={5} className="px-0 mx-auto pt-sm-5">
            <Card className="shadow-sm p-3 p-sm-5">
              <div className="mb-3 d-flex justify-content-center">
                <img src={logo} alt="logo" height="75" />
              </div>
              <div className="mx-4 mx-sm-1">
                <h3 className="mb-3">
                  Create an account
                </h3>

                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Form.Group as={Col} id="first-name">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control type="text" autoComplete="first-name" ref={firstNameRef} required />
                    </Form.Group>
                    <Form.Group as={Col} id="last-name">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control type="text" autoComplete="family-name" ref={lastNameRef} required />
                    </Form.Group>
                  </Row>
                  <Form.Group id="email" className="mt-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" autoComplete="email" ref={emailRef} required />
                  </Form.Group>
                  <Form.Group id="password" className="my-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" autoComplete="new-password" ref={passwordRef} required />
                  </Form.Group>
                  <Form.Group id="password-confirm">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control type="password" autoComplete="new-password" ref={passwordConfirmRef} required />
                  </Form.Group>
                  <Button disabled={loading} className="mt-3" type="submit">Sign Up</Button>
                </Form>
                <div className="text-center pt-2">
                  Already have an account? <NavLink to="/login">Login</NavLink>
                </div>

              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}
