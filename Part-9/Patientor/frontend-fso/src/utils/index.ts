import type { NavigateFunction } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';

import type { PublicErrorInfo } from '../types';
import type { ErrorWithCause } from '../types';

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

export const getErrorInfo = (e: unknown): PublicErrorInfo => {
  const err: ErrorWithCause = e instanceof Error ? e : new Error(String(e));
  const c = isObj(err.cause) ? err.cause : undefined;

  return {
    message: err.message,
    status: typeof c?.status === 'number' ? c.status : undefined,
    code: typeof c?.code === 'string' ? c.code : undefined,
    url: typeof c?.url === 'string' ? c.url : undefined,
    method: typeof c?.method === 'string' ? String(c.method).toUpperCase() : undefined,
    isNetworkError: c?.isNetworkError === true ? true : undefined,
    isTimeout: c?.isTimeout === true ? true : undefined,
  };
};

export const handleApiError = (
  e: unknown,
  navigate: NavigateFunction,
  setError: Dispatch<SetStateAction<string | null>>,
) => {
  const info = getErrorInfo(e);

  if (info.status === 404) {
    navigate('/404', { replace: true });
    return;
  }
  if (info.isNetworkError) {
    setError('Network error. Please check your connection and try again.');
    return;
  }
  if (info.isTimeout) {
    setError('Request timed out. Please try again.');
    return;
  }
  setError(info.message || 'Unexpected error');
};

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export const isNonEmptyString = (value: string | undefined | null) => {
  const hasValue = Boolean(value);
  const notJustSpaces = value?.trim() !== '';
  return hasValue && notJustSpaces;
};
