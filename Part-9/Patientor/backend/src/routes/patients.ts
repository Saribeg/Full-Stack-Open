import express from 'express';
import { z } from 'zod';
import patientsService from '../services/patients';
import { NewPatientSchema } from '../validation/patients';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientsService.getNonSensitivePatientEntries();
  res.send(patients);
});

router.post('/', (req, res) => {
  try {
    const patientData = NewPatientSchema.parse(req.body);
    const addedPatient = patientsService.addPatient(patientData);
    res.status(201).json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else {
      res.status(400).json({ error: 'Unknown error' });
    }
  }

});

export default router;