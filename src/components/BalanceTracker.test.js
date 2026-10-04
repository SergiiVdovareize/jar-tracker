import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BalanceTracker from './BalanceTracker';
import * as balanceService from '../services/balanceService';
import * as metaHelper from '../utils/metaHelper';

jest.mock('../services/balanceService');
jest.mock('../utils/metaHelper');

describe('BalanceTracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    balanceService.deactivateTrack.mockResolvedValue({ success: true });
  });

  const renderComponent = (initialPath = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/" element={<BalanceTracker />} />
          <Route path="/:balanceId" element={<BalanceTracker />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders default title "Трекер банки" when no jar is loaded', () => {
    renderComponent('/');
    expect(screen.getByText('Трекер банки')).toBeInTheDocument();
  });

  it('fetches balance changes on mount when balanceId is in URL', async () => {
    const mockWatchData = {
      jar: {
        title: 'На дрони для ЗСУ',
        ownerName: 'Іван Петренко',
        balance: 2500000,
        goal: 5000000,
        status: 'ACTIVE',
      },
      account: {
        trackId: '1234567890',
        isActive: true,
      },
      incoming: [
        {
          id: 101,
          balance: 2500000,
          trackedAt: '2026-10-04T12:00:00.000Z',
        },
      ],
    };

    balanceService.fetchBalanceChanges.mockResolvedValue(mockWatchData);

    renderComponent('/1234567890');

    await waitFor(() => {
      expect(balanceService.fetchBalanceChanges).toHaveBeenCalledWith('1234567890', false);
    });

    await waitFor(() => {
      expect(screen.getByText('Іван Петренко')).toBeInTheDocument();
      expect(screen.getByText('На дрони для ЗСУ')).toBeInTheDocument();
      expect(document.title).toBe('На дрони для ЗСУ - Jar Tracker');
      expect(metaHelper.setMetaTheme).toHaveBeenCalledWith('#0d8638');
    });
  });

  it('renders completed jar indicator when jar status is closed', async () => {
    const mockWatchData = {
      jar: {
        title: 'Закрита банка',
        ownerName: 'Олена',
        balance: 1000000,
        goal: 1000000,
        status: 'closed',
      },
      account: {
        trackId: 'closedJar1',
        isActive: true,
      },
      incoming: [],
    };

    balanceService.fetchBalanceChanges.mockResolvedValue(mockWatchData);

    renderComponent('/closedJar1');

    await waitFor(() => {
      expect(screen.getByText('[розбита ✓]')).toBeInTheDocument();
      expect(balanceService.deactivateTrack).toHaveBeenCalledWith('closedJar1');
    });

    expect(metaHelper.setMetaTheme).toHaveBeenCalledWith('#0057a4');
  });

  it('renders inactive jar indicator and allows reactivation', async () => {
    const mockWatchData = {
      jar: {
        title: 'Неактивна банка',
        ownerName: 'Тарас',
        balance: 100000,
        goal: 200000,
        status: 'ACTIVE',
      },
      account: {
        trackId: 'inactiveJar',
        isActive: false,
      },
      incoming: [],
    };

    balanceService.fetchBalanceChanges.mockResolvedValue(mockWatchData);

    renderComponent('/inactiveJar');

    await waitFor(() => {
      expect(screen.getByText('[неактивна ↻]')).toBeInTheDocument();
    });

    // Click reactivation button
    fireEvent.click(screen.getByText('[неактивна ↻]'));

    await waitFor(() => {
      expect(balanceService.fetchBalanceChanges).toHaveBeenCalledWith('inactiveJar', true);
    });
  });

  it('handles tracking new jar ID on form submit', async () => {
    balanceService.fetchBalanceChanges.mockResolvedValue({
      jar: { title: 'Нова банка', ownerName: 'Сергій', balance: 50000 },
      account: { trackId: '9876543210', isActive: true },
      incoming: [],
    });

    renderComponent('/');

    const input = screen.getByPlaceholderText('уведіть id або посилання банки');
    const submitBtn = screen.getByRole('button', { name: /Відстежувати/i });

    fireEvent.change(input, {
      target: { value: 'https://send.monobank.ua/jar/9876543210' },
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(balanceService.fetchBalanceChanges).toHaveBeenCalledWith('9876543210', false);
    });
  });

  it('runs polling interval when balanceId is present and active', async () => {
    jest.useFakeTimers();

    balanceService.fetchBalanceChanges.mockResolvedValue({
      jar: { title: 'Банка з таймером', ownerName: 'Тестер' },
      incoming: [],
    });

    renderComponent('/pollJar123');

    await act(async () => {
      jest.advanceTimersByTime(60000);
    });

    expect(balanceService.fetchBalanceChanges).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });
});
