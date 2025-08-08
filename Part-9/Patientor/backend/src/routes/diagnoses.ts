import express from 'express';
import diagnosesService from '../services/diagnoses';

const router = express.Router();

router.get('/', (_req, res) => {
  const diagnoses = diagnosesService.getDiagnoses();
  res.send(diagnoses);
});

export default router;