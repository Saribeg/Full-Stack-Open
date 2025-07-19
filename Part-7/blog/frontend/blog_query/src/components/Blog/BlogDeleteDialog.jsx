import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

const BlogDeleteDialog = ({ open, onClose, onConfirm, blog }) => (
  <Dialog
    open={open}
    onClose={onClose}
  >
    <DialogTitle>Delete Blog?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete blog <strong>{blog.title}</strong> by <strong>{blog.author}</strong>?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="outlined">Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

BlogDeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  blog: PropTypes.object.isRequired
};

export default BlogDeleteDialog;
