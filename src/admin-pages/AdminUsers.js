// Description: Account Profile page

import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { httpsCallable } from "firebase/functions";
import { functions } from '../firebase.config';

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    const getUsers = httpsCallable(functions, 'getUsers');
    getUsers()
      .then((result) => {
        console.log(result.data);
        setUsers(result.data);
      })
      .catch((error) => {
        console.log("whoops something went wrong");
        console.error(error);
      });
  };

  useEffect(() => {
    console.log("fetching users...");
    fetchUsers();
  }, []);

  return (
    <div>
      
      <div className="page-title">
        Users <FontAwesomeIcon icon="fa-solid fa-user" size="xs" />
      </div>
      <Row>
        <Col>
        <Card className="card-account">
          <Card.Body>
            <Card.Title>Maintenance Requests</Card.Title>
            <div>
            {users.length > 0 ? (
              <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>UID</th>
                      <th>Email</th>
                      <th>Display Name</th>
                      <th>Email Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.uid}>
                        <td>{user.uid}</td>
                        <td>{user.email}</td>
                        <td>{user.displayName}</td>
                        <td>{user.emailVerified.toString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            ) : (
              <li>No users</li>
            )}
            </div>
          </Card.Body>
        </Card>
        </Col>
      </Row>

    </div>
  )
}

export default AdminUsers