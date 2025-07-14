export const selectAuth = (state) => state.auth.user;
export const selectLoginStatus = (state) => state.auth.status.login;
export const selectLogoutStatus = (state) => state.auth.status.logout;
export const selectInitializeStatus = (state) => state.auth.status.initialize;

export const selectAuthReady = (state) => ({
  user: state.auth.user,
  loading: state.auth.status.initialize.loading,
  error: state.auth.status.initialize.error
});
