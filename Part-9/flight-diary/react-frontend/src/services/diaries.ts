import { api } from './api';
import type { DiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = '/diaries';

export const getDiaries = async (): Promise<DiaryEntry[]> => {
  const { data } = await api.get<DiaryEntry[]>(baseUrl);
  return data;
};

export const createDiary = async (diaryData: NewDiaryEntry): Promise<DiaryEntry> => {
  const { data } = await api.post<DiaryEntry>(baseUrl, diaryData);
  return data;
};