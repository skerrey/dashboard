import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore } from '../contexts/FirestoreContext';
import { Row, Col, Card, Tabs, Tab } from 'react-bootstrap';

function AdminUserDetails() {
  const [user, setUser] = useState(null);
  const { userId } = useParams(); // Extract user ID from the route parameters
  const { getUser } = useFirestore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(userId);
        if (userData) {
          setUser(userData);
        } else {
          console.log(`No user data returned for user id: ${userId}`);
        }
      } catch (error) {
        console.error("Error fetching user data in UserDetail:", error);
      }
    };

    fetchUser();
  }, [userId, getUser]);


  if (!user) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <Row>
        <Col>
        <Card className="card-admin-users">
          <Card.Body>
            <div className="pb-2">
              <div className="text-primary fw-bold mb-2">User</div>
              <div className="h3 fw-bold">{user.name.firstName} {user.name.lastName}</div>
              <div className="h6">{user.email}</div>
            </div>
            <Tabs
              defaultActiveKey="overview"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="overview" title="Overview">
                <table className="table">
                  <tbody>
                    <tr>
                      <td>Balance</td>
                      <td>${user.balance}</td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td>{user.phone ? user.phone : "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Address</td>
                      <td>{user.address.address ? user.address.address + " " + user.address.address2 : "N/A"}</td>
                    </tr>
                    <tr>
                      <td>City</td>
                      <td>{user.address.city ? user.address.city : "N/A"}</td>
                    </tr>
                    <tr>
                      <td>State</td>
                      <td>{user.address.state ? user.address.state : "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Zip</td>
                      <td>{user.address.zip ? user.address.zip : "N/A"}</td>
                    </tr>
                  </tbody>
                </table>
              </Tab>
              <Tab eventKey="payments" title="Payments">
                <table>
                  <tbody>
                    <tr>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </Tab>
              <Tab eventKey="maintenance" title="Maintenance Requests">
                Tab content for Contact
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminUserDetails;
