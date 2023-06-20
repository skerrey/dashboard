import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore } from '../contexts/FirestoreContext';
import { Row, Col, Card, Tabs, Tab, Form } from 'react-bootstrap';

function AdminUserDetails() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const { userId } = useParams(); // Extract user ID from the route parameters
  const { getUser } = useFirestore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(userId);
        if (userData) {
          setUser(userData);
          setFilteredTransactions(userData.payments.transactions);
        } else {
          console.log(`No user data returned for user id: ${userId}`);
        }
      } catch (error) {
        console.error("Error fetching user data in UserDetail:", error);
      }
    };

    fetchUser();
  }, [userId, getUser]);

  useEffect(() => {
    if(user) {
      setFilteredTransactions(
        user.payments.transactions.filter(transaction =>
          transaction.status.toLowerCase().includes(searchQuery.toLowerCase()) 
          || transaction.paidOn.toLowerCase().includes(searchQuery.toLowerCase())
          || transaction.amount.toString().includes(searchQuery.toLowerCase())

        )
      );
    }
  }, [searchQuery, user]);


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
                <Form className="d-flex mb-2">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </Form>
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Paid On</th>
                      <th>Card</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                    {filteredTransactions.map((transaction, index) => (
                      <tr key={index}>
                        <td>{transaction.paidOn}</td>
                        <td>
                          {transaction.paymentMethodId ? (
                            <span className="text-success">**** **** **** {transaction.last4}</span>
                          ) : (
                            <span className="text-danger">N/A</span>
                          )}
                        </td>
                        <td>${transaction.amount}</td>
                        <td>{transaction.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Tab>
              <Tab eventKey="maintenance" title="Maintenance Requests">
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Paid On</th>
                      <th>Card</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                    {filteredTransactions.map((transaction, index) => (
                      <tr key={index}>
                        <td>{transaction.paidOn}</td>
                        <td>
                          {transaction.paymentMethodId ? (
                            <span className="text-success">**** **** **** {transaction.last4}</span>
                          ) : (
                            <span className="text-danger">N/A</span>
                          )}
                        </td>
                        <td>${transaction.amount}</td>
                        <td>{transaction.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
