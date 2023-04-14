// Description: Login component

import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';

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
      navigate('/'); // navigate home after login
    } catch (e) {
      setError('Failed to sign in');
      console.log(e);
    }
    setLoading(false);
  }

  return (
    <>
      <Card className="w-25 m-auto mt-5">
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
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
            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <NavLink to="/forgot-password">Forgot Password?</NavLink>
            <div className="mt-2">
              Need an account? <NavLink to="/signup">Sign Up</NavLink>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}
