import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const token = useSelector(state => state.user.token) || localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { 'x-auth-token': token },
        });
        setUsers(res.data);
      } catch (err) {
        alert('Access denied or not admin.');
        navigate('/dashboard');
      }
    };
    fetchUsers();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Users & Uploads</h2>
        <ul>
          {users.map(user => (
            <li key={user._id} className="mb-4 border-b pb-2">
              <div className="font-semibold">{user.name} ({user.email}) - {user.role}</div>
              <ul className="ml-4">
                {user.uploads && user.uploads.length > 0 ? (
                  user.uploads.map(upload => (
                    <li key={upload._id} className="text-sm">
                      {upload.originalname} - Uploaded on {new Date(upload.uploadDate).toLocaleString()}
                    </li>
                  ))
                ) : (
                  <li className="text-sm">No uploads</li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel; 