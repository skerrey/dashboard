import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { httpsCallable } from "firebase/functions";
import { functions } from '../firebase.config';
import { useNavigate } from 'react-router-dom';
import './Admin.scss';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = () => {
    const getUsers = httpsCallable(functions, 'getUsers');
    getUsers()
      .then((result) => {
        console.log(result.data);
        setUsers(result.data);
        setFilteredUsers(result.data);
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


  useEffect(() => {
    setFilteredUsers(
      users.filter(user =>
        (user.email ? user.email.toLowerCase().includes(searchQuery.toLowerCase()) : false)
        || (user.displayName ? user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) : false)
      )
    );
  }, [searchQuery, users]);

  return (
    <div>
      <div className="page-title">
        Users <FontAwesomeIcon icon="fa-solid fa-user" size="xs" />
      </div>
      <Row>
        <Col>
        <Card className="card-admin-users">
          <Card.Body>
            <Card.Title>List of Users</Card.Title>
            <Form className="d-flex mb-2">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </Form>
            <div>
            {filteredUsers.length > 0 ? (
              <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Email Verified</th>
                      <th>Created at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.uid} onClick={() => navigate(`/admin/users/user/${user.uid}`)} className='pointer'>
                        <td>{user.displayName}</td>                        
                        <td>{user.email}</td>
                        <td>{user.emailVerified.toString()}</td>
                        <td>{user.metadata.creationTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            ) : (
              <p className="pt-2 ps-2">No users</p>
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
