import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatBox from './Chatbox';

function Dashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please login again.');
          return;
        }

        const response = await axios.get('https://chat-application-backend-9ejl.onrender.com/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Filter out the current user from the list
        
        const filteredUsers = response.data.filter(u => u.email !== user.email);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users. Please try again later.');
      }
    };
    fetchUsers();
  }, [user]);

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
  };

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '20px' ,textlign:'left',}}>
        <h1>Dashboard</h1>
        {user && (
          <div>
            <h2>Welcome, {user.name}</h2>
            <h3>Your email: {user.email}</h3>
          </div>
        )}
        <h2>Online Users</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map((u) => (
            <li 
              key={u._id} 
              onClick={() => handleUserSelect(u)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: selectedUser && selectedUser._id === u._id ? '#e0e0e0' : 'transparent'
              }}
            >
              {u.name} - {u.email}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ width: '70%', padding: '20px' }}>
        {selectedUser ? (
          <ChatBox selectedUser={selectedUser.email} currentUser={user.email} />
        ) : (
          <p>Welcome! Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
