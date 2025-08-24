import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { beforeAll, afterAll, afterEach, describe, it, expect, vi } from 'vitest';
import Providers from '../../src/Providers';
import BlogForm from '../../src/components/Blog/BlogForm';
import Notification from '../../src/components/Notification';

vi.mock('../../src/components/UserInitializer', () => ({
  default: ({ children }) => <>{children}</>,
}));

const API_URL = '/api/blogs';
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderWithProviders = (ui) => render(<Providers>{ui}</Providers>);

describe('BlogForm integration', () => {
  it('creates a new blog successfully', async () => {
    server.use(
      http.post(API_URL, async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json(
          {
            id: '123',
            title: body.title,
            author: body.author,
            url: body.url,
            likes: 0,
            comments: [],
            user: { id: 'u1', username: 'tester', name: 'Test User' },
          },
          { status: 201 }
        );
      })
    );

    const toggleForm = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <BlogForm toggleForm={toggleForm} />
        <Notification />
      </>
    );

    const titleInput  = await screen.findByTestId('blogTitle');
    const authorInput = await screen.findByTestId('blogAuthor');
    const urlInput    = await screen.findByTestId('blogUrl');

    await user.type(titleInput,  'My New Blog');
    await user.type(authorInput, 'Tester');
    await user.type(urlInput,    'http://example.com/blog');
    await user.click(await screen.findByRole('button', { name: /create/i }));

    expect(
      await screen.findByText(/thanks, test user, for creating blog "my new blog"/i)
    ).toBeInTheDocument();
    expect(titleInput).toHaveValue('');
    expect(authorInput).toHaveValue('');
    expect(urlInput).toHaveValue('');
    expect(toggleForm).toHaveBeenCalled();
  });

  it('shows error notification on failure', async () => {
    server.use(
      http.post(API_URL, async () =>
        HttpResponse.json({ error: 'title must be at least 5 chars' }, { status: 400 })
      )
    );

    const toggleForm = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <>
        <BlogForm toggleForm={toggleForm} />
        <Notification />
      </>
    );

    const titleInput  = await screen.findByTestId('blogTitle');
    const authorInput = await screen.findByTestId('blogAuthor');
    const urlInput    = await screen.findByTestId('blogUrl');

    await user.type(titleInput,  'Bad');
    await user.type(authorInput, 'Tester');
    await user.type(urlInput,    'http://example.com/blog');
    await user.click(await screen.findByRole('button', { name: /create/i }));

    expect(await screen.findByText(/title must be at least 5 chars/i)).toBeInTheDocument();

    expect(toggleForm).not.toHaveBeenCalled();
    expect(titleInput).toHaveValue('Bad');
  });
});