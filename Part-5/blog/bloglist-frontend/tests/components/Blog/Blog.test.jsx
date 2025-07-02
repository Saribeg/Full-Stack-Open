import { render, screen } from '@testing-library/react';
import Blog from '@/components/Blog/Blog';

test('renders blog title', () => {
  const blog = {
    title: 'My blog',
    author: 'Me',
    likes: 5,
    user: {
      id: '007',
      name: 'user'
    }
  }
  const user = {
    id: '007',
    name: 'user'
  }
  const modifyBlogs = vi.fn()
  const notify = vi.fn()

  const { container } = render(<Blog blog={blog} user={user} modifyBlogs={modifyBlogs} notify={notify}/>);

  const blogTitle = container.querySelector('.blog-title');
  const blogAuthor = container.querySelector('.blog-author');
  const blogDetails = container.querySelector('.blog-details');

  expect(blogTitle).toHaveTextContent('My blog');
  expect(blogAuthor).toHaveTextContent('by Me');
  expect(blogDetails).toBeNull();
});