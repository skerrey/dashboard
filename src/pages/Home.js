// Description: Home page

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
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
              <hr className="text-muted my-1" />
              <Row className="align-items-end justify-content-between">
                <Col className="col-auto">
                  <p>Current Balance:</p>
                  <div className="h5 mb-0">
                    {
                      user && user.payments && user.payments.balance 
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
                      Pay Rent &nbsp;<FontAwesomeIcon icon="fa-solid fa-credit-card" />
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
              <hr className="text-muted my-1" />
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
                      Maintenance &nbsp;<FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" />
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
              <hr className="text-muted my-1" />
              {user && !user.address 
                ?
                <div className="fw-bold p-2 mt-3 border bg-light bg-gradient rounded-1">
                  Please add your current address to your&nbsp;
                  <NavLink to="/account-profile">account profile</NavLink>.
                </div>
                :
                null
              }
              <Row className="align-items-end justify-content-between">
                <Col className="col-auto">
                  <p className="fst-italic text-muted">
                    View & edit name, address, and more.
                  </p>
                  <div className="h5 mb-0">
                    Edit Account Profile
                  </div>
                </Col>
                <Col className="col-auto">
                  <Button variant="primary">
                    <NavLink to="/account-profile" className="nav-link">
                      Account &nbsp;<FontAwesomeIcon icon="fa-solid fa-user" />
                    </NavLink>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="card-settings">
            <Card.Body>
              <Card.Title>Settings</Card.Title>
              <hr className="text-muted my-1" />
              <Row className="align-items-end justify-content-between">
                <Col className="col-auto">
                  <p className="fst-italic text-muted">
                    Change password and delete account.
                  </p>
                  <div className="h5 mb-0">
                    Edit Account Profile
                  </div>
                </Col>
                <Col className="col-auto">
                  <Button variant="primary">
                    <NavLink to="/settings" className="nav-link">
                      Settings &nbsp;<FontAwesomeIcon icon="fa-solid fa-gear" />
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
          <Card className="card-contact">
            <Card.Body>
              <Card.Title>Contact Us</Card.Title>
              <hr className="text-muted my-1" />
              <Row className="align-items-end justify-content-between">
                <Col className="col-auto">
                  <p className="fst-italic text-muted">
                    Have a question?
                  </p>
                  <div className="h5 mb-0">
                    Get in touch with us
                  </div>
                </Col>
                <Col className="col-auto">
                  <Button variant="primary">
                    <NavLink to="/contact-us" className="nav-link">
                      Contact &nbsp;<FontAwesomeIcon icon="fa-solid fa-circle-info" />
                    </NavLink>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Main