// Description: Login component

import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../images/logo.svg';
import Announcement from './Announcement';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) { // login user on submit
    e.preventDefault(); 

    try { // try to login user
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate('/'); // navigate home
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        setError('No account with that email');
      } else if (e.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else {
        setError('Failed to sign in');
      }
      console.log(e);
    }
    setLoading(false);
  }

  return (
    <>
      <Announcement
        header="Use the following credentials to login:"
        body={`
          <strong>Email:</strong> example@test.com
          <br />
          <strong>Password:</strong> password123
          <br />
          <i>Or Sign Up a new user</i>
        `}
      />
      <Container className="px-sm-0 px-md-1">
        <Row className="pt-sm-5 mb-0">
          <Col sm={9} md={7} lg={6} xl={5} className="px-0 mx-auto pt-sm-5">
            <Card className="shadow-sm p-3 p-sm-5">
              <div className="mb-3 d-flex justify-content-center">
                <img src={logo} alt="logo" height="75" />
              </div>
              <div className="mx-4 mx-sm-1">
                <h3 className="mb-3">
                  Log in to your account
                </h3>

                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" autoComplete="email" ref={emailRef} required />
                  </Form.Group>
                  <Form.Group id="password" className="my-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" autoComplete="current-password" ref={passwordRef} required />
                  </Form.Group>
                  <div className="d-flex justify-content-between py-3">
                    <Button disabled={loading} type="submit">Log In</Button>
                    <NavLink to="/forgot-password" className="btn btn-link">Forgot Password?</NavLink>
                  </div>
                </Form>
                <div className="text-center pt-2">
                  Need an account? <NavLink to="/signup">Sign Up</NavLink>
                </div>
                <div className="text-center pt-2">
                  <NavLink to="/admin-login">Admin Login</NavLink>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}
