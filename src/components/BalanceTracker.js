import React, { useState, useEffect } from 'react';
import BalanceInput from './BalanceInput';
import ChangesList from './ChangesList';

function BalanceTracker() {
  const [balanceId, setBalanceId] = useState('');
  const [changes, setChanges] = useState([]);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    let interval;

    if (isTracking && balanceId) {
      fetchBalanceChanges();
      interval = setInterval(() => {
        fetchBalanceChanges();
      }, 60000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTracking, balanceId]);

  const fetchBalanceChanges = async () => {
    try {
      const response = await fetch(`http://localhost:3000/track/watch/mono/${balanceId}`);
      const data = await response.json();
      setChanges(prevChanges => [...prevChanges, data]);
    } catch (error) {
      console.error('Error fetching balance changes:', error);
    }
  };

  const handleStartTracking = (id) => {
    setBalanceId(id);
    setIsTracking(true);
  };

  return (
    <div className="space-y-4">
      <BalanceInput 
        onSubmit={handleStartTracking} 
        isTracking={isTracking} 
      />
      <ChangesList changes={changes} />
    </div>
  );
}

export default BalanceTracker; 