// Description: Announcement component

import React, { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Announcement.scss';

function Announcement({ header, body }) {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  return (
    <ToastContainer className="announcement mt-3" position="top-center">
      <Toast show={show} onClose={handleClose}>
        <Toast.Header>
          <FontAwesomeIcon icon="fa-solid fa-circle-info" className="icon-color" />
          &nbsp;<strong className="me-auto">{header}</strong> 
        </Toast.Header>
        <Toast.Body dangerouslySetInnerHTML={{ __html: body }}>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default Announcement