import { api } from './api';
import { Patient, PatientFormValues, EntryWithoutId } from '../types';

import { apiBaseUrl } from '../constants';

const getAll = async () => {
  const { data } = await api.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const getById = async (id: string) => {
  const { data } = await api.get<Patient>(
    `${apiBaseUrl}/patients/${id}`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await api.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const addEntry = async (patientId: string, newEntryData: EntryWithoutId) => {
  const { data } = await api.post(
    `${apiBaseUrl}/patients/${patientId}/entries`,
    newEntryData
  );

  return data;
};

export default {
  getAll, getById, create, addEntry
};

