import axios, { AxiosError } from 'axios';

export const api = axios.create({ baseURL: '/api' });

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    let message = err.message;
    const data = err.response?.data;

    if (typeof data === 'string') {
      message = data;
    } else if (typeof data === 'object' && data !== null) {
      if ('error' in data && typeof (data as { error: unknown }).error === 'string') {
        message = (data as { error: string }).error;
      } else if ('message' in data && typeof (data as { message: unknown }).message === 'string') {
        message = (data as { message: string }).message;
      }
    }

    return Promise.reject(new Error(message || 'Something went wrong'));
  }
);
