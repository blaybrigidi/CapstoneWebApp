import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientDetail from './components/PatientDetail';

import Settings from './components/Settings';
import AlertsManagement from './components/AlertsManagement';
import Analytics from './components/Analytics';
import './styles/variables.css';

function App() {
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
}

export default App;
