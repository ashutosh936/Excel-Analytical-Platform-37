import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const token = useSelector(state => state.user.token) || localStorage.getItem('token');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file');
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('File uploaded successfully!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setError('Upload failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Excel File</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-500">{success}</div>}
        <div className="mb-6">
          <input type="file" accept=".xls,.xlsx" onChange={e => setFile(e.target.files[0])} className="w-full" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Upload</button>
        <div className="mt-4 text-center">
          <a href="/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</a>
        </div>
      </form>
    </div>
  );
};

export default Upload; 