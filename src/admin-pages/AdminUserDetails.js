import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore } from '../contexts/FirestoreContext';

function AdminUserDetails() {
  const [user, setUser] = useState(null);
  const { userId } = useParams(); // Extract user ID from the route parameters
  const { getUser } = useFirestore();

  useEffect(() => {
    console.log(userId);
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
      <p>Email: {user.email}</p>
    </div>
  );
}

export default AdminUserDetails;
