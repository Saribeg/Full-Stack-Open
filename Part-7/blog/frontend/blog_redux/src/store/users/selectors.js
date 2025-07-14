export const selectUsersState = (state) => ({
  users: state.users.userList,
  loading: state.users.status.fetch.loading,
  error: state.users.status.fetch.error
});

export const selectAllUsers = (state) => state.users.userList;

export const selectUserDetailsState = (state) => ({
  user: state.users.selectedUser,
  loading: state.users.status.fetchById.loading,
  error: state.users.status.fetchById.error
});

export const selectCurrentUser = (state) => state.users.selectedUser;
