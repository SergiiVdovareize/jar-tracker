import React, { useState, useEffect } from 'react';
import styles from './BalanceInput.module.css';

function BalanceInput({ onSubmit, isTracking, initialValue = '' }) {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter Balance ID"
        className={styles.input}
      />
      <button 
        type="submit"
        className={styles.button}
        disabled={isTracking}
      >
        {isTracking ? 'Tracking...' : 'Start Tracking'}
      </button>
    </form>
  );
}

export default BalanceInput; 