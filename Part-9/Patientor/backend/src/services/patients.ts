import { v1 as uuid } from 'uuid';
import patients from '../data/patients';
import { Patient, NonSensitivePatientEntry } from '../types';
import { NewPatient } from '../validation/patients';
import { NewEntry } from '../validation/entries';

const getPatients = () : Patient[] => {
  return patients;
};

const getNonSensitivePatientEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addPatient = (patient: NewPatient) : Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
    entries: []
  };

  patients.push(newPatient);

  return newPatient;
};

const addEntry = (patientId: string, entry: NewEntry) => {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    throw new Error('PATIENT_NOT_FOUND');
  }

  const newEntry = {
    id: uuid(),
    ...entry
  };

  patient.entries.push(newEntry);

  return newEntry;
};


export default {
  getPatients,
  getNonSensitivePatientEntries,
  getPatientById,
  addPatient,
  addEntry
};