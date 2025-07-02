import Blog from './Blog/Blog';

const BlogList = ({ blogs, user, modifyBlogs, notify }) => {
  return (
    <div>
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          modifyBlogs={modifyBlogs}
          notify={notify}
        />
      )}
    </div>
  );
};

export default BlogList;