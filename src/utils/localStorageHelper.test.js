import {
  saveToLocalStorage,
  readFromLocalStorage,
  removeFromLocalStorage,
} from './localStorageHelper';

describe('localStorageHelper', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('saveToLocalStorage', () => {
    it('saves serialized JSON without suffix', () => {
      saveToLocalStorage('test-key', { foo: 'bar' });
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify({ foo: 'bar' }));
    });

    it('saves serialized JSON with suffix', () => {
      saveToLocalStorage('test-key', 12345, 'my-suffix');
      expect(localStorage.getItem('test-key-my-suffix')).toBe('12345');
    });

    it('handles localStorage errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new Error('Quota exceeded');
      });

      saveToLocalStorage('test-key', 'data');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error saving to localStorage:',
        expect.any(Error)
      );

      setItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('readFromLocalStorage', () => {
    it('reads and parses JSON without suffix', () => {
      localStorage.setItem('test-key', JSON.stringify({ a: 1 }));
      expect(readFromLocalStorage('test-key')).toEqual({ a: 1 });
    });

    it('reads and parses JSON with suffix', () => {
      localStorage.setItem('test-key-suffix1', JSON.stringify(['item']));
      expect(readFromLocalStorage('test-key', 'suffix1')).toEqual(['item']);
    });

    it('returns null if item does not exist', () => {
      expect(readFromLocalStorage('non-existing-key')).toBeNull();
    });

    it('returns null and logs error if stored JSON is invalid', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('test-key', 'invalid-json{');

      const result = readFromLocalStorage('test-key');
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error reading from localStorage:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('removeFromLocalStorage', () => {
    it('removes item without suffix', () => {
      localStorage.setItem('test-key', 'value');
      removeFromLocalStorage('test-key');
      expect(localStorage.getItem('test-key')).toBeNull();
    });

    it('removes item with suffix', () => {
      localStorage.setItem('test-key-suffix', 'value');
      removeFromLocalStorage('test-key', 'suffix');
      expect(localStorage.getItem('test-key-suffix')).toBeNull();
    });

    it('handles error when removeItem throws', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const removeItemSpy = jest
        .spyOn(Storage.prototype, 'removeItem')
        .mockImplementationOnce(() => {
          throw new Error('SecurityError');
        });

      removeFromLocalStorage('test-key');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error removing from localStorage:',
        expect.any(Error)
      );

      removeItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});
