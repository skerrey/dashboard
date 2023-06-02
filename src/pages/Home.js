// Description: Home page

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFirestore } from '../contexts/FirestoreContext';
import { NavLink } from 'react-router-dom';

function Main() {
  const { userData } = useFirestore();
  const [user, setUser] = useState();

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  return (
    <div>
      <div className="page-title">
        Home <FontAwesomeIcon icon="fa-solid fa-house" size="xs" />
      </div>
      <Row xs={1} sm={1} md={1} lg={2}>
        <Col>
          <Card className="card-payments">
            <Card.Body>
              <Card.Title>Payments</Card.Title>
              <hr className="text-muted mb-1" />
              <Row className="align-items-end justify-content-between">
                <Col className="col-auto">
                  <p>Current Balance:</p>
                  <div className="h5 mb-0">
                    {
                      user && user.payments.balance 
                        ?
                        <div>${user.payments.balance.toFixed(2)}</div>
                        :
                        <div>$1000.00</div>
                    }
                  </div>
                </Col>
                <Col className="col-auto">
                  <p>Due Date:</p>
                  <div className="text-danger">1/1/2025</div>
                </Col>
                <Col className="col-auto">
                  <Button variant="success">
                    <NavLink to="/payments" className="nav-link">
                      Pay Rent
                    </NavLink>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="card-maintenance">
            <Card.Body>
              <Card.Title>Maintenance</Card.Title>
              <hr className="text-muted mb-1" />
              <Row className="align-items-end justify-content-between">
                <Col className="col-auto">
                  <p className="fst-italic text-muted">
                    Have an issue with your apartment?
                  </p>
                  <div className="h5 mb-0">
                    Create a maintenance request
                  </div>
                </Col>
                <Col className="col-auto">
                  <Button variant="warning">
                    <NavLink to="/maintenance" className="nav-link">
                      Maintenance
                    </NavLink>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row xs={1} sm={1} md={1} lg={2}>
        <Col>
          <Card className="card-account">
            <Card.Body>
              <Card.Title>Account Profile</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
        <Card className="card-settings">
            <Card.Body>
              <Card.Title>Settings</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </div>
  )
}

export default Main