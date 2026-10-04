import { waitFor } from '@testing-library/react';
import reportWebVitals from './reportWebVitals';

jest.mock('web-vitals', () => ({
  __esModule: true,
  getCLS: jest.fn(cb => cb({ name: 'CLS' })),
  getFID: jest.fn(cb => cb({ name: 'FID' })),
  getFCP: jest.fn(cb => cb({ name: 'FCP' })),
  getLCP: jest.fn(cb => cb({ name: 'LCP' })),
  getTTFB: jest.fn(cb => cb({ name: 'TTFB' })),
}));

describe('reportWebVitals', () => {
  it('does nothing when no callback is provided', () => {
    expect(() => reportWebVitals()).not.toThrow();
  });

  it('calls web-vitals functions when a callback function is provided', async () => {
    const callback = jest.fn();
    const onPerfEntry = (...args) => callback(...args);
    reportWebVitals(onPerfEntry);

    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(5);
    });
  });
});
