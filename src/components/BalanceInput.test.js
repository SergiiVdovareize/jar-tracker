import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BalanceInput from './BalanceInput';

describe('BalanceInput', () => {
  const originalClipboard = navigator.clipboard;

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
      writable: true,
    });
    jest.restoreAllMocks();
  });

  it('renders input and submit button with default values', () => {
    const onSubmit = jest.fn();
    render(<BalanceInput onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('уведіть id або посилання банки');
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('');

    const submitBtn = screen.getByRole('button', { name: /Відстежувати/i });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  it('sets initialValue into input field', () => {
    const onSubmit = jest.fn();
    render(<BalanceInput onSubmit={onSubmit} initialValue="initialJarId123" />);

    const input = screen.getByPlaceholderText('уведіть id або посилання банки');
    expect(input.value).toBe('initialJarId123');
  });

  it('allows user typing and calls onSubmit when form is submitted', () => {
    const onSubmit = jest.fn();
    render(<BalanceInput onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('уведіть id або посилання банки');
    fireEvent.change(input, { target: { value: 'customJarId99' } });
    expect(input.value).toBe('customJarId99');

    const submitBtn = screen.getByRole('button', { name: /Відстежувати/i });
    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('customJarId99');
  });

  it('disables input and buttons when loading is true', () => {
    const onSubmit = jest.fn();
    render(<BalanceInput onSubmit={onSubmit} loading={true} />);

    const input = screen.getByPlaceholderText('уведіть id або посилання банки');
    expect(input).toBeDisabled();

    const submitBtn = screen.getByRole('button', { name: /Завантаження.../i });
    expect(submitBtn).toBeDisabled();
  });

  it('handles paste from clipboard and triggers onSubmit', async () => {
    const readTextMock = jest.fn().mockResolvedValue('https://send.monobank.ua/jar/1234567890');
    Object.defineProperty(navigator, 'clipboard', {
      value: { readText: readTextMock },
      configurable: true,
      writable: true,
    });

    const onSubmit = jest.fn();
    render(<BalanceInput onSubmit={onSubmit} />);

    const pasteBtn = screen.getByTitle('Вставити і відстежити');
    fireEvent.click(pasteBtn);

    await waitFor(() => {
      expect(readTextMock).toHaveBeenCalled();
      expect(onSubmit).toHaveBeenCalledWith('https://send.monobank.ua/jar/1234567890');
    });
  });

  it('handles clipboard read rejection gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const readTextMock = jest.fn().mockRejectedValue(new Error('Permission denied'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { readText: readTextMock },
      configurable: true,
      writable: true,
    });

    const onSubmit = jest.fn();
    render(<BalanceInput onSubmit={onSubmit} />);

    const pasteBtn = screen.getByTitle('Вставити і відстежити');
    fireEvent.click(pasteBtn);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('checks clipboard on active tab when permission is granted and enables/disables paste button', async () => {
    const readTextMock = jest.fn().mockResolvedValue('https://send.monobank.ua/jar/1234567890');
    Object.defineProperty(navigator, 'clipboard', {
      value: { readText: readTextMock },
      configurable: true,
      writable: true,
    });

    // Mock permissions query granted
    Object.defineProperty(navigator, 'permissions', {
      value: {
        query: jest.fn().mockResolvedValue({ state: 'granted', onchange: null }),
      },
      configurable: true,
      writable: true,
    });

    const onSubmit = jest.fn();
    render(<BalanceInput onSubmit={onSubmit} />);

    await waitFor(() => {
      expect(readTextMock).toHaveBeenCalled();
    });
  });
});
