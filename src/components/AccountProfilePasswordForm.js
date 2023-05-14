// Description: Password form for Account Profile page

import React, { useState, useRef } from 'react';
import { Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

function AccountProfilePasswordForm() {
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

  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmNewPasswordRef = useRef();

  const [errorPassword, setErrorPassword] = useState('');
  const [successPassword, setSuccessPassword] = useState('');

  const [loading, setLoading] = useState(false);

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

  return (
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
  )
}

export default AccountProfilePasswordForm