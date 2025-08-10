export interface Entry {
}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries?: Entry[];
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;

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
