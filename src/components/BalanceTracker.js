import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BalanceInput from './BalanceInput';
import ChangesList from './ChangesList';
import styles from './BalanceTracker.module.css';
import { fetchBalanceChanges } from '../services/balanceService';
import { saveToLocalStorage, readFromLocalStorage } from '../utils/localStorageHelper';

const FETCH_INTERVAL = 60;
const FETCH_INTERVAL_MS = FETCH_INTERVAL * 1000;

function BalanceTracker() {
  const { balanceId: urlBalanceId } = useParams();
  const navigate = useNavigate();
  const [balanceId, setBalanceId] = useState(urlBalanceId || '');
  const [changes, setChanges] = useState([]);
  const [isTabActive, setIsTabActive] = useState(true);
  const [recentId, setRecentId] = useState(0);
  const [previousRecentId, setPreviousRecentId] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFetchChanges = useCallback(async () => {
    try {
      setLoading(true);
      const recent = readFromLocalStorage('recent-incoming', balanceId);
      setPreviousRecentId(recent);
      setRecentId(recent);
      const data = await fetchBalanceChanges(balanceId);
      setChanges(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

  useEffect(() => {
    if (changes?.jar?.title) {
      document.title = `${changes.jar.title} - Jar Tracker`;
    } else {
      document.title = 'Jar Tracker';
    }
  }, [changes?.jar?.title]);

  useEffect(() => {
    if (!changes?.incoming?.length || !changes?.account?.trackId) {
      return;
    }

    setPreviousRecentId(recentId);
    const recent = changes?.incoming?.[0].id;
    setRecentId(recent);
    saveToLocalStorage('recent-incoming', recent, changes?.account?.trackId);
  }, [changes?.incoming?.[0]?.id]);

  useEffect(() => {
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      const color = loading ? '#75847a' : '#0d8638';
      themeColor.setAttribute('content', color);
    }
  }, [loading]);

  const handleStartTracking = input => {
    let id = input;
    const urlPattern = /(https:\/\/)?send\.monobank\.ua\/jar\/([a-zA-Z0-9]+)/;
    const match = input.match(urlPattern);

    if (match) {
      id = match[2];
    }

    if (balanceId !== id) {
      setChanges({});
    }
    setBalanceId(id);
    navigate(`/${id}`);
  };

  return (
    <div className="space-y-4">
      {changes?.jar?.ownerName ? (
        <h2 className={styles['title']}>
          <span className={styles['owner-name']}>{changes?.jar?.ownerName}</span>
          <a
            href={`https://send.monobank.ua/jar/${balanceId}`}
            target="_blank"
            className={styles['jar-title']}
            rel="noreferrer"
          >
            {changes?.jar?.title}
          </a>
        </h2>
      ) : (
        <h2 className={styles['title']}>Трекер банки</h2>
      )}
      <BalanceInput
        onSubmit={handleStartTracking}
        initialValue={urlBalanceId || ''}
        loading={loading}
      />
      <ChangesList changes={changes.incoming} recentIncomingId={previousRecentId} />
    </div>
  );
}

export default BalanceTracker;
