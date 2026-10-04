import { renderHook, waitFor, act } from '@testing-library/react';
import useClipboardPermission from './useClipboardPermission';

describe('useClipboardPermission', () => {
  const originalClipboard = navigator.clipboard;
  const originalPermissions = navigator.permissions;

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(navigator, 'permissions', {
      value: originalPermissions,
      configurable: true,
      writable: true,
    });
    jest.restoreAllMocks();
  });

  it('sets isClipboardDenied to true if navigator.clipboard is not available', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });

    const { result } = renderHook(() => useClipboardPermission());

    await waitFor(() => {
      expect(result.current.isClipboardDenied).toBe(true);
      expect(result.current.isClipboardGranted).toBe(false);
    });
  });

  it('handles permission state "granted"', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { readText: jest.fn() },
      configurable: true,
    });

    const mockPermissionStatus = {
      state: 'granted',
      onchange: null,
    };

    Object.defineProperty(navigator, 'permissions', {
      value: {
        query: jest.fn().mockResolvedValue(mockPermissionStatus),
      },
      configurable: true,
    });

    const { result } = renderHook(() => useClipboardPermission());

    await waitFor(() => {
      expect(result.current.clipboardStatus).toBe('granted');
      expect(result.current.isClipboardGranted).toBe(true);
      expect(result.current.isClipboardDenied).toBe(false);
    });
  });

  it('handles permission state "denied"', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { readText: jest.fn() },
      configurable: true,
    });

    const mockPermissionStatus = {
      state: 'denied',
      onchange: null,
    };

    Object.defineProperty(navigator, 'permissions', {
      value: {
        query: jest.fn().mockResolvedValue(mockPermissionStatus),
      },
      configurable: true,
    });

    const { result } = renderHook(() => useClipboardPermission());

    await waitFor(() => {
      expect(result.current.clipboardStatus).toBe('denied');
      expect(result.current.isClipboardDenied).toBe(true);
      expect(result.current.isClipboardGranted).toBe(false);
    });
  });

  it('handles permission onchange event', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { readText: jest.fn() },
      configurable: true,
    });

    const mockPermissionStatus = {
      state: 'prompt',
      onchange: null,
    };

    Object.defineProperty(navigator, 'permissions', {
      value: {
        query: jest.fn().mockResolvedValue(mockPermissionStatus),
      },
      configurable: true,
    });

    const { result } = renderHook(() => useClipboardPermission());

    await waitFor(() => {
      expect(result.current.clipboardStatus).toBe('prompt');
      expect(result.current.isClipboardPrompt).toBe(true);
    });

    act(() => {
      mockPermissionStatus.state = 'granted';
      if (typeof mockPermissionStatus.onchange === 'function') {
        mockPermissionStatus.onchange();
      }
    });

    await waitFor(() => {
      expect(result.current.clipboardStatus).toBe('granted');
      expect(result.current.isClipboardGranted).toBe(true);
    });
  });

  it('fallbacks to "prompt" when permissions.query fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    Object.defineProperty(navigator, 'clipboard', {
      value: { readText: jest.fn() },
      configurable: true,
    });

    Object.defineProperty(navigator, 'permissions', {
      value: {
        query: jest.fn().mockRejectedValue(new Error('Query error')),
      },
      configurable: true,
    });

    const { result } = renderHook(() => useClipboardPermission());

    await waitFor(() => {
      expect(result.current.clipboardStatus).toBe('prompt');
      expect(result.current.isClipboardPrompt).toBe(true);
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('fallbacks to "prompt" when permissions API is missing', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { readText: jest.fn() },
      configurable: true,
    });

    Object.defineProperty(navigator, 'permissions', {
      value: undefined,
      configurable: true,
    });

    const { result } = renderHook(() => useClipboardPermission());

    await waitFor(() => {
      expect(result.current.clipboardStatus).toBe('prompt');
      expect(result.current.isClipboardPrompt).toBe(true);
    });
  });
});
