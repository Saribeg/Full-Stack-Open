import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import Header from '../../src/components/Header';

vi.mock('../../src/components/Logo', () => ({
  default: () => <div data-testid="logo">Logo</div>
}));

vi.mock('../../src/components/Auth/AuthStatus', () => ({
  default: ({ user }) => <div data-testid="auth-status">Hello {user.name}</div>
}));

describe('Header', () => {
  it('renders Logo always', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        auth: { user: null, status: { loading: false, error: null } }
      }
    });
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('does not render nav links or AuthStatus when no user', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        auth: { user: null, status: { loading: false, error: null } }
      }
    });
    expect(screen.queryByRole('link', { name: /About/i })).not.toBeInTheDocument();
    expect(screen.queryByTestId('auth-status')).not.toBeInTheDocument();
  });

  it('renders nav links and AuthStatus when user exists', () => {
    const user = { id: '1', name: 'Alice' };

    renderWithProviders(<Header />, {
      preloadedState: {
        auth: { user, status: { loading: false, error: null } }
      }
    });

    expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Blogs/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Users/i })).toBeInTheDocument();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Hello Alice');
  });

  it('applies active class to current route', () => {
    const user = { id: '1', name: 'Alice' };

    renderWithProviders(<Header />, {
      preloadedState: {
        auth: { user, status: { loading: false, error: null } }
      },
      route: '/blogs'
    });

    const blogsLink = screen.getByRole('link', { name: /Blogs/i });
    expect(blogsLink.className).toMatch(/border-cyan-800/);
  });
});
