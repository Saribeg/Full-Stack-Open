import { z } from 'zod';
import { HealthCheckRating } from '../types';

const BaseEntry = z.object({
  description: z.string().min(1),
  date: z.iso.date(),
  specialist: z.string().min(1),
  diagnosisCodes: z.array(z.string()).optional(),
});

const HealthCheckEntrySchema = BaseEntry.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.enum(HealthCheckRating),
});

const HospitalEntrySchema = BaseEntry.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.iso.date(),
    criteria: z.string().min(1),
  }),
});

const OccupationalHealthcareEntrySchema = BaseEntry.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string().min(1),
  sickLeave: z
    .object({
      startDate: z.iso.date(),
      endDate: z.iso.date(),
    })
    .optional(),
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
]);

export type NewEntry = z.infer<typeof NewEntrySchema>;
