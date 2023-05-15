// Description: Progress bar for account profile

import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAuth } from '../contexts/AuthContext';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function AccountProfileProgress() {
  const { currentUser } = useAuth();

  const userEmailVerified = currentUser.emailVerified;
  const userCreatedAt = currentUser.metadata.creationTime;
  const userPhone = currentUser.phoneNumber;

  // Calculate percentage of profile completion
  function checkPercentage() {
    let percentage = 33;
    if (userPhone != null) {
      percentage += 33;
    }
    if (userEmailVerified === true) {
      percentage += 33;
    }
    return percentage;
  }

  // Get time difference between now and creation time
  function getTimeDifference(createdAt) {
    const creationDate = new Date(createdAt);
    const today = new Date();
    const diffInMs = today - creationDate;

    if (diffInMs < 1000 * 60 * 60 * 24) { // less than 24 hours
      return "today";
    }
  
    let diff, unit;
    if (diffInMs < 1000 * 60 * 60 * 24 * 7) { // less than 1 week
      diff = Math.round(diffInMs / (1000 * 60 * 60 * 24));
      unit = 'day';
    } else if (diffInMs < 1000 * 60 * 60 * 24 * 30) { // less than 1 month
      diff = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 7));
      unit = 'week';
    } else if (diffInMs < 1000 * 60 * 60 * 24 * 365) { // less than 1 year
      diff = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 30));
      unit = 'month';
    } else { // more than 1 year
      diff = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 365));
      unit = 'year';
    }
  
    const diffString = diff === 1 ? 'almost one' : `almost ${diff}`;
    const unitString = `${unit}${diff === 1 ? '' : 's'}`;
  
    return `${diffString} ${unitString} ago`;
  }

  return (
    <Col className="col ap-progress">
      <Card className="card-account">
        <Card.Body>
          <Card.Title>Account Setup</Card.Title>
          <Row>
            <Col align="center">
              <div className="cpb-parent">
                <CircularProgressbarWithChildren value={checkPercentage()}>
                  <div>{checkPercentage()}%</div>
                  <div>Complete</div>
                </CircularProgressbarWithChildren>
              </div>
            </Col>
          </Row>
          <Row align="center">
            <Col className="icon-col">
              <div className="icon-circle-activated">
                <FontAwesomeIcon icon="fa-solid fa-user-plus" />
              </div>
              <div className="text-muted text-start ps-2">
                <div>Account Activated</div>
                <div>{getTimeDifference(userCreatedAt)}</div>
              </div>
            </Col>
            <Col className="icon-col">
              <div className={userPhone != null ? "icon-circle-activated" : "icon-circle-not-activated"}>
                <FontAwesomeIcon icon="fa-solid fa-phone" />
              </div>
              <div className="text-muted text-start ps-2">
              {
                  userPhone != null ?
                  <>
                    <div>Phone Added</div>
                    <div></div>
                  </>
                  :
                  <div>Phone Not Added</div>
                }
              </div>
            </Col>
            <Col className="icon-col">
              <div className={userEmailVerified === true ? "icon-circle-activated" : "icon-circle-not-activated"}>
                <FontAwesomeIcon icon="fa-solid fa-user-plus" />
              </div>
              <div className="text-muted text-start ps-2">
                {
                  userEmailVerified === true ?
                  <>
                    <div>Email Verified</div>
                    <div></div>
                  </>
                  :
                  <div>Email Not Verified</div>
                }
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default AccountProfileProgress