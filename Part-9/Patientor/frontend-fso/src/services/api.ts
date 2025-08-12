import axios from 'axios';
import { ApiErrorCause } from '../types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15000
});

/**
 * Type guard: narrows "unknown" to a plain JSON-like object.
 * - If returns `true`, TS treats the value as `Record<string, unknown>` (safe key access).
 * - Must be a non-null object, not an array, and not special built-ins
 *   (Date, Map, Set, Error, RegExp, Promise, etc.).
 *
 * Use when parsing API payloads like: { message: "...", error: "...", ... }.
 */
export const isPlainRecord = (v: unknown): v is Record<string, unknown> => {
  if (typeof v !== 'object' || v === null) return false;
  if (Array.isArray(v)) return false;

  // Filters out Date, Map, Set, Error, RegExp, etc.
  if (Object.prototype.toString.call(v) !== '[object Object]') return false;

  // Filters out objects with a custom prototype (class instances, Error, Date, etc.);
  // allows only {} and Object.create(null)
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
};

const formatZodErrors = (errors: unknown): string | undefined => {
  if (!Array.isArray(errors)) return;

  const lines = errors
    .filter(isPlainRecord)
    .map(err => {
      const path = Array.isArray(err.path) ? err.path.join('.') : 'unknown';
      const msg = typeof err.message === 'string' ? err.message : 'Invalid value';
      return `Field "${path}" - Error "${msg}"`;
    });

  return lines.length ? lines.join('\n') : undefined;
};

api.interceptors.response.use(
  (res) => res,
  (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const url = err.config?.url;
      const method = err.config?.method?.toUpperCase();
      const code = err.code;
      const data = err.response?.data;

      // Human-friendly message extraction from common API shapes
      let message = err.message;
      if (typeof data === 'string') {
        message = data;
      } else if (isPlainRecord(data)) {
        // Basic version: for APIs that return either `error` or `message` (only one is expected)
        const zodMessage = formatZodErrors(data.error);
        if (zodMessage) {
          message = zodMessage;
        } else {
          if (typeof data.error === 'string') {
            message = data.error;
          } else if (typeof data.message === 'string') {
            message = data.message;
          }
        }
        const maybeError = data.error;
        const maybeMessage = data.message;
        if (typeof maybeError === 'string') {
          message = maybeError;
        } else if (typeof maybeMessage === 'string') {
          message = maybeMessage;
        }
      }

      // Network-level failure (no response at all)
      if (!status && err.request && !err.response) {
        message ||= 'Network error';
      }

      /**
       * Architectural note:
       * - We KEEP the original AxiosError object (preserves stack, config, request/response).
       * - We NORMALIZE useful details into `error.cause` (ES2022) so consumers don't need
       *   to know Axios internals (response/config) or import axios in UI code.
       * - In catch blocks you can treat it as plain `Error` and, if needed, read a uniform
       *   envelope from `error.cause` (status, code, url, method, data, flags).
       */
      const extendedError = err as Error & { cause?: ApiErrorCause };

      if (message) extendedError.message = message;

      // ES2022: attach a single, normalized "passport" of details
      extendedError.cause = {
        status,
        code,
        url,
        method,
        data,
        isNetworkError: !!(err.request && !err.response),
        isTimeout: code === 'ECONNABORTED',
      };
      return Promise.reject(extendedError);
    }

    // Non-Axios errors — preserve as-is if it's already an Error; otherwise wrap and keep original in `cause`
    if (err instanceof Error) {
      return Promise.reject(err);
    }

    return Promise.reject(new Error('Non-Axios error', { cause: err }));
  }
);