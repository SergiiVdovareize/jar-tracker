import React from 'react';
import { render, screen } from '@testing-library/react';
import ChangeListItem from './ChangeListItem';

describe('ChangeListItem', () => {
  const baseChange = {
    id: 10,
    balance: 50000,
    trackedAt: '2026-10-04T12:00:00.000Z',
  };

  it('renders timestamp and formatted balance without diff when no previousChange', () => {
    const { container } = render(
      <ChangeListItem change={baseChange} previousChange={null} isNew={false} />
    );

    expect(screen.getByText(/жовтня/)).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument();
    // No difference element rendered
    expect(container.querySelectorAll('p').length).toBe(2);
  });

  it('renders positive diff when balance increased compared to previous change', () => {
    const currentChange = { id: 2, balance: 60000, trackedAt: '2026-10-04T12:00:00.000Z' };
    const previousChange = { id: 1, balance: 50000, trackedAt: '2026-10-04T11:00:00.000Z' };

    render(<ChangeListItem change={currentChange} previousChange={previousChange} isNew={false} />);

    // 60000 - 50000 = +10000 (100 UAH)
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });

  it('renders negative diff when balance decreased', () => {
    const currentChange = { id: 2, balance: 40000, trackedAt: '2026-10-04T12:00:00.000Z' };
    const previousChange = { id: 1, balance: 50000, trackedAt: '2026-10-04T11:00:00.000Z' };

    const { container } = render(
      <ChangeListItem change={currentChange} previousChange={previousChange} isNew={false} />
    );

    // Diff is -10000 (-100 UAH)
    expect(screen.getByText(/-100/)).toBeInTheDocument();
    expect(container.querySelector('.negativeAmount')).toBeInTheDocument();
  });

  it('applies highlight class when isNew is true', () => {
    const { container } = render(
      <ChangeListItem change={baseChange} previousChange={null} isNew={true} />
    );

    expect(container.querySelector('.highlight')).toBeInTheDocument();
  });
});
