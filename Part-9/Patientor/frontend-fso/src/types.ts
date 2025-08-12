type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

// Entry
export const HealthCheckRating = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3,
} as const;
export type HealthCheckRating = typeof HealthCheckRating[keyof typeof HealthCheckRating];

export interface SickLeave {
  startDate: string,
  endDate: string,
}

interface Discharge {
  date: string,
  criteria: string,
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

interface HospitalEntry extends BaseEntry {
  type: 'Hospital';
  discharge: Discharge;
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare';
  employerName: string;
  sickLeave?: SickLeave
}

interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck';
  healthCheckRating: HealthCheckRating;
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export type EntryWithoutId = UnionOmit<Entry, 'id'>;

// Patient
export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries?: Entry[];
}

export type PatientFormValues = Omit<Patient, 'id' | 'entries'>;

// Error
export type ApiErrorCause = {
  status?: number;
  code?: string;
  url?: string;
  method?: string;
  data?: unknown;
  isNetworkError?: boolean;
  isTimeout?: boolean;
};
export type PublicErrorInfo = { message: string } & Omit<ApiErrorCause, 'data'>;
export type ErrorWithCause = Error & { cause?: unknown };
