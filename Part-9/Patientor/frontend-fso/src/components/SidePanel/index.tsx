import { Drawer, Box, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode } from 'react';

type SidePanelProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: number | string;
  children: ReactNode;
};

const SidePanel = ({ open, onClose, title, width = 400, children }: SidePanelProps) => {
  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width, boxShadow: 6 }
      }}
      ModalProps={{ keepMounted: true }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        {title && <Typography variant='h6' sx={{ flexGrow: 1 }}>{title}</Typography>}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ p: 2, overflowY: 'auto', flexGrow: 1 }}>
        {children}
      </Box>
    </Drawer>
  );
};

export default SidePanel;
