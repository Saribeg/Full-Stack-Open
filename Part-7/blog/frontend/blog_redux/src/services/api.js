// I was looking for a way to centralize error data collection
// and decided to use interceptor as an option.
import axios from 'axios';
import { safeParseJSON } from '../utils/commonHelpers';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export function setToken(token) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearToken() {
  delete api.defaults.headers.common.Authorization;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, request, config, message, code } = error;

    const customErrorData = {
      message: response?.data?.error || message || 'Unknown error',
      status: response?.status || null,
      statusText: response?.statusText || null,
      url: config?.url || null,
      method: config?.method || null,
      data: config?.data ? safeParseJSON(config.data) : null,
      headers: config?.headers || null,
      isNetworkError: !response && !!request,
      code: code || null,
      originalError: error
    };
    return Promise.reject(customErrorData);
  }
);

export default api;
