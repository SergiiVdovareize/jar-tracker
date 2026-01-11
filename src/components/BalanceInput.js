import React, { useState, useEffect, useRef } from 'react';
import styles from './BalanceInput.module.css';
import useActiveTab from '../hooks/useActiveTab';
import { JAR_PATTERN } from '../utils/constants';

function BalanceInput({ onSubmit, initialValue = '', loading = false }) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isClipboardAvailable, setIsClipboardAvailable] = useState(false);
  const [isPasteEnabled, setIsPasteEnabled] = useState(true);
  const inputRef = useRef(null);
  const isTabActive = useActiveTab();

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isTabActive && isClipboardAvailable) {
      navigator.clipboard
        .readText()
        .then(clipboard => {
          setIsPasteEnabled(clipboard.match(JAR_PATTERN));
        })
        .catch(err => {
          console.error('Failed to read clipboard contents: ', err);
        });
    }
  }, [isTabActive]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const checkClipboard = async () => {
      // Basic check for API existence
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        setIsClipboardAvailable(false);
        return;
      }

      // Permission check
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const permissionStatus = await navigator.permissions.query({
            name: 'clipboard-read',
          });
          setIsClipboardAvailable(
            permissionStatus.state === 'granted' || permissionStatus.state === 'prompt'
          );

          permissionStatus.onchange = () => {
            setIsClipboardAvailable(
              permissionStatus.state === 'granted' || permissionStatus.state === 'prompt'
            );
          };
        } catch (error) {
          // Fallback if query fails but API exists (e.g. Firefox)
          console.error('Failed to query clipboard permissions: ', error);
          setIsClipboardAvailable(true);
        }
      } else {
        // Fallback checks if perm API missing
        setIsClipboardAvailable(true);
      }
    };
    checkClipboard();
  }, []);

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
          {isClipboardAvailable && (
            <button
              type="button"
              className={`${styles.button} ${styles.pasteButton}`}
              onClick={handlePaste}
              disabled={loading || !isPasteEnabled}
              title="Вставити і відстежити"
            />
          )}
          <button
            type="submit"
            className={`${styles.button} ${styles.submitButton}`}
            disabled={loading}
          >
            {btnCaption}
          </button>
        </div>
      </div>
    </form>
  );
}

export default BalanceInput;
