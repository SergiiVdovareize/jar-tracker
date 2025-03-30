import React, { useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import BalanceTracker from './components/BalanceTracker';
import styles from './App.module.css';

function NavigationTracker() {
  // const location = useLocation();
  // const prevLocationRef = useRef(location);

  // useEffect(() => {
  //   const prevLocation = prevLocationRef.current;
  //   const currentIndex = window.history.state?.idx || 0;
  //   const prevIndex = prevLocation.state?.idx || 0;

  //   const direction = currentIndex > prevIndex ? 'forward' : 'back';

  //   console.log('Navigation occurred:', {
  //     pathname: location.pathname,
  //     hash: location.hash,
  //     timestamp: new Date().toISOString(),
  //     direction,
  //     from: prevLocation.pathname,
  //     to: location.pathname
  //   });

  //   prevLocationRef.current = location;
  // }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <NavigationTracker />
      <div className={styles['main-container']}>
        <div className="max-w-4xl mx-auto">
          <h1 className={styles['title']}>Трекер банки</h1>
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
