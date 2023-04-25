// Description: Maintenance page

import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Maintenance() {
  return (
    <div>
      <div className="page-title">
        Maintenance <FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" size="xs" />
      </div>
    </div>
  )
}

export default Maintenance