import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BalanceInput from './BalanceInput';
import ChangesList from './ChangesList';
import { fetchBalanceChanges } from '../services/balanceService';

const FETCH_INTERVAL = 12;
const FETCH_INTERVAL_MS = 12 * 1000;

function BalanceTracker() {
  const { balanceId: urlBalanceId } = useParams();
  const navigate = useNavigate();
  const [balanceId, setBalanceId] = useState(urlBalanceId || '');
  const [changes, setChanges] = useState([]);
  const [isTracking, setIsTracking] = useState(!!urlBalanceId);
  const [countdown, setCountdown] = useState(FETCH_INTERVAL);

  const handleFetchChanges = useCallback(async () => {
    try {
      const data = await fetchBalanceChanges(balanceId);
      setChanges(data);
      
      setCountdown(FETCH_INTERVAL); // Reset countdown after successful fetch
    } catch (error) {
      console.error('Failed to fetch balance changes:', error);
    }
  }, [balanceId]);

  useEffect(() => {
    let interval;
    let countdownTimer;

    if (isTracking && balanceId) {
      handleFetchChanges();
      interval = setInterval(() => {
        handleFetchChanges();
      }, FETCH_INTERVAL_MS);

      // Start countdown
      countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            return FETCH_INTERVAL;
          }
          return prev - 1;
        });
      }, FETCH_INTERVAL_MS);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
    };
  }, [isTracking, balanceId, handleFetchChanges]);

  const handleStartTracking = (id) => {
    setBalanceId(id);
    setIsTracking(true);
    navigate(`/${id}`);
  };

  if (!changes?.incoming) return null;

  return (
    <div className="space-y-4">
      <BalanceInput 
        onSubmit={handleStartTracking} 
        isTracking={isTracking}
        initialValue={urlBalanceId || ''}
        // countdown={countdown}
      />
      <ChangesList changes={changes.incoming} />
    </div>
  );
}

export default BalanceTracker; 