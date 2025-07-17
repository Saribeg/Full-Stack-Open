import PropTypes from 'prop-types';
import TextLink from '../ui/TextLink';
import { AutoTable } from '../ui/Table';

const BlogTable = ({ blogs }) => (
  <AutoTable
    titles={['Title', 'Author']}
    listToRender={blogs}
    cellProps={['title', 'author']}
    getCellContent={(blog, prop) =>
      prop === 'title' ? <TextLink to={`/blogs/${blog.id}`}>{blog.title}</TextLink> : blog[prop]
    }
  />
);

export default BlogTable;

BlogTable.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired
    })
  ).isRequired
};
