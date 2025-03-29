import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BalanceTracker from './components/BalanceTracker';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Balance Tracker</h1>
          <Routes>
            <Route path="/" element={<BalanceTracker />} />
            <Route path="/:balanceId" element={<BalanceTracker />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
