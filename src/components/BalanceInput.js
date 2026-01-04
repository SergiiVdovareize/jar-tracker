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

  const btnCaption = loading ? 'Завантаження...' : 'Відстежувати';

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formWrapper}>
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="уведіть id або посилання банки"
          disabled={loading}
          className={styles.input}
          name="jarId"
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {btnCaption}
        </button>
      </div>
    </form>
  );
}

export default BalanceInput;
