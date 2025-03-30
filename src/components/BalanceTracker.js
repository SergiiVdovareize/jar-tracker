import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BalanceInput from './BalanceInput';
import ChangesList from './ChangesList';
import styles from './BalanceTracker.module.css';
import { fetchBalanceChanges } from '../services/balanceService';

const FETCH_INTERVAL = 60;
const FETCH_INTERVAL_MS = FETCH_INTERVAL * 1000;

function BalanceTracker() {
  const { balanceId: urlBalanceId } = useParams();
  const navigate = useNavigate();
  const [balanceId, setBalanceId] = useState(urlBalanceId || '');
  const [changes, setChanges] = useState([]);
  const [isTabActive, setIsTabActive] = useState(true);

  const handleFetchChanges = useCallback(async () => {
    try {
      setChanges({});
      const data = await fetchBalanceChanges(balanceId);
      setChanges(data);
    } catch (error) {
      console.error('Failed to fetch balance changes:', error);
    }
  }, [balanceId]);

  useEffect(() => {
    let interval;

    if (balanceId && isTabActive) {
      handleFetchChanges();
      interval = setInterval(() => {
        handleFetchChanges();
      }, FETCH_INTERVAL_MS);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [balanceId, handleFetchChanges, isTabActive]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleStartTracking = input => {
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
      {changes?.jar?.ownerName ? (
        <h2 className={styles['title']}>
          <span className={styles['owner-name']}>{changes?.jar?.ownerName}</span>
          <span className={styles['jar-title']}>{changes?.jar?.title}</span>
        </h2>
      ) : (
        <h2 className={styles['title']}>Трекер банки</h2>
      )}
      <BalanceInput onSubmit={handleStartTracking} initialValue={urlBalanceId || ''} />
      <ChangesList changes={changes.incoming} />
    </div>
  );
}

export default BalanceTracker;
