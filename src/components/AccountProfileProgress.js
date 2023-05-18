// Description: Progress bar for account profile

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function AccountProfileProgress() {
  const { userId, currentUser, reloadUser } = useAuth();
  const { userData, updateEmailVerificationStatus } = useFirestore();

  const [userPhone, setUserPhone] = useState(null);
  // const [userEmailVerified, setUserEmailVerified] = useState(currentUser.emailVerified);

  const userCreatedAt = currentUser.metadata.creationTime;
  
  // Watch user phone value from Firestore
  useEffect(() => {
    if (userData) {
      setUserPhone(userData.phone);
    }
  }, [userData]);

  // Calculate percentage of profile completion
  function checkPercentage() {
    let percentage = 33;
    if (userPhone) {
      percentage += 33;
    }
    if (currentUser.emailVerified) {
      percentage += 33;
    }
    if (percentage === 99) {
      percentage = 100;
    }
    return percentage;
  }

  // Get time difference between now and creation time
  function getTimeDifference(createdAt) {
    const creationDate = new Date(createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1); // Get yesterday's date
    const diffInMs = today - creationDate;
  
    if (diffInMs < 1000 * 60 * 60 * 24 && creationDate.getDate() < today.getDate()) {
      return "yesterday";
    }
  
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

  async function checkEmailVerification() {
    try {
      console.log("user reloaded");
      await reloadUser();
      await currentUser;
    } catch (error) {
      console.log(error);
    } finally {
      if (currentUser.emailVerified === true) {
        updateEmailVerificationStatus(userId);
      }
    }
  }
  

  return (
    <Col className="col">
      <Card className="card-account ap-progress">
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
                    <div>Recently</div>
                  </>
                  :
                  <div>Phone Not Added</div>
                }
              </div>
            </Col>
            <Col className="icon-col">
              <div className={currentUser.emailVerified ? "icon-circle-activated" : "icon-circle-not-activated"}>
                <FontAwesomeIcon icon="fa-solid fa-user-plus" />
              </div>
              <div className="text-muted text-start ps-2">
                {/* {
                  userEmailVerified === true ?
                  <>
                    <div>Email Verified</div>
                    <div>Recently</div>
                  </>
                  :
                  <div>Email Not Verified</div>
                } */}
                {
                  currentUser.emailVerified ?
                  <>
                    <div>Email Verified</div>
                    <div>Recently</div>
                  </>
                  :
                  !currentUser.emailVerified ?
                  <>
                    <div>Email Not Verified</div>
                    <Button onClick={checkEmailVerification}>Check Verification Status</Button>
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