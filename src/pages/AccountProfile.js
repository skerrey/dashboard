// Description: Account Profile page

import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { httpsCallable } from "firebase/functions";
import { functions } from '../firebase.config';

function AccountProfile() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    const getUsers = httpsCallable(functions, 'getUsers');
    getUsers()
      .then((result) => {
        console.log(result.data);
        setUsers(result.data);
      })
      .catch((error) => {
        console.error(error);
        console.log("whoops");
      });
  };

  useEffect(() => {
    console.log("fetching users...");
    fetchUsers();
  }, []);

  console.log(users);

  return (
    <div>
      <div className="page-title">
        Account Profile <FontAwesomeIcon icon="fa-solid fa-user" size="xs" />
      </div>
      <div>
      {users.length > 0 ? (
        <ul>
        {users.map((user) => (
          <li key={user.uid}>{user.email}</li>
        ))}
        </ul>
      ) : (
        <li>No users</li>
      )}
      </div>
    </div>
  )
}

export default AccountProfile