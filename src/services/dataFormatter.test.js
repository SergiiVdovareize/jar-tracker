import { formatDate, formatBalance } from './dataFormatter';

describe('dataFormatter', () => {
  describe('formatDate', () => {
    it('formats date correctly in Ukrainian locale format', () => {
      // Create a specific local date
      const testDate = new Date(2026, 0, 15, 9, 5); // 15 Jan 2026, 09:05
      const formatted = formatDate(testDate.toISOString());
      expect(formatted).toBe('15 січня, 09:05');
    });

    it('formats date with padded hour and minute', () => {
      const testDate = new Date(2026, 9, 4, 14, 30); // 4 Oct 2026, 14:30
      const formatted = formatDate(testDate.toISOString());
      expect(formatted).toBe('4 жовтня, 14:30');
    });

    it('handles all months correctly', () => {
      const months = [
        'січня',
        'лютого',
        'березня',
        'квітня',
        'травня',
        'червня',
        'липня',
        'серпня',
        'вересня',
        'жовтня',
        'листопада',
        'грудня',
      ];

      months.forEach((monthName, index) => {
        const d = new Date(2026, index, 1, 10, 0);
        expect(formatDate(d.toISOString())).toBe(`1 ${monthName}, 10:00`);
      });
    });
  });

  describe('formatBalance', () => {
    it('formats cents to UAH with trailing period', () => {
      const result = formatBalance(10000); // 100 UAH
      expect(result.endsWith('.')).toBe(true);
      expect(result).toMatch(/100/);
    });

    it('formats zero correctly', () => {
      const result = formatBalance(0);
      expect(result.endsWith('.')).toBe(true);
      expect(result).toMatch(/0/);
    });

    it('formats large numbers with grouping', () => {
      const result = formatBalance(100000000); // 1,000,000 UAH
      expect(result.endsWith('.')).toBe(true);
      expect(result).toMatch(/1[\s\u00a0]000[\s\u00a0]000/);
    });
  });
});
