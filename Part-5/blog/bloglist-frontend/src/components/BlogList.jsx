import Blog from './Blog/Blog';

const BlogList = ({ blogs, updateBlog, notify }) => {
  return (
    <div>
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} notify={notify}/>
      )}
    </div>
  );
};

export default BlogList;