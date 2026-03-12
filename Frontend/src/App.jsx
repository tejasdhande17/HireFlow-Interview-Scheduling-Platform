import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import HRDashboard from './components/HRDashboard';
import StudentDashboard from './components/StudentDashboard';
import LandingPage from './components/LandingPage';
import { authAPI } from './api';

function App() {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  // LOGIN
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    if (userData.role === "HR") {
      navigate("/hr");
    } else {
      navigate("/student");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  // PRIVATE ROUTE COMPONENT
  const PrivateRoute = ({ children, role }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <Routes>

      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Login */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={user.role === "HR" ? "/hr" : "/student"} />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      {/* Register */}
      <Route path="/register" element={<Register />} />

      {/* HR Dashboard Protected */}
      <Route
        path="/hr"
        element={
          <PrivateRoute role="HR">
            <HRDashboard onLogout={handleLogout} />
          </PrivateRoute>
        }
      />

      {/* Student Dashboard Protected */}
      <Route
        path="/student"
        element={
          <PrivateRoute role="STUDENT">
            <StudentDashboard onLogout={handleLogout} />
          </PrivateRoute>
        }
      />

    </Routes>
  );
}

export default App;