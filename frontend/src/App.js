import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OAuthCallback from './pages/OAuthCallback';
import PasswordResetRequest from './pages/PasswordResetRequest';
import PasswordResetForm from './pages/PasswordResetForm';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="/password-reset" element={<PasswordResetRequest />} />
            <Route path="/password-reset/:token" element={<PasswordResetForm />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/:username" element={<PublicProfile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
