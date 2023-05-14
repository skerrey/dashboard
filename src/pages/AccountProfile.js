// Description: Account Profile page

import React from 'react';
import { Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./AccountProfile.scss";

import AccountProfileProgress from '../components/AccountProfileProgress';
import AccountProfileUserDetails from '../components/AccountProfileUserDetails';
import AccountProfilePasswordForm from '../components/AccountProfilePasswordForm';

function AccountProfile() {
  return (
    <div className="account-profile">
      <div className="page-title">
        Account Profile <FontAwesomeIcon icon="fa-solid fa-user" size="xs" />
      </div>
      <Row>
        <AccountProfileProgress />
      </Row>
      <Row xs={1} sm={1} md={1} lg={2}>
        <AccountProfileUserDetails />
        <AccountProfilePasswordForm />
      </Row>
    </div>
  )
}

export default AccountProfile