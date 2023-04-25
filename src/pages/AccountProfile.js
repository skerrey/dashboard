// Description: Account Profile page

import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function AccountProfile() {
  return (
    <div>
      <div className="page-title">
        Account Profile <FontAwesomeIcon icon="fa-solid fa-user" size="xs" />
      </div>
    </div>
  )
}

export default AccountProfile