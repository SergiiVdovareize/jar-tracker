import React, { useState, useEffect } from 'react';
import styles from './BalanceInput.module.css';

function BalanceInput({ onSubmit, initialValue = '', loading = false }) {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formWrapper}>
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="уведіть id або посилання банки"
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Завантаження...' : 'Відстежувати'}
        </button>
      </div>
    </form>
  );
}

export default BalanceInput;
