// Description: Home page

import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Main() {
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
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
        <Card className="card-maintenance">
            <Card.Body>
              <Card.Title>Maintenance</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
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