import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BalanceTracker from './components/BalanceTracker';

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Balance Tracker</h1>
        <Routes>
          <Route path="/" element={<BalanceTracker />} />
          <Route path="/:balanceId" element={<BalanceTracker />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
