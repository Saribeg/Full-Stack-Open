import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import Notification from '../../src/components/Notification';
import { renderWithContextNotification, renderWithLiveNotification } from '../utils/hocs';

describe('Notification component', () => {
  it('renders nothing if no notification', () => {
    const { container } = renderWithContextNotification(<Notification />, {
      notification: null,
      notificationDispatch: vi.fn(),
    });

    expect(container.firstChild).toBeNull();
  });

  it('renders notification message', () => {
    renderWithContextNotification(<Notification />, {
      notification: { message: 'Hello world', type: 'success' },
      notificationDispatch: vi.fn(),
    });

    expect(screen.getByText(/Hello world/i)).toBeInTheDocument();
    expect(screen.getByTestId('alert-success')).toBeInTheDocument();
  });

  it('closes notification and dispatches HIDE_MESSAGE on close', async () => {
    const mockDispatch = vi.fn();

    renderWithContextNotification(<Notification />, {
      notification: { message: 'Closing soon', type: 'info' },
      notificationDispatch: mockDispatch,
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'HIDE_MESSAGE' });
    });

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('auto-hides after default duration from uiConfigs', async () => {
    vi.useFakeTimers();

    const { dispatchSpy } = renderWithLiveNotification(<Notification />, {
      state: { message: 'Default duration', type: 'info' },
    });

    expect(screen.getByTestId('alert-info')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(3100);
      vi.runOnlyPendingTimers();
    });

    expect(dispatchSpy).toHaveBeenCalledWith({ type: 'HIDE_MESSAGE' });

    await act(async () => {});
    expect(screen.queryByRole('alert')).toBeNull();

    vi.useRealTimers();
  });

  it('respects custom duration and type (auto-hide removes it)', async () => {
    vi.useFakeTimers();

    const { dispatchSpy } = renderWithLiveNotification(<Notification />, {
      state: { message: 'Custom duration', type: 'error', duration: 500 },
    });

    expect(screen.getByTestId('alert-error')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(600);
      vi.runOnlyPendingTimers();
    });

    expect(dispatchSpy).toHaveBeenCalledWith({ type: 'HIDE_MESSAGE' });

    await act(async () => {});

    expect(screen.queryByRole('alert')).toBeNull();

    vi.useRealTimers();
  });
});
