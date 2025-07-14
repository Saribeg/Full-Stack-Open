import { createSelector } from 'reselect';

export const selectBlogsState = (state) => ({
  blogs: state.blogs.blogList,
  loading: state.blogs.status.fetch.loading,
  error: state.blogs.status.fetch.error
});

export const selectAllBlogs = (state) => state.blogs.blogList;

export const selectSortedBlogs = createSelector([selectAllBlogs], (blogs) =>
  [...blogs].sort((a, b) => b.likes - a.likes)
);

export const selectVisibleBlogsState = createSelector(
  [
    selectSortedBlogs,
    (state) => state.blogs.status.fetch.loading,
    (state) => state.blogs.status.fetch.error
  ],
  (sortedBlogs, loading, error) => ({
    blogs: sortedBlogs,
    loading,
    error
  })
);

export const selectCreateBlogStatus = (state) => state.blogs.status.create;
