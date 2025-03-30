import React from 'react';
import { formatDate, formatBalance } from '../services/dataFormatter';
import styles from './ChangeListItem.module.css';

function ChangeListItem({ change, previousChange, isNew }) {
  const calculateChange = (current, previous) => {
    if (!previous) return null;
    const diff = current - previous;
    return {
      amount: diff,
      isPositive: diff > 0,
    };
  };

  const changeInfo = calculateChange(change.balance, previousChange?.balance);

  return (
    <div className={`${styles.changeItem} ${isNew ? styles.highlight : ''}`}>
      <div className={styles.changeContent}>
        <div>
          <p className={styles.timestamp}>{formatDate(change.trackedAt)}</p>
          <p className={styles.balance}>{formatBalance(change.balance)}</p>
        </div>
        {changeInfo && (
          <div className={styles.changeAmount}>
            <p>{formatBalance(changeInfo.amount)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChangeListItem;
