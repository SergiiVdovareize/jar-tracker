import { useState, useEffect } from 'react';

const useClipboardPermission = () => {
  const [clipboardStatus, setClipboardStatus] = useState(null);
  const [isClipboardGranted, setIsClipboardGranted] = useState(false);
  const [isClipboardDenied, setIsClipboardDenied] = useState(false);
  const [isClipboardPrompt, setIsClipboardPrompt] = useState(false);

  useEffect(() => {
    const checkClipboard = async () => {
      // Basic check for API existence
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        setIsClipboardDenied(true);
        return;
      }

      // Permission check
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const permissionStatus = await navigator.permissions.query({
            name: 'clipboard-read',
          });
          setClipboardStatus(permissionStatus.state);

          permissionStatus.onchange = () => {
            setClipboardStatus(permissionStatus.state);
          };
        } catch (error) {
          // Fallback if query fails but API exists (e.g. Firefox)
          console.error('Failed to query clipboard permissions: ', error);
          setClipboardStatus('prompt');
        }
      } else {
        // Fallback checks if perm API missing
        setClipboardStatus('prompt');
      }
    };
    checkClipboard();
  }, []);

  useEffect(() => {
    if (clipboardStatus === 'granted') {
      setIsClipboardGranted(true);
    }

    if (clipboardStatus === 'denied') {
      setIsClipboardDenied(true);
    }

    if (clipboardStatus === 'prompt') {
      setIsClipboardPrompt(true);
    }
  }, [clipboardStatus]);

  return { clipboardStatus, isClipboardGranted, isClipboardDenied, isClipboardPrompt };
};

export default useClipboardPermission;
