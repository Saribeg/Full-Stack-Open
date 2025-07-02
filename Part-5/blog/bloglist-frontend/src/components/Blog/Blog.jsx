import { useState } from 'react';
import blogService from '../../services/blogs';
import './blog.css';

const Blog = ({ blog, user, modifyBlogs, notify }) => {
  const [expanded, setExpanded] = useState(false);

  const handleBlogUpdate = async () => {
    try {
      const updatedBlog = await blogService.update({ ...blog, likes: blog.likes + 1 });
      modifyBlogs('update', updatedBlog);
      notify({
        message: `Blog ${updatedBlog.title} is successfully updated`,
        type: 'success'
      });
    } catch(error){
      notify({
        message: error.message,
        type: 'error'
      });
    }
  };

  const handleBlogDelete = async () => {
    try {
      await blogService.deleteBlog(blog.id);
      modifyBlogs('delete', { id: blog.id });
      notify({
        message: `Blog ${blog.title} is successfully deleted`,
        type: 'success'
      });
    } catch(error){
      notify({
        message: error.message,
        type: 'error'
      });
    }
  };

  return (
    <div
      className={`blog-card ${expanded ? 'expanded' : ''}`}
    >
      <div className="blog-title" onClick={() => setExpanded(!expanded)}>
        {blog.title} <span className="blog-author">by {blog.author}</span>
      </div>

      {expanded && (
        <div className="blog-details">
          <div>Author: {blog.author || 'unknown'}</div>
          <div>URL: <a href={blog.url}>{blog.url}</a></div>
          <div className='blog-likes'>
            <div>Likes: {blog.likes}</div>
            <button className='blog-like' onClick={handleBlogUpdate}>❤️ Like</button>
          </div>
          {blog.user?.name && <div>User: {blog.user.name}</div>}
          {user?.id === blog.user?.id ? <button onClick={handleBlogDelete}>Delete</button> : null}
        </div>
      )}
    </div>
  );
};

export default Blog;