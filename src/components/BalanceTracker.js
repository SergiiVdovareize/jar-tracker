import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BalanceInput from './BalanceInput';
import ChangesList from './ChangesList';
import { fetchBalanceChanges } from '../services/balanceService';

const FETCH_INTERVAL = 60;
const FETCH_INTERVAL_MS = FETCH_INTERVAL * 1000;

function BalanceTracker() {
  const { balanceId: urlBalanceId } = useParams();
  const navigate = useNavigate();
  const [balanceId, setBalanceId] = useState(urlBalanceId || '');
  const [changes, setChanges] = useState([]);

  const handleFetchChanges = useCallback(async () => {
    try {
      const data = await fetchBalanceChanges(balanceId);
      setChanges(data);
    } catch (error) {
      console.error('Failed to fetch balance changes:', error);
    }
  }, [balanceId]);

  useEffect(() => {
    let interval;
    let countdownTimer;

    if (balanceId) {
      handleFetchChanges();
      interval = setInterval(() => {
        handleFetchChanges();
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
  }, [balanceId, handleFetchChanges]);

  const handleStartTracking = (input) => {
    let id = input;
    const urlPattern = /(https:\/\/)?send\.monobank\.ua\/jar\/([a-zA-Z0-9]+)/;
    const match = input.match(urlPattern);

    if (match) {
      id = match[2];
    }

    setBalanceId(id);
    navigate(`/${id}`);
  };

  return (
    <div className="space-y-4">
      <BalanceInput 
        onSubmit={handleStartTracking} 
        initialValue={urlBalanceId || ''}
      />
      <ChangesList changes={changes.incoming} />
    </div>
  );
}

export default BalanceTracker; 