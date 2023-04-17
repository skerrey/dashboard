// Description: Forgot password component

import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { NavLink } from 'react-router-dom';
import logo from '../images/logo.svg';

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);


  async function handleSubmit(e) { // login user on submit
    e.preventDefault(); 

    try { // try to login user
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage('Check your inbox for further instructions');
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        setError('No account with that email');
      } else {
        setError('Failed to reset password');
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
                  Password Reset
                </h3>

                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                  </Form.Group>
                  <div className="d-flex justify-content-between py-3">
                    <Button disabled={loading} type="submit">Reset Password</Button>
                    <NavLink to="/login" className="btn btn-link">Login</NavLink>
                  </div>
                </Form>
                <div className="text-center pt-2">
                  Need an account? <NavLink to="/signup">Sign Up</NavLink>
                </div>

              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}
