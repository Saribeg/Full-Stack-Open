import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const PageTitle = ({ children, variant = 'h2', component = 'h2', ...props }) => {
  return (
    <Typography variant={variant} component={component} {...props}>
      {children}
    </Typography>
  );
};

PageTitle.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  component: PropTypes.string
};


export default PageTitle;
