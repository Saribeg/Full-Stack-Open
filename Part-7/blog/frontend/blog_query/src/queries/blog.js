import { useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { useEnhancedMutation } from './utils';
import blogService from '../services/blogs';
import { useNotification } from '../hooks';

// Fetch all blogs
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

// Fetch blog by ID
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

// Create new blog
export const useCreateBlog = (options = {}) => {
  const notify = useNotification();

  return useEnhancedMutation(blogService.create, {
    invalidate: [['blogs']],
    mutationOptions: {
      ...options,
      onSuccess: (data, variables, context) => {
        notify({
          type: 'info',
          message: `Thanks, ${data.user.name}, for creating blog "${data.title}" by ${data.author}! Keep it up! 🏆`,
        });
        options?.onSuccess?.(data, variables, context);
      },
      onError: (err, variables, context) => {
        const title = variables?.title || 'Unknown';
        notify({
          type: 'error',
          message: `${err.response?.data?.error || err.message}. Your input is "${title}"`,
        });
        options?.onError?.(err, variables, context);
      },
    },
  });
};

// Like a blog
export const useLikeBlog = (options = {}) => {
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
      ...options,
      onSuccess: (data, variables, context) => {
        notify({
          type: 'success',
          message: `Thanks, ${data.user.name}, for liking "${data.title}" by ${data.author}! ❤️`,
        });
        options?.onSuccess?.(data, variables, context);
      },
      onError: (error, variables, context) => {
        notify({
          type: 'error',
          message: error.response?.data?.error || error.message,
        });
        options?.onError?.(error, variables, context);
      },
    },
  });
};

// Delete a blog
export const useDeleteBlog = (options = {}) => {
  const notify = useNotification();
  const navigate = useNavigate();

  return useEnhancedMutation(({ id }) => blogService.deleteBlog(id), {
    invalidate: [['blogs']],
    mutationOptions: {
      ...options,
      onSuccess: (_, { title }, context) => {
        navigate('/blogs');
        notify({
          type: 'success',
          message: '💀 The blog is gone... or is it? The internet never forgets. 🤫',
        });
        options?.onSuccess?.(_, { title }, context);
      },
      onError: (error, variables, context) => {
        notify({
          type: 'error',
          message: error.response?.data?.error || error.message,
          duration: 7000
        });
        options?.onError?.(error, variables, context);
      },
    },
  });
};

// Add comment to a blog
export const useCreateComment = (options = {}) => {
  const notify = useNotification();

  return useEnhancedMutation(blogService.createComment, {
    invalidate: [['blogs']],
    update: [
      {
        key: (updatedBlog) => ['selectedBlog', updatedBlog.id],
        updater: (updatedBlog) => updatedBlog,
      },
    ],
    mutationOptions: {
      ...options,
      onSuccess: (data, variables, context) => {
        const last = data.comments.at(-1);
        const preview =
          last?.text?.length > 20
            ? last.text.slice(0, 20) + '...'
            : last?.text ?? '...';
        notify({
          type: 'info',
          message: `Thanks for commenting "${data.title}" by ${data.author}! 💬 Comment "${preview}" added successfully!`,
        });
        options?.onSuccess?.(data, variables, context);
      },
      onError: (err, variables, context) => {
        notify({
          type: 'error',
          message: err.response?.data?.error || err.message,
        });
        options?.onError?.(err, variables, context);
      },
    },
  });
};

// Update existing comment
export const useUpdateComment = (options = {}) => {
  const notify = useNotification();

  return useEnhancedMutation(blogService.updateComment, {
    invalidate: [['blogs']],
    update: [
      {
        key: (updatedBlog) => ['selectedBlog', updatedBlog.id],
        updater: (updatedBlog) => updatedBlog,
      },
    ],
    mutationOptions: {
      ...options,
      onSuccess: (data, variables, context) => {
        notify({
          type: 'success',
          message: '✏️ Your comment was updated successfully!',
        });
        options?.onSuccess?.(data, variables, context);
      },
      onError: (err, variables, context) => {
        notify({
          type: 'error',
          message: err.response?.data?.error || err.message,
        });
        options?.onError?.(err, variables, context);
      },
    },
  });
};

// Delete existing comment
export const useDeleteComment = (options = {}) => {
  const notify = useNotification();

  return useEnhancedMutation(blogService.deleteComment, {
    invalidate: [['blogs']],
    update: [
      {
        key: (updatedBlog) => ['selectedBlog', updatedBlog.id],
        updater: (updatedBlog) => updatedBlog,
      },
    ],
    mutationOptions: {
      ...options,
      onSuccess: (data, variables, context) => {
        notify({
          type: 'info',
          message: '🗑️ Comment deleted successfully.',
        });
        options?.onSuccess?.(data, variables, context);
      },
      onError: (err, variables, context) => {
        notify({
          type: 'error',
          message: err.response?.data?.error || err.message,
        });
        options?.onError?.(err, variables, context);
      },
    },
  });
};
