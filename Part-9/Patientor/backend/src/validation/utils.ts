import { Gender } from '../types';

export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

// We still need to validate "!value" for falsy values even if we are
// checking the presence of field in object with "in" operator.
export const parseString = (value: unknown, key: string): string => {
  if (!value || !isString(value)) {
    throw new Error(`Incorrect property "${key}". Current value "${value}"`);
  }

  return value;
};

export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

export const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

export const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

export const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};