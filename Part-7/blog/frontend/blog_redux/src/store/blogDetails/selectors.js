export const selectBlogDetailsState = (state) => ({
  blog: state.blogDetails.blog,
  loading: state.blogDetails.status.fetch.loading,
  error: state.blogDetails.status.fetch.error
});

export const selectCurrentBlog = (state) => state.blogDetails.blog;

export const selectCreateCommentStatus = (state) => state.blogDetails.status.comment;

export const selectLikeBlogStatus = (state) => state.blogDetails.status.like;

export const selectDeleteBlogStatus = (state) => state.blogDetails.status.delete;

export const selectUpdateCommentStatus = (state) => state.blogDetails.status.updateComment;

export const selectDeleteCommentStatus = (state) => state.blogDetails.status.deleteComment;
