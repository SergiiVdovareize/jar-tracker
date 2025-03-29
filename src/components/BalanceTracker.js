import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BalanceInput from './BalanceInput';
import ChangesList from './ChangesList';
import { fetchBalanceChanges } from '../services/balanceService';

function BalanceTracker() {
  const { balanceId: urlBalanceId } = useParams();
  const navigate = useNavigate();
  const [balanceId, setBalanceId] = useState(urlBalanceId || '');
  const [changes, setChanges] = useState([]);
  const [isTracking, setIsTracking] = useState(!!urlBalanceId);

  const handleFetchChanges = useCallback(async () => {
    console.log('fetching changes', balanceId);
    try {
      const data = await fetchBalanceChanges(balanceId);
      setChanges(data);
    } catch (error) {
      console.error('Failed to fetch balance changes:', error);
    }
  }, [balanceId]);

  useEffect(() => {
    let interval;

    if (isTracking && balanceId) {
      handleFetchChanges();
      interval = setInterval(() => {
        handleFetchChanges();
      }, 60000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTracking, balanceId, handleFetchChanges]);

  const handleStartTracking = (id) => {
    setBalanceId(id);
    setIsTracking(true);
    navigate(`/${id}`);
  };

  return (
    <div className="space-y-4">
      <BalanceInput 
        onSubmit={handleStartTracking} 
        isTracking={isTracking}
        initialValue={urlBalanceId || ''}
      />
      <ChangesList changes={changes?.incoming} />
    </div>
  );
}

export default BalanceTracker; 