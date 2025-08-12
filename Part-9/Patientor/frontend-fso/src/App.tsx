import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Divider, Container, Typography } from '@mui/material';

import { Patient } from './types';

import patientService from './services/patients';
import healthService from './services/health';
import PatientListPage from './components/PatientListPage';
import PatientDetailsPage from './components/PatientDetailsPage';
import NotFound from './components/NotFound';

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    void healthService.ping();

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  return (
    <div className='App'>
      <Router>
        <Container>
          <Typography
            variant='h3'
            component={Link}
            to='/'
            sx={{
              marginBottom: '0.5em',
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'none',
              },
            }}
          >
            Patientor
          </Typography>
          <Divider hidden />
          <Routes>
            <Route path='/' element={<PatientListPage patients={patients} setPatients={setPatients} />} />
            <Route path='/patients/:id' element={<PatientDetailsPage />} />
            <Route path='/404' element={<NotFound />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
