import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { vi } from 'vitest';
import UserInitializer from '../../src/components/UserInitializer';
import { renderWithContextUser } from '../utils/hocs';
import { initializeUser } from '../../src/utils/user';

vi.mock('../../src/components/Spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('../../src/utils/user', () => ({
  initializeUser: vi.fn(),
}));

describe('UserInitializer component', () => {
  it('shows spinner first, then children', async () => {
    const dispatchUser = vi.fn();
    initializeUser.mockImplementationOnce(async () => {});

    renderWithContextUser(
      <UserInitializer>
        <div data-testid="child">Child content</div>
      </UserInitializer>,
      { dispatchUser }
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByTestId('spinner'));
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('calls initializeUser with dispatchUser on mount', async () => {
    const dispatchUser = vi.fn();

    renderWithContextUser(
      <UserInitializer>
        <div>Child content</div>
      </UserInitializer>,
      { dispatchUser }
    );

    await waitFor(() => {
      expect(initializeUser).toHaveBeenCalledWith(dispatchUser);
    });
  });
});
