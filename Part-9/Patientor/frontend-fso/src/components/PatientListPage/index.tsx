import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Table, Button, TableHead, Typography, TableCell, TableRow, TableBody } from '@mui/material';

import { PatientFormValues, Patient } from '../../types';

import AddPatientModal from '../AddPatientModal';
import HealthRatingBar from '../HealthRatingBar';

import patientService from '../../services/patients';

import { handleApiError } from '../../utils';

interface Props {
  patients : Patient[]
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
}

const PatientListPage = ({ patients, setPatients } : Props ) => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(null);
  };

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      const patient = await patientService.create(values);
      setPatients(patients.concat(patient));
      setModalOpen(false);
    } catch (e) {
      handleApiError(e, navigate, setError);
    }
  };

  return (
    <div className='App'>
      <Box>
        <Typography align='center' variant='h6'>
          Patient list
        </Typography>
      </Box>
      <Table style={{ marginBottom: '1em' }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
            <TableCell>Health Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(patients).map((patient: Patient) => (
            <TableRow key={patient.id}>
              <TableCell><Link to={`/patients/${patient.id}`}>{patient.name}</Link></TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.occupation}</TableCell>
              <TableCell>
                <HealthRatingBar showText={false} rating={1} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        error={error ?? undefined}
        onClose={closeModal}
      />
      <Button variant='contained' onClick={() => openModal()}>
        Add New Patient
      </Button>
    </div>
  );
};

export default PatientListPage;
