import blogService from '../services/blogs';

const BlogForm = ({ blogTitle, setBlogTitle, blogAuthor, setBlogAuthor, blogUrl, setBlogUrl, setBlogs, notify }) => {
  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const resetForm = () => {
    setBlogTitle('');
    setBlogAuthor('');
    setBlogUrl('');
  };

  const handleBlogCreation = async (event) => {
    event.preventDefault();
    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    };

    try {
      var createdBlog = await blogService.create(newBlog);
      setBlogs(prev => prev.concat(createdBlog));
      resetForm();
      notify({
        message: `Blog ${createdBlog.title} is successfully created`,
        type: 'success'
      });
    } catch (error) {
      notify({
        message: error.message,
        type: 'error'
      });
    }
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={handleBlogCreation}>
        <div className="form-group">
          <label htmlFor="blogTitle">Title:</label>
          <input type="text" id="blogTitle" name="blogTitle" required value={blogTitle} onChange={handleChange(setBlogTitle)}/>
        </div>

        <div className="form-group">
          <label htmlFor="blogAuthor">Author:</label>
          <input type="text" id="blogAuthor" name="blogAuthor" required value={blogAuthor} onChange={handleChange(setBlogAuthor)}/>
        </div>

        <div className="form-group">
          <label htmlFor="blogUrl">Url:</label>
          <input type="text" id="blogUrl" name="blogUrl" required value={blogUrl} onChange={handleChange(setBlogUrl)}/>
        </div>

        <div className="form-actions">
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;