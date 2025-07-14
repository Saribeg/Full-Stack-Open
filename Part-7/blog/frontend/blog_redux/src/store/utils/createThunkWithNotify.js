import { createAsyncThunk } from '@reduxjs/toolkit';
import { notificationRules } from './notificationRules';

export const createThunkWithNotify = (typePrefix, asyncFn) => {
  const [resource, operation] = typePrefix.split('/');

  const rule = notificationRules?.[resource]?.[operation];

  return createAsyncThunk(typePrefix, async (arg, thunkAPI) => {
    const { extra, rejectWithValue } = thunkAPI;

    try {
      const result = await asyncFn(arg, thunkAPI);

      if (rule?.success) {
        const message =
          typeof rule.successMessage === 'function'
            ? rule.successMessage(result)
            : `Successfully ${operation}d ${resource}`;

        extra.notify?.({
          type: 'success',
          message,
          popup: rule?.popup || false
        });
      }

      return result;
    } catch (err) {
      let message;

      if (rule?.error) {
        message =
          typeof rule.errorMessage === 'function'
            ? rule.errorMessage(err)
            : err.message || `Failed to ${operation} ${resource}`;

        extra.notify?.({
          type: 'error',
          message,
          popup: rule?.popup || false
        });
      }

      return rejectWithValue({ message });
    }
  });
};
