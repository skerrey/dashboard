// Description: Settings page

import React, { useState, useRef } from 'react';
import { Row, Col, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const { updateUserPassword, verifyPassword, deleteAccount } = useAuth();

  const navigate = useNavigate();

  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmNewPasswordRef = useRef();
  const verifyCurrentPasswordRef = useRef(); // for delete account

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errorDelAccount, setErrorDelAccount] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal functions
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Update user password
  async function handleSubmitPasswordForm(e) { 
    e.preventDefault();

    const oldPassword = oldPasswordRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const confirmNewPassword = confirmNewPasswordRef.current.value;

    // check if current password is correct from firebase
    const isPasswordCorrect = await verifyPassword(oldPassword);
    if (!isPasswordCorrect) { 
      return setError('Current password is incorrect')
    }

    if (oldPassword && !newPassword) { // check if new password is empty
      return setError('New password cannot be empty')
    }

    if (newPassword !== confirmNewPassword) { // check if passwords match
      return setError('Passwords do not match')
    }

    try { // try to update user password
      setError('');
      setLoading(true);
      await updateUserPassword(newPassword);
      setSuccess('Password successfully updated');

      // Clear input fields
      oldPasswordRef.current.value = '';
      newPasswordRef.current.value = '';
      confirmNewPasswordRef.current.value = '';

      setTimeout(() => {
        setSuccess('');
      }, 3000); 
    } catch (e) {
      setError('Failed to update account');
      console.log(e);
    }
    setLoading(false);
  }

  // Delete user account
  async function deleteUserAccount(e) {
    e.preventDefault();

    const verifyCurrentPassword = verifyCurrentPasswordRef.current.value;

    // check if current password is correct
    const isPasswordCorrect = await verifyPassword(verifyCurrentPassword);
    if (!isPasswordCorrect) {
      return setErrorDelAccount('Incorrect password');
    }

    try {
      setErrorDelAccount('');
      setLoading(true);
      await deleteAccount();
      navigate('/login'); // redirect to login page after account deletion
      alert("Your Account has been deleted.")
    } catch (e) {
      setErrorDelAccount('Failed to delete account');
      console.log(e);
    }
    setLoading(false);
  }

  return (
    <div className="account-profile">
      <div className="page-title">
        Settings <FontAwesomeIcon icon="fa-solid fa-gear" size="xs" />
      </div>
      <Row xs={1} sm={1} md={1} lg={2}>
        <Col className="col">
          <Card className="card-settings">
            <Card.Body>
              <Card.Title>Update Password</Card.Title>
              <Form onSubmit={handleSubmitPasswordForm}>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
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
                  Update
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col className="col">
          <Card className="card-settings">
            <Card.Body>
              <Card.Title>Delete Account</Card.Title>
              <div className="text-muted ">
                <p>Deleting your account will remove all your data from our servers. This action cannot be undone.</p>
              </div>
              <Button variant="danger" className="mt-3" onClick={handleShow}>
                Delete Account
              </Button>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body className="fw-bold">
                  <div>
                    Deleting your account will remove all your data from our servers. This action cannot be undone.
                  </div>
                  <br/>
                  <Form>
                    {errorDelAccount && <Alert variant="danger">{errorDelAccount}</Alert>}
                    <Form.Group id="verify-password-for-del" className="my-2">
                      <Form.Control 
                      aria-labelledby="verify-password-for-del" 
                      type="password" 
                      placeholder="Verify Password to Delete Account" 
                      autoComplete="current-password" 
                      ref={verifyCurrentPasswordRef} 
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    CANCEL
                  </Button>
                  <Button variant="danger" onClick={deleteUserAccount}>
                    DELETE ACCOUNT
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Settings