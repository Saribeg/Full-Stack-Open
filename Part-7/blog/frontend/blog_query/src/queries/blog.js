import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEnhancedMutation } from './utils';
import blogService from '../services/blogs';
import { useNotification } from '../hooks';

export const useBlogs = () => {
  const notify = useNotification();

  return useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    select: (data) => [...data].sort((a, b) => b.likes - a.likes),
    onError: (error) => {
      notify({
        type: 'error',
        message: `Failed to fetch blogs. Error: "${error.message}"`,
      });
    },
  });
};

export const useBlogById = (id) => {
  const notify = useNotification();

  return useQuery({
    queryKey: ['selectedBlog', id],
    queryFn: () => blogService.getById(id),
    onError: (error) => {
      notify({
        type: 'error',
        message: `Failed to fetch blog. Error: "${error.message}"`,
      });
    },
  });
};

export const useCreateBlog = () => {
  const notify = useNotification();

  return useEnhancedMutation(blogService.create, {
    invalidate: [['blogs']],
    mutationOptions: {
      onSuccess: (data) => {
        notify({
          type: 'info',
          message: `Blog "${data.title}" is successfully created`,
        });
      },
      onError: (err, { title }) => {
        notify({
          type: 'error',
          message: `${err.response?.data?.error || err.message}. Your input is "${title}"`,
        });
      },
    },
  });
};

export const useLikeBlog = () => {
  const notify = useNotification();

  return useEnhancedMutation(blogService.update, {
    invalidate: [['blogs']],
    update: [
      {
        key: (updatedBlog) => ['selectedBlog', updatedBlog.id],
        updater: (updatedBlog) => updatedBlog,
      },
    ],
    mutationOptions: {
      onSuccess: (updatedBlog) => {
        notify({
          type: 'success',
          message: `Blog ${updatedBlog.title} is successfully updated`,
        });
      },
      onError: (error) => {
        notify({
          type: 'error',
          message: error.response?.data?.error || error.message,
        });
      },
    },
  });
};

export const useDeleteBlog = () => {
  const notify = useNotification();
  const navigate = useNavigate();

  return useEnhancedMutation(
    ({ id }) => blogService.deleteBlog(id),
    {
      invalidate: [['blogs']],
      mutationOptions: {
        onSuccess: (_, { title }) => {
          navigate('/blogs');
          notify({
            type: 'success',
            message: `Blog ${title} is successfully deleted`,
          });
        },
        onError: (error) => {
          notify({
            type: 'error',
            message: error.response?.data?.error || error.message,
          });
        },
      },
    });
};

export const useCreateComment = () => {
  const notify = useNotification();

  return useEnhancedMutation(blogService.createComment, {
    invalidate: [['blogs']],
    update: [
      {
        key: (result, { id }) => ['selectedBlog', id],
        updater: (result, prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            comments: [...(prev.comments || []), result],
          };
        },
      },
    ],
    mutationOptions: {
      onSuccess: () => {
        notify({
          type: 'info',
          message: 'Comment is successfully added',
        });
      },
      onError: (err) => {
        notify({
          type: 'error',
          message: err.response?.data?.error || err.message,
        });
      },
    },
  });
};
