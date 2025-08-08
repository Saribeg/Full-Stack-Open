import { v1 as uuid } from 'uuid';
import patients from '../data/patients';
import { Patient, NonSensitivePatientEntry } from '../types';
import { NewPatient } from '../validation/patients';

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

const addPatient = (patient: NewPatient) : Patient => {
  const newPatient = {
    id: uuid(),
    ...patient
  };

  patients.push(newPatient);

  return newPatient;
};


export default {
  getPatients,
  getNonSensitivePatientEntries,
  addPatient
};