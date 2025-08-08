import { z } from 'zod';
import { Gender } from '../types';

export const NewPatientSchema = z.object({
  name: z.string().min(1),
  dateOfBirth: z.iso.date(),
  ssn: z.string().min(1),
  gender: z.enum(Gender),
  occupation: z.string().min(1),
});

export type NewPatient = z.infer<typeof NewPatientSchema>;
