import { useState } from 'react';
import './blog.css';

const Blog = ({ blog }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`blog-card ${expanded ? 'expanded' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="blog-title">
        {blog.title} <span className="blog-author">by {blog.author}</span>
      </div>

      {expanded && (
        <div className="blog-details">
          <div>Author: {blog.author || 'unknown'}</div>
          <div>URL: <a href={blog.url}>{blog.url}</a></div>
          <div>Likes: {blog.likes}</div>
          {blog.user?.name && <div>User: {blog.user.name}</div>}
        </div>
      )}
    </div>
  );
};

export default Blog;