// Description: Progress bar for account profile

import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../contexts/FirestoreContext';

import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import Confetti from 'react-confetti';

function AccountProfileProgress() {
  const { userId, currentUser, reloadUserEmail } = useAuth();
  const { userData, updateEmailVerificationStatus } = useFirestore();

  const cardBodyRef = useRef(null);

  const [userPhone, setUserPhone] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiWidth, setConfettiWidth] = useState(0);
  const [confettiHeight, setConfettiHeight] = useState(0);

  const userCreatedAt = currentUser.metadata.creationTime;
  
  // Watch user phone value from Firestore
  useEffect(() => {
    if (userData) {
      setUserPhone(userData.phone);
    }
  }, [userData]);

  // Calculate and set the width and height of the confetti based on Card.Body dimensions
  useEffect(() => {
    const updateConfettiDimensions = () => {
      if (cardBodyRef.current) {
        const { width, height } = cardBodyRef.current.getBoundingClientRect();
        setConfettiWidth(width);
        setConfettiHeight(height);
      }
    };

    // Call the updateConfettiDimensions function on component mount
    updateConfettiDimensions();

    // Add event listener for window resize
    window.addEventListener('resize', updateConfettiDimensions);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateConfettiDimensions);
    };
  }, []);

  // Calculate percentage of profile completion (includes confetti!)
  function calculatePercentage() {
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

  // Watch for changes to display confetti (only once)
  useEffect(() => {
    if (userPhone && currentUser.emailVerified) {
      const confettiShown = localStorage.getItem('confettiShown');

      if (!confettiShown) {
        localStorage.setItem('confettiShown', 'true');
        setShowConfetti(true); // yay!

        setTimeout(() => {
          setShowConfetti(false);
        }, 4500);
      }
    }
  }, [userPhone, currentUser.emailVerified]);


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

  // Check email verification status
  async function checkEmailVerification() {
    try {
      console.log("user reloaded");
      setSpinner(true);
      setTimeout(() => {
        setSpinner(false);
      }, 400);
      await reloadUserEmail();
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
        <Card.Body ref={cardBodyRef}>
          <Confetti 
            width={confettiWidth} 
            height={confettiHeight} 
            numberOfPieces={showConfetti ? 200 : 0}
           />
          <Card.Title>Account Setup</Card.Title>
          <Row>
            <Col align="center">
              <div className="cpb-parent">
                <CircularProgressbarWithChildren value={calculatePercentage()}>
                  <div>{calculatePercentage()}%</div>
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
                  userData && userPhone != null ?
                  <>
                    <div>Phone Added</div>
                    <div>recently</div>
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
                {
                  currentUser && currentUser.emailVerified ?
                  <>
                    <div>Email Verified</div>
                    <div>recently</div>
                  </>
                  :
                  currentUser && !currentUser.emailVerified && userData && userData.emailVerification && userData.emailVerification === "sent" ?
                  <>
                    <div>
                      Email Not Verified 
                      &nbsp; {spinner && <Spinner animation="border" variant="primary" size="sm" />}
                    </div>
                    <Button variant="link" className="p-0" onClick={checkEmailVerification}>
                      Check Verification Status
                    </Button>
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