import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import HRDashboard from './components/HRDashboard';
import StudentDashboard from './components/StudentDashboard';
import LandingPage from './components/LandingPage';
import api, { authAPI } from './api';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // On mount, check if user session exists in local storage to keep state synced loosely
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.role === 'HR') navigate('/hr');
    else navigate('/student');
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'HR' ? '/hr' : '/student'} /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hr" element={user && user.role === 'HR' ? <HRDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/student" element={user && user.role === 'STUDENT' ? <StudentDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
