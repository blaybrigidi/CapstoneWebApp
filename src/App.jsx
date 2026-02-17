import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import { AuthPage } from './components/ui/auth-page';
import { RegisterPage } from './components/ui/register-page';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientDetail from './components/PatientDetail';
import Settings from './components/Settings';
import AlertsManagement from './components/AlertsManagement';
import Analytics from './components/Analytics';
import './styles/variables.css';

// Main App Layout (Authenticated)
const MainApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [viewParams, setViewParams] = useState({});

  const handleNavigate = (view, patientId = null, params = {}) => {
    setCurrentView(view);
    if (patientId) setSelectedPatientId(patientId);
    setViewParams(params);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onNavigate={handleNavigate} currentView={currentView} />
      <AnimatePresence mode="wait">
        {currentView === 'dashboard' ? (
          <Dashboard key="dashboard" onNavigate={handleNavigate} />
        ) : currentView === 'settings' ? (
          <Settings key="settings" />
        ) : currentView === 'alerts' ? (
          <AlertsManagement key="alerts" {...viewParams} />
        ) : currentView === 'analytics' ? (
          <Analytics key="analytics" />
        ) : (
          <PatientDetail
            key="patient-detail"
            onNavigate={handleNavigate}
            patientId={selectedPatientId}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <RequireAuth>
                <MainApp />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

