import express from 'express';
import { z } from 'zod';
import patientsService from '../services/patients';
import { NewPatientSchema } from '../validation/patients';
import { NewEntrySchema } from '../validation/entries';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientsService.getNonSensitivePatientEntries();
  res.send(patients);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const patient = patientsService.getPatientById(id);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  return res.json(patient);
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

router.post('/:id/entries', (req, res) => {
  const { id } = req.params;

  try {
    const entryData = NewEntrySchema.parse(req.body);
    const addedEntry = patientsService.addEntry(id, entryData);
    res.status(201).json(addedEntry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else if (error instanceof Error && error.message === 'PATIENT_NOT_FOUND') {
      res.status(404).json({ error: 'Patient not found' });
    } else {
      res.status(400).json({ error: 'Unknown error' });
    }
  }
});

export default router;