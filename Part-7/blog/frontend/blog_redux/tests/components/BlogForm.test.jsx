import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from '@/components/BlogForm';

import blogService from '@/services/blogs';
vi.mock('@/services/blogs');

describe('<BlogForm />', () => {
  const modifyBlogs = vi.fn();
  const notify = vi.fn();
  const toggleForm = vi.fn();

  test('Handles creation of a new blog', async () => {
    const user = userEvent.setup();

    blogService.create.mockResolvedValue({
      id: 'mongo-db-id',
      title: 'Full Stack Open is the best course',
      author: 'Saribeh Karakhanian',
      url: 'https://fullstackopen.com',
      likes: 0,
      user: {
        id: 'mogo-db-user-id',
        username: 'username',
        name: 'name'
      }
    });

    render(<BlogForm modifyBlogs={modifyBlogs} notify={notify} toggleForm={toggleForm} />);

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    const authorInput = screen.getByRole('textbox', { name: /author/i });
    const urlInput = screen.getByRole('textbox', { name: /url/i });
    const createButton = screen.getByText('Create');

    await user.type(titleInput, 'Full Stack Open is the best course');
    await user.type(authorInput, 'Saribeh Karakhanian');
    await user.type(urlInput, 'https://fullstackopen.com');
    await user.click(createButton);

    expect(blogService.create).toHaveBeenCalledTimes(1);
    expect(blogService.create).toHaveBeenCalledWith({
      title: 'Full Stack Open is the best course',
      author: 'Saribeh Karakhanian',
      url: 'https://fullstackopen.com'
    });
    expect(modifyBlogs).toHaveBeenCalledTimes(1);
    expect(modifyBlogs).toHaveBeenCalledWith('add', {
      id: 'mongo-db-id',
      title: 'Full Stack Open is the best course',
      author: 'Saribeh Karakhanian',
      url: 'https://fullstackopen.com',
      likes: 0,
      user: {
        id: 'mogo-db-user-id',
        username: 'username',
        name: 'name'
      }
    });
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith({
      message: `Blog Full Stack Open is the best course is successfully created`,
      type: 'success'
    });
  });
});
