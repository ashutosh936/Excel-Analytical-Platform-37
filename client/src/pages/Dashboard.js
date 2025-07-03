import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/user/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChartDisplay from '../components/ChartDisplay';
import ThreeDChart from '../components/ThreeDChart';
import { exportChartAsPDF } from '../utils/pdfExport';

const chartTypes = [
  { value: 'bar', label: 'Bar (2D)' },
  { value: 'line', label: 'Line (2D)' },
  { value: 'pie', label: 'Pie (2D)' },
  { value: 'scatter', label: 'Scatter (2D)' },
  { value: '3dcolumn', label: 'Column (3D)' },
];

const Dashboard = () => {
  const token = useSelector(state => state.user.token) || localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [aiSummary, setAiSummary] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chartRef = useRef();

  useEffect(() => {
    if (!token) return navigate('/login');
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user/me', {
          headers: { 'x-auth-token': token },
        });
        setUser(res.data);
      } catch (err) {
        dispatch(logout());
        navigate('/login');
      }
    };
    fetchUser();
  }, [token, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleUploadSelect = (upload) => {
    setSelectedUpload(upload);
    setData(upload.data || []);
    if (upload.data && upload.data.length > 0) {
      const keys = Object.keys(upload.data[0]);
      setColumns(keys);
      setXKey(keys[0]);
      setYKey(keys[1] || keys[0]);
    } else {
      setColumns([]);
      setXKey('');
      setYKey('');
    }
  };

  const handleDownload = () => {
    if (chartType === '3dcolumn') {
      alert('Download for 3D charts is not supported yet.');
      return;
    }
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = 'chart.png';
      link.click();
    }
  };

  const handleDownloadPDF = () => {
    if (chartType === '3dcolumn') {
      alert('PDF download for 3D charts is not supported yet.');
      return;
    }
    const canvas = document.querySelector('canvas');
    if (canvas) {
      exportChartAsPDF(canvas);
    }
  };

  const handleGetAiInsights = async () => {
    setLoadingAi(true);
    setShowAiModal(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/summary', { data }, {
        headers: { 'x-auth-token': token },
      });
      setAiSummary(res.data.summary);
    } catch (err) {
      setAiSummary('Failed to get AI insights.');
    }
    setLoadingAi(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
      {user && (
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-2">Welcome, {user.name}</h2>
          <p className="mb-2">Email: {user.email}</p>
          <p className="mb-2">Role: {user.role}</p>
        </div>
      )}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload History</h2>
        <button onClick={() => navigate('/upload')} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">Upload New Excel</button>
        <ul>
          {user && user.uploads && user.uploads.length > 0 ? (
            user.uploads.map(upload => (
              <li key={upload._id} className={`mb-2 border-b pb-2 cursor-pointer ${selectedUpload && selectedUpload._id === upload._id ? 'bg-blue-100' : ''}`}
                  onClick={() => handleUploadSelect(upload)}>
                <span className="font-semibold">{upload.originalname}</span> - Uploaded on {new Date(upload.uploadDate).toLocaleString()}
              </li>
            ))
          ) : (
            <li>No uploads yet.</li>
          )}
        </ul>
      </div>
      {selectedUpload && columns.length > 0 && (
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Chart Visualization</h2>
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block mb-1">X Axis</label>
              <select value={xKey} onChange={e => setXKey(e.target.value)} className="border rounded px-2 py-1">
                {columns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1">Y Axis</label>
              <select value={yKey} onChange={e => setYKey(e.target.value)} className="border rounded px-2 py-1">
                {columns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1">Chart Type</label>
              <select value={chartType} onChange={e => setChartType(e.target.value)} className="border rounded px-2 py-1">
                {chartTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={handleDownload} className="ml-4 bg-green-600 text-white px-4 py-2 rounded">Download PNG</button>
              {chartType !== '3dcolumn' && (
                <button onClick={handleDownloadPDF} className="ml-2 bg-purple-600 text-white px-4 py-2 rounded">Download PDF</button>
              )}
              <button onClick={handleGetAiInsights} className="ml-2 bg-pink-600 text-white px-4 py-2 rounded">AI Insights</button>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            {chartType === '3dcolumn' ? (
              <ThreeDChart data={data} xKey={xKey} yKey={yKey} />
            ) : (
              <ChartDisplay data={data} xKey={xKey} yKey={yKey} type={chartType} />
            )}
          </div>
        </div>
      )}
      {showAiModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button onClick={() => setShowAiModal(false)} className="absolute top-2 right-2 text-gray-500">&times;</button>
            <h3 className="text-lg font-bold mb-2">AI Insights</h3>
            {loadingAi ? <div>Loading...</div> : <div>{aiSummary}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 