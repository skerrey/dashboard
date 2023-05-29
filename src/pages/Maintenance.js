// Description: Maintenance page

import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from "../contexts/FirestoreContext";
import { useStorage } from '../contexts/StorageContext';
import { v4 as uuidv4 } from 'uuid';

function ContactUs() {
  const { userId } = useAuth();
  const { uploadFiles } = useStorage();
  const { addMaintenanceRequest, getMaintenanceRequests } = useFirestore();

  const maintenanceId = uuidv4();
  
  const fileInputRef = useRef();

  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [issue, setIssue] = useState("");
  const [other, setOther] = useState(false);
  const [otherMessage, setOtherMessage] = useState("");
  const [file, setFile] = useState("");
  const [fileArray, setFileArray] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (issue === "other") {
      setOther(true);
    }

    try {
      addMaintenanceRequest(userId, maintenanceId, file, issue, otherMessage, message);
      uploadFiles(userId, fileArray, maintenanceId);
      setSuccessMessage('Your message has been sent!');

      // Reset form fields
      setFile("");
      setMessage("");
      setIssue("");
      setOther(false);
      setOtherMessage("");
      fileInputRef.current.value = null;
      setFileArray([]);
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); 
    } catch (e) {
      console.log(e);
    }
  };

  // Populates maintenance requests
  useEffect(() => {
    getMaintenanceRequests(userId, setMaintenanceRequests);
  }, [message]);


  // Iterates through files
  useEffect(() => {
      if (file) {
        setFileArray((prevFileArray) => [...prevFileArray, file]);
      }
  }, [file]);

  return (
    <div>
      <div className="page-title">
        Maintenance <FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" size="xs" />
      </div>
      <Row xs={1} sm={1} md={1} lg={2}>
        <Col>
        <Card className="card-maintenance">
          <Card.Body>
            <Card.Title>Maintenance Requests</Card.Title>
            <>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="maintenanceForm.ControlTextarea1">
                  <Form.Label className="bg-light rounded p-2 mb-3">
                    <FontAwesomeIcon icon="fa-solid fa-circle-info" /> &nbsp;Please provide a detailed description of your maintenance request.
                  </Form.Label>
                  <Form.Control type="text" as="textarea" required rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
                </Form.Group>

                <h5>Select issue:</h5>
                <Form.Group className="mb-3" controlId="maintenanceCheckbox" >
                  <Form.Check 
                    id="check-plumbing" 
                    name="group1" 
                    type="radio" 
                    label="Plumbing" 
                    required
                    onChange={() => {
                      setIssue("Plumbing");
                    }}
                  />
                  <Form.Check 
                    id="check-electrical" 
                    name="group1" 
                    type="radio" 
                    label="Electrical" 
                    required
                    onChange={() => {
                      setIssue("Electrical");
                    }}
                  />
                  <Form.Check 
                    id="check-general" 
                    name="group1" 
                    type="radio" 
                    label="General" 
                    required
                    onChange={() => {
                      setIssue("General");
                    }}
                  />
                  <Form.Check 
                    id="check-other" 
                    name="group1" 
                    type="radio" 
                    label="Other" 
                    required
                    onChange={() => {
                      setIssue("Other");
                    }}
                  />
                  {issue === "Other" &&
                    <Form.Control 
                      placeholder="Please specify" 
                      type="text" 
                      as="textarea" 
                      maxLength={15}
                      required
                      rows={1} 
                      value={otherMessage} 
                      onChange={(e) => setOtherMessage(e.target.value)}
                    />
                  }
                </Form.Group>

                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label style={{fontSize: "20px"}}>Upload files:</Form.Label>
                  <Form.Control type="file" size="sm" ref={fileInputRef} onChange={(e) => {setFile(e.target.files[0])}} />
                </Form.Group>

                {/* Iterate over files to display file names and delete button */}
                {fileArray && fileArray.map((file, index) => (
                  <div key={index}>
                    <div className="rounded p-2 d-inline-block text-break">{file.name}</div>
                    <Button variant="danger" size="sm" onClick={() => {
                      setFileArray(fileArray.filter((f) => f.name !== file.name));
                    }}>
                      <FontAwesomeIcon icon="fa-solid fa-trash" />
                    </Button>
                  </div>
                ))}  

                <div className="text-muted mb-3">
                    Please allow for a 24 hour response time. <br/>
                </div>
                {successMessage && <div className="text-success">{successMessage}</div>}
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card className="card-maintenance">
          <Card.Body>
            <Card.Title>Previous Requests</Card.Title>
              <hr className="text-muted" />
              <div className="history">

                {maintenanceRequests && [...maintenanceRequests].reverse().map((data, index) => (
                  <div key={index}>
                    <div className="d-flex justify-content-between pe-2 pb-2">
                      <div className="fw-bold">
                        {data.issue.issue} Issue {data.issue.otherMessage && <>- {data.issue.otherMessage}</>}
                      </div>
                      <div>
                        {data.status.open ? <Badge bg="danger">Open</Badge> : <Badge bg="success">Closed</Badge>}
                      </div>
                    </div>
                    <div className="text-muted border me-2 mb-2 bg-light">{data.message}</div>
                    <div className="created-at pb-2">Maintenance request created on <strong>{data.date.day}</strong> at <strong>{data.date.time}</strong></div>
                    <div className="text-muted maintenance-id">Maintenance ID: {data._id}</div>
                    <hr/>
                  </div>
                ))}
                          
              </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
  )
}

export default ContactUs