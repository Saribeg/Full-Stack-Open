import { createSelector } from 'reselect';

export const selectUsersState = (state) => ({
  users: state.users.userList,
  loading: state.users.status.fetch.loading,
  error: state.users.status.fetch.error
});

export const selectAllUsers = (state) => state.users.userList;

export const selectSortedUsers = createSelector([selectAllUsers], (users) =>
  [...users].sort((a, b) => b.blogs.length - a.blogs.length)
);

export const selectVisibleUsersState = createSelector(
  [
    selectSortedUsers,
    (state) => state.users.status.fetch.loading,
    (state) => state.users.status.fetch.error
  ],
  (sortedUsers, loading, error) => ({
    users: sortedUsers,
    loading,
    error
  })
);

export const selectUserDetailsState = (state) => ({
  user: state.users.selectedUser,
  loading: state.users.status.fetchById.loading,
  error: state.users.status.fetchById.error
});

export const selectCurrentUser = (state) => state.users.selectedUser;

export const selectRegisterStatus = (state) => state.users.status.register;
