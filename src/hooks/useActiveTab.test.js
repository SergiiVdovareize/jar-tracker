import { renderHook, act } from '@testing-library/react';
import useActiveTab from './useActiveTab';

describe('useActiveTab', () => {
  const originalVisibilityState = Object.getOwnPropertyDescriptor(document, 'visibilityState');

  afterEach(() => {
    if (originalVisibilityState) {
      Object.defineProperty(document, 'visibilityState', originalVisibilityState);
    }
  });

  const setVisibilityState = state => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => state,
    });
  };

  it('returns true when document is visible on initial load', () => {
    setVisibilityState('visible');
    const { result } = renderHook(() => useActiveTab());
    expect(result.current).toBe(true);
  });

  it('returns false when document is hidden on initial load', () => {
    setVisibilityState('hidden');
    const { result } = renderHook(() => useActiveTab());
    expect(result.current).toBe(false);
  });

  it('updates state when visibilitychange event occurs', () => {
    setVisibilityState('visible');
    const { result } = renderHook(() => useActiveTab());
    expect(result.current).toBe(true);

    act(() => {
      setVisibilityState('hidden');
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(result.current).toBe(false);

    act(() => {
      setVisibilityState('visible');
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(result.current).toBe(true);
  });

  it('removes event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    const { unmount } = renderHook(() => useActiveTab());

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
