import React from 'react';
import { formatDate, formatBalance } from '../services/dataFormatter';
import styles from './ChangesList.module.css';

function ChangesList({ changes }) {
  const calculateChange = (current, previous) => {
    if (!previous) return null;
    const diff = current - previous;
    return {
      amount: diff,
      isPositive: diff > 0
    };
  };

  if (!changes) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Balance Changes</h2>
      <div className={styles.changesList}>
        {changes.map((change, index) => {
          const previousChange = index < changes.length - 1 ? changes[index + 1] : null;
          const changeInfo = calculateChange(change.balance, previousChange?.balance);

          return (
            <div key={change.id} className={styles.changeItem}>
              <div className={styles.changeContent}>
                <div>
                  <p className={styles.timestamp}>
                    {formatDate(change.trackedAt)}
                  </p>
                  <p className={styles.balance}>
                    {formatBalance(change.balance)}
                  </p>
                </div>
                {changeInfo && (
                  <div className={`${styles.changeAmount} ${changeInfo.isPositive ? styles.positive : styles.negative}`}>
                    <p>{formatBalance(changeInfo.amount)}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChangesList; 