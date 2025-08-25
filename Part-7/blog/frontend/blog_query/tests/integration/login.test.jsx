import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { beforeAll, afterAll, afterEach, describe, it, expect, vi } from 'vitest';

vi.mock('../../src/components/UserInitializer', () => ({
  default: ({ children }) => <>{children}</>,
}));

import Providers from '../../src/Providers';
import Header from '../../src/components/Header/Header';
import LoginForm from '../../src/components/Auth/LoginForm';
import Notification from '../../src/components/Notification';

const API_URL = '/api/login';
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderWithProviders = (ui) => render(<Providers>{ui}</Providers>);

describe('LoginForm integration', () => {
  it('logs in successfully and shows AuthStatus + global popup', async () => {
    server.use(
      http.post(API_URL, async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json(
          {
            token: 'fake-token',
            username: body.username,
            name: 'Test User',
            id: 'u1',
          },
          { status: 200 }
        );
      })
    );

    const user = userEvent.setup();

    renderWithProviders(
      <>
        <Header />
        <LoginForm />
        <Notification />
      </>
    );

    const username = await screen.findByTestId('username');
    const password = await screen.findByTestId('password');

    await user.type(username, 'tester');
    await user.type(password, 'secret');
    await user.click(await screen.findByTestId('login'));

    expect(await screen.findByText(/welcome,\s*test user/i)).toBeInTheDocument();
    expect(username).toHaveValue('');
    expect(password).toHaveValue('');

    const authStatus = await screen.findByTestId('auth-status');
    expect(authStatus).toHaveTextContent(/test user\s+logged in/i);
    expect(within(authStatus).getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('shows global error notification on login failure and keeps form filled', async () => {
    server.use(
      http.post(API_URL, async () =>
        HttpResponse.json({ error: 'invalid username or password' }, { status: 401 })
      )
    );

    const user = userEvent.setup();

    renderWithProviders(
      <>
        <Header />
        <LoginForm />
        <Notification />
      </>
    );

    const form = await screen.findByRole('form', { hidden: true }).catch(() => null);
    const username = await screen.findByTestId('username');
    const password = await screen.findByTestId('password');

    await user.type(username, 'wrong');
    await user.type(password, 'bad');
    await user.click(await screen.findByTestId('login'));

    expect(await screen.findByText(/invalid username or password/i)).toBeInTheDocument();
    expect(screen.queryByTestId('auth-status')).not.toBeInTheDocument();
    expect(username).toHaveValue('wrong');
    expect(password).toHaveValue('bad');
    if (form) {
      expect(within(form).queryByText(/invalid username or password/i)).not.toBeNull();
    }
  });
});