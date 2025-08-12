import { api } from './api';
import { Patient, PatientFormValues, EntryWithoutId, Entry } from '../types';

const getAll = async (): Promise<Patient[]> => {
  const { data } = await api.get<Patient[]>('/patients');
  return data;
};

const getById = async (id: string): Promise<Patient> => {
  const { data } = await api.get<Patient>(`/patients/${id}`);
  return data;
};

const create = async (patientData: PatientFormValues): Promise<Patient> => {
  const { data } = await api.post<Patient>('/patients',patientData);
  return data;
};

const addEntry = async (patientId: string, newEntryData: EntryWithoutId): Promise<Entry> => {
  const { data } = await api.post<Entry>(`/patients/${patientId}/entries`,newEntryData);
  return data;
};

export default {
  getAll, getById, create, addEntry
};

