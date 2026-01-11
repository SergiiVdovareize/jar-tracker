import React, { useState, useEffect, useRef } from 'react';
import styles from './BalanceInput.module.css';
import useActiveTab from '../hooks/useActiveTab';
import useClipboardPermission from '../hooks/useClipboardPermission';
import { JAR_PATTERN } from '../utils/constants';
import { Clipboard, SquareActivity } from 'lucide-react';

function BalanceInput({ onSubmit, initialValue = '', loading = false }) {
  const [inputValue, setInputValue] = useState(initialValue);
  const { isClipboardGranted, isClipboardDenied } = useClipboardPermission();
  const [isPasteEnabled, setIsPasteEnabled] = useState(true);
  const [isClipboardButtonAvailable, setIsClipboardButtonAvailable] = useState(true);
  const inputRef = useRef(null);
  const isTabActive = useActiveTab();

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isTabActive && isClipboardGranted) {
      navigator.clipboard
        .readText()
        .then(clipboard => {
          setIsPasteEnabled(clipboard.match(JAR_PATTERN));
        })
        .catch(err => {
          console.error('Failed to read clipboard contents: ', err);
        });
    }
  }, [isTabActive, isClipboardGranted]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setIsClipboardButtonAvailable(!isClipboardDenied);
  }, [isClipboardDenied]);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  const handlePaste = async () => {
    try {
      navigator.clipboard.readText().then(clipboard => {
        setInputValue(clipboard);
        onSubmit(clipboard);
      });
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const btnCaption = loading ? 'Завантаження...' : 'Відстежувати';

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formWrapper}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="уведіть id або посилання банки"
          disabled={loading}
          className={styles.input}
          name="jarId"
        />
        <div className={styles.buttonWrapper}>
          {isClipboardButtonAvailable && (
            <button
              type="button"
              className={`${styles.button} ${styles.pasteButton}`}
              onClick={handlePaste}
              disabled={loading || !isPasteEnabled}
              title="Вставити і відстежити"
            >
              <Clipboard />
            </button>
          )}
          <button
            type="submit"
            className={`${styles.button} ${styles.submitButton}`}
            disabled={loading}
          >
            <SquareActivity />
            {btnCaption}
          </button>
        </div>
      </div>
    </form>
  );
}

export default BalanceInput;
