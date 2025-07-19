import { useQuery } from '@tanstack/react-query';
import userService from '../services/users';
import { useNotification } from '../hooks';

export const useUsers = () => {
  const notify = useNotification();

  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    select: (data) => [...data].sort((a, b) => b.blogs.length - a.blogs.length),
    onError: (error) => {
      notify({
        type: 'error',
        message: `Failed to fetch users. Error: "${error.message}"`,
      });
    },
  });
};

export const useUserById = (id) => {
  const notify = useNotification();

  return useQuery({
    queryKey: ['selectedUser', id],
    queryFn: () => userService.getById(id),
    onError: (error) => {
      notify({
        type: 'error',
        message: `Failed to fetch user. Error: "${error.message}"`,
      });
    },
  });
};
