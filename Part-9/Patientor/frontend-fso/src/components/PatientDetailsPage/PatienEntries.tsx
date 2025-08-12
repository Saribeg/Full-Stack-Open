import { useMemo } from 'react';
import { Card, CardContent, Typography, Stack, Chip, Divider } from '@mui/material';

import { Entry, Diagnosis } from '../../types';

import EntryDetails from './EntryDetails';

type EntryWithDiagnoses = Entry & { diagnoses?: Diagnosis[] };

type PatienEntriesType = {
  entries: Entry[]
  diagnoses: Diagnosis[]
};

const PatienEntries = ({ entries, diagnoses }: PatienEntriesType) => {

  // Creates a Map for quick access to a diagnosis object by its code.
  // useMemo: prevents recreating the Map on every render, only updates when diagnoses change.
  const diagnosesByCode = useMemo(() => {
    return new Map(
      diagnoses.map((diagnosis) => [diagnosis.code, diagnosis] as const)
    );
  }, [diagnoses]);

  const entriesWithDiagnoses: EntryWithDiagnoses[] = useMemo(() =>
    entries.map((entry) => {
      if (!entry.diagnosisCodes?.length) return entry;

      const diagnosesForEntry = entry.diagnosisCodes
        .map(code => diagnosesByCode.get(code))
        .filter((diagnosis): diagnosis is Diagnosis => Boolean(diagnosis));

      return { ...entry, diagnoses: diagnosesForEntry };
    }),
  [entries, diagnosesByCode]);

  return (
    <>
      <Typography variant='h6' gutterBottom>
        Entries
      </Typography>
      {entriesWithDiagnoses.map((entry) => (
        <Card
          key={entry.id}
          variant='outlined'
          sx={{ mb: 1.5, boxShadow: 2 }}
        >
          <CardContent>
            <Stack direction='row' alignItems='center' spacing={1}>
              <Typography variant='subtitle1'>{entry.date}</Typography>
              <Chip size='small' label={entry.type} />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant='body1'
              fontWeight='medium'
              sx={{ mt: 1 }}
            >
              {entry.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {!!entry.diagnoses?.length && (
              <>
                <Stack sx={{ mt: 1 }} spacing={0.75}>
                  <Typography variant='subtitle2'><strong>Diagnoses</strong></Typography>
                  {entry.diagnoses.map((diagnosis) => (
                    <Stack
                      key={diagnosis.code}
                      direction='row'
                      spacing={1}
                      alignItems='center'
                      flexWrap='wrap'
                    >
                      <Chip label={diagnosis.code} size='small' variant='outlined' />
                      <Typography variant='body2'>{diagnosis.name}</Typography>
                    </Stack>
                  ))}
                </Stack>

                <Divider sx={{ my: 2 }} />
              </>
            )}

            <EntryDetails entry={entry} />
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default PatienEntries;