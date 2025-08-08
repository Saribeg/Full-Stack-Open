import { NewPatient } from '../types';
import { parseString, parseDate, parseGender } from './utils';

export const preparePatientData = (requestBody: unknown): NewPatient => {
  if ( !requestBody || typeof requestBody !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if (
    'name' in requestBody
    && 'dateOfBirth' in requestBody
    && 'ssn' in requestBody
    && 'gender' in requestBody
    && 'occupation' in requestBody
  ) {
    const newPatient : NewPatient = {
      name: parseString(requestBody.name, 'name'),
      dateOfBirth: parseDate(requestBody.dateOfBirth),
      ssn: parseString(requestBody.ssn, 'ssn'),
      gender: parseGender(requestBody.gender),
      occupation: parseString(requestBody.occupation, 'occupation')
    };

    return newPatient;
  }

  throw new Error('Incorrect data: some fields are missing');
};