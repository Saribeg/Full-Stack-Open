import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../utils/test-utils';
import BlogForm from '../../src/components/Blog/BlogForm';
import Notification from '../../src/components/Notification/Notification';

const API_URL = '/api/blogs';
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

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
            user: {
              id: 'u1',
              username: 'tester',
              name: 'Test User'
            }
          },
          { status: 201 }
        );
      })
    );

    const toggleForm = vi.fn();
    const { store } = renderWithProviders(
      <>
        <BlogForm toggleForm={toggleForm} />
        <Notification />
      </>
    );

    const user = userEvent.setup();

    await user.type(screen.getByTestId('blogTitle'), 'My New Blog');
    await user.type(screen.getByTestId('blogAuthor'), 'Tester');
    await user.type(screen.getByTestId('blogUrl'), 'http://example.com/blog');

    await user.click(screen.getByTestId('createBlog'));

    // popup notification
    expect(
      await screen.findByText((c) => c.toLowerCase().includes('my new blog'))
    ).toBeInTheDocument();

    // toggleForm should be called
    await waitFor(() => expect(toggleForm).toHaveBeenCalled());

    // form cleared
    expect(screen.getByTestId('blogTitle')).toHaveValue('');
    expect(screen.getByTestId('blogAuthor')).toHaveValue('');
    expect(screen.getByTestId('blogUrl')).toHaveValue('');

    // store updated
    const blogs = store.getState().blogs.blogList;
    expect(blogs).toHaveLength(1);
    expect(blogs[0].title).toBe('My New Blog');
  });

  it('shows error notification on failure', async () => {
    server.use(
      http.post(API_URL, async () => {
        return HttpResponse.json({ error: 'title must be at least 5 chars' }, { status: 400 });
      })
    );

    const toggleForm = vi.fn();
    const { store } = renderWithProviders(<BlogForm toggleForm={toggleForm} />);

    const user = userEvent.setup();

    await user.type(screen.getByTestId('blogTitle'), 'Bad');
    await user.type(screen.getByTestId('blogAuthor'), 'Tester');
    await user.type(screen.getByTestId('blogUrl'), 'http://example.com/blog');

    await user.click(screen.getByTestId('createBlog'));

    // inline notification
    expect(
      await screen.findByText((c) => c.toLowerCase().includes('title must be at least 5 chars'))
    ).toBeInTheDocument();

    // form should not close
    expect(toggleForm).not.toHaveBeenCalled();

    // fields remain filled
    expect(screen.getByTestId('blogTitle')).toHaveValue('Bad');

    // store not updated
    const blogs = store.getState().blogs.blogList;
    expect(blogs).toHaveLength(0);
  });
});
