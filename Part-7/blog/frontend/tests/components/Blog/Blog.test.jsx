import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from '@/components/Blog/Blog';

import blogService from '@/services/blogs';
vi.mock('@/services/blogs');

describe('<Blog />', () => {
  const blog = {
    title: 'My blog',
    author: 'Me',
    likes: 5,
    url: 'http://example.com',
    user: { id: '007', name: 'user' }
  };

  const user = { id: '007', name: 'user' };
  const modifyBlogs = vi.fn();
  const notify = vi.fn();

  test('renders blog title', () => {
    const { container } = render(
      <Blog blog={blog} user={user} modifyBlogs={modifyBlogs} notify={notify} />
    );

    const blogTitle = container.querySelector('.blog-title');
    const blogAuthor = container.querySelector('.blog-author');
    const blogDetails = container.querySelector('.blog-details');

    expect(blogTitle).toHaveTextContent('My blog');
    expect(blogAuthor).toHaveTextContent('by Me');
    expect(blogDetails).toBeNull();
  });

  test('renders blog details when blog title is clicked', async () => {
    const { container } = render(
      <Blog blog={blog} user={user} modifyBlogs={modifyBlogs} notify={notify} />
    );

    const userEvents = userEvent.setup();
    const blogTitle = container.querySelector('.blog-title');
    await userEvents.click(blogTitle);

    const blogDetails = container.querySelector('.blog-details');
    const blogLikes = container.querySelector('.blog-likes');
    const blogUser = container.querySelector('.blog-user');

    expect(blogDetails).toBeInTheDocument();
    expect(blogLikes).toHaveTextContent('5');
    expect(screen.getByText('❤️ Like')).toBeInTheDocument();
    expect(blogUser).toHaveTextContent('user');
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('Handles clicks to Like button', async () => {
    blogService.update.mockResolvedValue({ ...blog, likes: blog.likes + 1 });

    const { container } = render(
      <Blog blog={blog} user={user} modifyBlogs={modifyBlogs} notify={notify} />
    );

    const userEvents = userEvent.setup();
    const blogTitle = container.querySelector('.blog-title');
    await userEvents.click(blogTitle);

    const blogLikeButton = container.querySelector('.blog-like');
    await userEvents.click(blogLikeButton);
    await userEvents.click(blogLikeButton);

    expect(blogService.update).toHaveBeenCalledTimes(2);
    expect(modifyBlogs).toHaveBeenCalledTimes(2);
    expect(notify).toHaveBeenCalledTimes(2);
  });
});
