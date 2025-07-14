// I was thinking about how to reduce the boilerplate code that comes with handling async thunks.
// After discussing a few options with AI, I landed on this wrapper.
// The goal was to simulate a chainable API where each call handles all 3 typical cases —
// pending, fulfilled, and rejected — in one go, instead of repeating addCase three times manually.
export const addCases = (builder) => {
  const api = {
    // Use if you need 3 typical cases per 1 resourse
    for: (asyncThunk, key, { fulfilled, rejected } = {}) => {
      builder
        .addCase(asyncThunk.pending, (state) => {
          state.status[key].loading = true;
          state.status[key].error = null;
        })
        .addCase(asyncThunk.fulfilled, (state, action) => {
          state.status[key].loading = false;
          fulfilled?.(state, action);
        })
        .addCase(asyncThunk.rejected, (state, action) => {
          state.status[key].loading = false;
          state.status[key].error = action.payload?.message || action.error.message;
          rejected?.(state, action);
        });

      return api;
    },
    // Use if you need additional 1 case, for example for cleanup
    also: (actionCreatorOrType, reducer) => {
      builder.addCase(actionCreatorOrType, reducer);
      return api;
    }
  };

  return api;
};
