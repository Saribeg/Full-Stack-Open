import { api } from './api';
import { Diagnosis } from '../types';

const getAll = async (): Promise<Diagnosis[]> => {
  const { data } = await api.get<Diagnosis[]>('/diagnoses');
  return data;
};

export default {
  getAll
};