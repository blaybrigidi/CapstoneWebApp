import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import './styles/variables.css';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <Dashboard />
    </div>
  );
}

export default App;
