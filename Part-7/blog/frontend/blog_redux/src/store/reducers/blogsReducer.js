import { createSlice } from '@reduxjs/toolkit';
import blogService from '../../services/blogs';

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogList: [],
    selectedBlog: null
  },
  reducers: {
    setBlogs(state, action) {
      state.blogList = action.payload;
    },
    addBlog(state, action) {
      state.blogList.push(action.payload);
    },
    updateBlog(state, action) {
      const updated = action.payload;
      state.blogList = state.blogList.map((b) => (b.id !== updated.id ? b : updated));
    },
    deleteBlog(state, action) {
      const id = action.payload;
      state.blogList = state.blogList.filter((b) => b.id !== id);
    },
    setSelectedBlog(state, action) {
      state.selectedBlog = action.payload;
    },
    addComment(state, action) {
      state.selectedBlog = action.payload;
    }
  }
});

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = ({ title, author, url }) => {
  return async (dispatch) => {
    const newBlog = await blogService.create({ title, author, url });
    dispatch(addBlog(newBlog));
    return newBlog;
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updated = await blogService.update({ ...blog, likes: blog.likes + 1 });
    dispatch(updateBlog(updated));
    return updated;
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id);
    dispatch(deleteBlogAction(id));
  };
};

export const getBlogById = (id) => {
  return async (dispatch) => {
    const blog = await blogService.getById(id);
    dispatch(setSelectedBlog(blog));
  };
};

export const createComment = ({ id, comment }) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.createComment({ id, comment });
    dispatch(addComment(updatedBlog));
  };
};

export const {
  setBlogs,
  addBlog,
  updateBlog,
  deleteBlog: deleteBlogAction,
  setSelectedBlog,
  addComment
} = blogsSlice.actions;
export default blogsSlice.reducer;
