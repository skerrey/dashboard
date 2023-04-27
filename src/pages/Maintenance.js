// Description: Maintenance page

import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import "./Maintenance.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { db, storage } from '../firebase.config';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { doc, updateDoc, arrayUnion, getDoc  } from 'firebase/firestore';
import { uploadBytesResumable, ref } from 'firebase/storage';

function ContactUs() {
  const { currentUser } = useAuth();
  const fileInputRef = useRef();

  const [message, setMessage] = useState("");
  const [issue, setIssue] = useState("");
  const [other, setOther] = useState(false);
  const [otherMessage, setOtherMessage] = useState("");
  const [file, setFile] = useState("");
  const [fileArray, setFileArray] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  
  const userId = currentUser.uid; 
  const maintenanceId = uuidv4();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userRef = doc(db, "users", userId);

    if (issue === "other") {
      setOther(true);
    }

    const upload = () => {
      fileArray.forEach((file) => {
        const storageRef = ref(storage, `/${userId}maintenance/${maintenanceId}/maintenance-images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            setFile("");
          },
          (error) => {
            console.log(error);
          },
          () => {
            console.log('Upload is complete');
          }
        );
      })
    };


    try {
      const currentDate = new Date();
      const formattedDateDay = currentDate.toLocaleString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric',
      });
      const formattedDateHour = currentDate.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });

      await updateDoc(userRef, {
        maintenanceRequests: arrayUnion(
          {
            _id: maintenanceId,
            date: {
              day: formattedDateDay,
              time: formattedDateHour
            },
            hasFiles: file ? true : false,
            issue: { 
              issue, 
              otherMessage
            },
            message: message,
            open: true
          }
        )
      }, { merge: true });
      upload();
      setSuccessMessage('Your message has been sent!');

      // Reset form fields
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
    const fetchMaintenanceRequests = async () => {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setMaintenanceRequests(userDoc.data().maintenanceRequests);
      }
    };
    fetchMaintenanceRequests();
  }, [message, userId]);

  // Iterates through files
  useEffect(() => {
    if (file) {
      setFileArray((prevFileArray) => [...prevFileArray, file]);
    }
  }, [file]);

  // Use to show images instead of file names
    // useEffect(() => {
    //   if (file) {
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //       setFileArray((fileArray) => [...fileArray, reader.result]);
    //     };
    //     reader.readAsDataURL(file);
    //   }
    // }, [file]);

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
                    <div className="rounded p-2 d-inline-block">{file.name}</div>
                    <Button variant="danger" size="sm" onClick={() => {
                      setFileArray(fileArray.filter((f) => f.name !== file.name));
                    }}>
                      <FontAwesomeIcon icon="fa-solid fa-trash" />
                    </Button>
                  </div>
                ))}  

                {/* Show Images instead of file name */}
                  {/* {fileArray && fileArray.map((file, index) => (
                    <div key={index}>
                      <img src={file} alt="" style={{width: "100px"}} />
                    </div>
                  ))} */}

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
              <div className="requests">
                {maintenanceRequests && [...maintenanceRequests].reverse().map((data) => (
                  <div key={data._id}>

                    <div className="p-1 fw-bold">
                      {data.issue.issue} Issue {data.issue.otherMessage && <>- {data.issue.otherMessage}</>}
                    </div>
                    <div className="text-muted">{data.issue.issue}</div>
                    <div className="text-muted">{data.issue.otherMessage}</div>
                    <div className="text-muted">{data.message}</div>
                    <div className="text-muted">{data.open.toString()}</div>
                    <div className="created-at">Maintenance request was created on <strong>{data.date.day}</strong> at <strong>{data.date.time}</strong></div>
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