import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Typography
} from '@mui/material';

const BlogTable = ({ blogs }) => (
  <TableContainer component={Paper} elevation={3}>
    <Table>
      <TableHead>
        <TableRow
          sx={{
            backgroundColor: 'grey.200'
          }}
        >
          <TableCell>
            <Typography variant="subtitle1" fontWeight={600}>
              Title
            </Typography>
          </TableCell>
          <TableCell>
            <Typography variant="subtitle1" fontWeight={600}>
              Author
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {blogs.map((blog) => (
          <TableRow
            key={blog.id}
            hover
          >
            <TableCell>
              <Link
                component={RouterLink}
                to={`/blogs/${blog.id}`}
                underline="hover"
                color="primary"
              >
                {blog.title}
              </Link>
            </TableCell>
            <TableCell>{blog.author}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

BlogTable.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired
    })
  ).isRequired
};

export default BlogTable;
