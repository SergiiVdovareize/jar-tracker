import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./services/balanceService', () => ({
  fetchBalanceChanges: jest.fn().mockResolvedValue({
    jar: null,
    account: null,
    incoming: [],
  }),
  deactivateTrack: jest.fn().mockResolvedValue({ success: true }),
}));

describe('App', () => {
  it('renders without crashing and displays the default view', () => {
    render(<App />);
    expect(screen.getByText('Трекер банки')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('уведіть id або посилання банки')).toBeInTheDocument();
  });
});
