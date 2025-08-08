import express from 'express';
import patientsService from '../services/patients';
import { preparePatientData } from '../validation/patients';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientsService.getNonSensitivePatientEntries();
  res.send(patients);
});

router.post('/', (req, res) => {
  try {
    const patientData = preparePatientData(req.body);
    const addedPatient = patientsService.addPatient(patientData);
    res.status(201).json(addedPatient);
  } catch (error) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }

});

export default router;