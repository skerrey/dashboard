// Description: Settings page

import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Settings() {
  return (
    <div>
      <div className="page-title">
        Settings <FontAwesomeIcon icon="fa-solid fa-gear" size="xs" />
      </div>
    </div>
  )
}

export default Settings