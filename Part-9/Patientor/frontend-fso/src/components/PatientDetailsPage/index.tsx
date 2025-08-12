import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, Typography, Stack, Chip, Button, Divider } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';

import PatienEntries from './PatienEntries';
import SidePanel from '../SidePanel';
import NewEntryForm from './NewEntryForm';
import { Patient, Diagnosis } from '../../types';
import patientService from '../../services/patients';
import diagnosisService from '../../services/diagnoses';
import { handleApiError } from '../../utils';

const PatientDetailsPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState<boolean>(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate('/404', { replace: true });
      return;
    }

    patientService
      .getById(id)
      .then(setPatient)
      .catch((e) => {
        handleApiError(e, navigate, setError);
      });
  }, [id, navigate]);

  useEffect(() => {
    diagnosisService
      .getAll()
      .then(setDiagnoses)
      .catch((e) => {
        handleApiError(e, navigate, setError);
      });
  }, [navigate]);

  if (!patient) return <div>Loading...</div>;

  return (
    <>
      {error && (
        <div style={{ width: '100%', marginBottom: 16 }}>
          <Typography
            variant='body1'
            sx={{
              backgroundColor: 'error.main',
              color: 'error.contrastText',
              padding: 2,
              borderRadius: 1,
              whiteSpace: 'pre-line',
            }}
          >
            {error}
          </Typography>
        </div>
      )}
      <Card>
        <CardHeader
          title={
            <Stack direction='row' alignItems='center' spacing={1}>
              <Typography variant='h5'>{patient.name}</Typography>
              {patient.gender === 'female' && <FemaleIcon fontSize='small' color='primary' />}
              {patient.gender === 'male' && <MaleIcon fontSize='small' color='primary' />}
              {patient.gender === 'other' && <TransgenderIcon fontSize='small' color='primary' />}
            </Stack>
          }
          subheader={patient.occupation}
        />
        <CardContent>
          <Stack direction='row' spacing={1} flexWrap='wrap'>
            {patient.dateOfBirth && <Chip label={`DOB: ${patient.dateOfBirth}`} variant='outlined' />}
            {patient.ssn && <Chip label={`SSN: ${patient.ssn}`} variant='outlined' />}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Button variant='contained' onClick={() => setSidePanelOpen(true)} sx={{ mb: '10px'}}>
            Add Entry
          </Button>
          {patient.entries?.length ? <PatienEntries entries={patient.entries} diagnoses={diagnoses}/> : null}
        </CardContent>
      </Card>

      <SidePanel
        open={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
        title='Add New Entry'
        width={800}
      >
        <NewEntryForm patientId={patient.id} diagnoses={diagnoses} setError={setError} setPatient={setPatient} setSidePanelOpen={setSidePanelOpen}/>
      </SidePanel>
    </>

  );
};

export default PatientDetailsPage;