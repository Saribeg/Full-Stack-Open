import PropTypes from 'prop-types';
import EntityNotFound from '../EntityNotFound';

const BlogNotFound = ({ id }) => (
  <EntityNotFound
    message={
      <>
        The blog with ID <span className="font-semibold text-white">{id}</span> was not found or may
        have been removed.
      </>
    }
    redirectTo="/blogs"
    buttonText="Back to blogs"
    notificationPlacement="BlogDetails"
  />
);

BlogNotFound.propTypes = {
  id: PropTypes.string
};

export default BlogNotFound;
