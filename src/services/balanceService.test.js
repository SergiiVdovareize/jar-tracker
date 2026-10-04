import { fetchBalanceChanges } from './balanceService';

describe('balanceService', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('fetches balance changes with default force=false and returns watch data', async () => {
    const mockWatchData = {
      jar: { title: 'Test Jar', balance: 50000 },
      incoming: [{ id: 1, balance: 50000 }],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, watch: mockWatchData }),
    });

    const result = await fetchBalanceChanges('testBalanceId');

    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/track/watch/mono/testBalanceId?force=false`
    );
    expect(result).toEqual(mockWatchData);
  });

  it('fetches balance changes with force=true when specified', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, watch: { id: 'forced' } }),
    });

    const result = await fetchBalanceChanges('testBalanceId', true);

    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/track/watch/mono/testBalanceId?force=true`
    );
    expect(result).toEqual({ id: 'forced' });
  });

  it('throws an error when HTTP status is not ok', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchBalanceChanges('invalidId')).rejects.toThrow('HTTP error! status: 404');
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('throws an error when data.success is false', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false }),
    });

    await expect(fetchBalanceChanges('someId')).rejects.toThrow('API request was not successful');
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
