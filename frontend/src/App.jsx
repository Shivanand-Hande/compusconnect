import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clubs from './pages/Clubs';
import Events from './pages/Events';
import Announcements from './pages/Announcements';
import AttendanceScanner from './pages/AttendanceScanner';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import ClubManagement from './pages/ClubManagement';
import Notifications from './pages/Notifications';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/app/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="clubs" element={<Clubs />} />
              <Route path="events" element={<Events />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="scan" element={<AttendanceScanner />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin" element={<AdminPanel />} />
              <Route path="my-club" element={<ClubManagement />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
