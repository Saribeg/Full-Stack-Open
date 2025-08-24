import { useContext, useEffect, useState } from 'react';
import { Snackbar, Alert, LinearProgress, Box, Slide  } from '@mui/material';

import NotificationContext from '../contexts/NotificationContext';
import { uiConfigs } from '../utils/uiConfigs';

const Notification = () => {
  const { notification, notificationDispatch } = useContext(NotificationContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (notification?.message) {
      setOpen(true);
    }
  }, [notification]);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    notificationDispatch({ type: 'HIDE_MESSAGE' });
  };

  if (!notification) return null;

  const { message, type, duration } = notification;
  const notificationDuration = duration || uiConfigs.notificationDuration;

  return (
    <Snackbar
      open={open}
      autoHideDuration={notificationDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      slots={{ transition: Slide }}
    >
      <Alert
        data-testid={`alert-${type || 'info'}`}
        onClose={handleClose}
        severity={type || 'info'}
        variant="filled"
        sx={{
          width: 400,
          minHeight: 64,
          px: 3,
          py: 2,
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          boxShadow: 3
        }}
      >
        <Box sx={{ flexGrow: 1, wordBreak: 'break-word' }}>{message}</Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%'
          }}
        >
          <LinearProgress
            color="inherit"
            variant="determinate"
            value={open ? 100 : 0}
            sx={{
              animation: `${notificationDuration}ms linear forwards progressFade`,
              '@keyframes progressFade': {
                '0%': { width: '100%' },
                '100%': { width: '0%' }
              }
            }}
          />
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default Notification;
