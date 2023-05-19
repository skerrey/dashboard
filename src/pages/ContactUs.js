// Description: ContactUs page

import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFirestore } from "../contexts/FirestoreContext";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../contexts/AuthContext';


function ContactUs() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { addContactUsMessage } = useFirestore();
  const { userId } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const messageId = uuidv4();

    try {
      addContactUsMessage(userId, messageId, subject, message)
      setSuccessMessage('Your message has been sent!');
      setMessage('');
      setSubject('');
      console.log("Message sent");
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); 
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className="page-title">
        Contact Us <FontAwesomeIcon icon="fa-solid fa-circle-info" size="xs" />
      </div>
      <Row xs={1} sm={1} md={1} lg={2}>
        <Col className="col">
          <Card className="card-contact">
            <Card.Body>
              <Card.Title>Send us an Email</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="contactForm.ControlTextarea1">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control className="w-25 mb-2" type="text" required rows={1} value={subject} onChange={(e) => setSubject(e.target.value)} />
                  <Form.Label>Enter your message below</Form.Label>
                  <Form.Control type="text" as="textarea" required rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
                  <Form.Text className="text-muted">
                    Please allow for a 48 hour response time.
                  </Form.Text>
                </Form.Group>
                {successMessage && <div className="text-success">{successMessage}</div>}
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col className="col">
        <Card className="card-contact">
          <Card.Body>
            <Card.Title>Contact Information</Card.Title>
              <p><FontAwesomeIcon icon="fa-solid fa-phone" size="lg" className="text-primary" /> &nbsp;555-555-5555</p>
              <p><FontAwesomeIcon icon="fa-solid fa-envelope" size="lg" className="text-primary" /> &nbsp;info@mpm.com</p>
              <p><FontAwesomeIcon icon="fa-solid fa-location-dot" size="lg" className="text-primary" /> &nbsp; 555 Center Street, Rome, USA</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
  )
}

export default ContactUs