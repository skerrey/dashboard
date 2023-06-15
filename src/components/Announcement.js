// Description: Announcement component

import React from 'react';
import { Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Announcement.scss';

function Announcement() {
  return (
    <>
      <Toast className="announcement">
        <Toast.Header>
          <FontAwesomeIcon icon="fa-solid fa-circle-info" className="icon-color" />
          <strong className="me-auto">Bootstrap</strong> 
        </Toast.Header>
        <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
      </Toast>
    </>
  )
}

export default Announcement