import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { renderWithProviders } from '../utils/test-utils';
import LoginForm from '../../src/components/Auth/LoginForm';
import Header from '../../src/components/Header';
import Notification from '../../src/components/Notification/Notification';

const API_URL = '/api/login';
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

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
            id: 'u1'
          },
          { status: 200 }
        );
      })
    );

    const { store } = renderWithProviders(
      <>
        <Header />
        <LoginForm />
        <Notification />
      </>
    );

    const user = userEvent.setup();

    await user.type(screen.getByTestId('username'), 'tester');
    await user.type(screen.getByTestId('password'), 'secret');
    await user.click(screen.getByTestId('login'));

    // AuthStatus appears
    const authStatus = await screen.findByTestId('auth-status');
    expect(authStatus).toHaveTextContent(/Test User\s+logged in/i);

    // popup notification appears
    expect(
      await screen.findByText((c) => c.toLowerCase().includes('logged in'))
    ).toBeInTheDocument();

    // form cleared
    expect(screen.getByTestId('username')).toHaveValue('');
    expect(screen.getByTestId('password')).toHaveValue('');

    // store updated
    const authUser = store.getState().auth.user;
    expect(authUser).not.toBeNull();
    expect(authUser.name).toBe('Test User');
  });

  it('shows inline error notification on login failure', async () => {
    server.use(
      http.post(API_URL, async () => {
        return HttpResponse.json({ error: 'invalid username or password' }, { status: 401 });
      })
    );

    const { store } = renderWithProviders(
      <>
        <Header />
        <LoginForm />
        <Notification />
      </>
    );

    const user = userEvent.setup();

    await user.type(screen.getByTestId('username'), 'wrong');
    await user.type(screen.getByTestId('password'), 'bad');
    await user.click(screen.getByTestId('login'));

    // inline notification
    const form = screen.getByTestId('login-form');
    expect(await within(form).findByText(/invalid username or password/i)).toBeInTheDocument();

    // header should not show AuthStatus
    expect(screen.queryByText(/logged in/i)).not.toBeInTheDocument();

    // store not updated
    const authUser = store.getState().auth.user;
    expect(authUser).toBeNull();

    // fields remain filled
    expect(screen.getByTestId('username')).toHaveValue('wrong');
    expect(screen.getByTestId('password')).toHaveValue('bad');
  });
});
