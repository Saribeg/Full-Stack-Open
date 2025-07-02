import { useState } from 'react';
import blogService from '../../services/blogs';
import './blog.css';

const Blog = ({ blog, updateBlog, notify }) => {
  const [expanded, setExpanded] = useState(false);

  const handleBlogUpdate = async () => {
    try {
      const updatedBlog = await blogService.update({ ...blog, likes: blog.likes + 1 });
      updateBlog(updatedBlog);
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
        </div>
      )}
    </div>
  );
};

export default Blog;