import { Stack, Typography } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';

import type { Entry } from '../../types';
import { assertNever } from '../../utils';

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case 'Hospital':
      return (
        <Stack spacing={0.5}>
          <Stack direction='row' spacing={1} alignItems='center'>
            <LocalHospitalIcon fontSize='small' />
            <Typography variant='subtitle2'>Hospital</Typography>
          </Stack>
          <Typography variant='body2'>
            <strong>Discharge:</strong> {entry.discharge.date} — {entry.discharge.criteria}
          </Typography>
        </Stack>
      );

    case 'OccupationalHealthcare':
      return (
        <Stack spacing={0.5}>
          <Stack direction='row' spacing={1} alignItems='center'>
            <WorkIcon fontSize='small' />
            <Typography variant='subtitle2'>Occupational healthcare</Typography>
          </Stack>
          <Typography variant='body2'>
            <strong>Employer:</strong> {entry.employerName}
          </Typography>
          {entry.sickLeave && (
            <Typography variant='body2'>
              <strong>Sick leave:</strong> {entry.sickLeave.startDate} – {entry.sickLeave.endDate}
            </Typography>
          )}
        </Stack>
      );

    case 'HealthCheck': {
      const colorByRating = {
        0: 'success.main',
        1: 'warning.main',
        2: 'error.main',
        3: 'text.disabled',
      } as const;

      return (
        <Stack spacing={0.5}>
          <Stack direction='row' spacing={1} alignItems='center'>
            <FavoriteIcon
              fontSize='small'
              sx={{ color: colorByRating[entry.healthCheckRating] }}
            />
            <Typography variant='subtitle2'>Health check</Typography>
          </Stack>
          <Typography variant='body2'>
            <strong>Health check rating:</strong> {entry.healthCheckRating}
          </Typography>
        </Stack>
      );
    }

    default:
      return assertNever(entry);
  }
};

export default EntryDetails;