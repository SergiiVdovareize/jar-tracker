import React from 'react';
import { render, screen } from '@testing-library/react';
import ChangesList from './ChangesList';

describe('ChangesList', () => {
  it('returns null if changes prop is null or undefined', () => {
    const { container } = render(<ChangesList changes={null} recentIncomingId={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders history title and items when changes list is provided', () => {
    const changes = [
      { id: 2, balance: 35000, trackedAt: '2026-10-04T12:00:00.000Z' },
      { id: 1, balance: 10000, trackedAt: '2026-10-04T11:00:00.000Z' },
    ];

    render(<ChangesList changes={changes} recentIncomingId={1} />);

    expect(screen.getByText('Історія')).toBeInTheDocument();
    expect(screen.getByText(/350/)).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('slices the last item if changes length is greater than 5', () => {
    const changes = [
      { id: 6, balance: 60000, trackedAt: '2026-10-04T12:00:00.000Z' },
      { id: 5, balance: 50000, trackedAt: '2026-10-04T11:00:00.000Z' },
      { id: 4, balance: 40000, trackedAt: '2026-10-04T10:00:00.000Z' },
      { id: 3, balance: 30000, trackedAt: '2026-10-04T09:00:00.000Z' },
      { id: 2, balance: 20000, trackedAt: '2026-10-04T08:00:00.000Z' },
      { id: 1, balance: 10000, trackedAt: '2026-10-04T07:00:00.000Z' },
    ];

    const { container } = render(<ChangesList changes={changes} recentIncomingId={0} />);

    // Since length is 6, data is sliced to 0..5 (length 5)
    // The items rendered should be 5
    const items = container.querySelectorAll('.changeItem');
    expect(items.length).toBe(5);
  });
});
