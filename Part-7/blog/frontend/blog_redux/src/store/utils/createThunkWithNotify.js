import { createAsyncThunk } from '@reduxjs/toolkit';
import { notificationRules } from './notificationRules';

const executeCentralizedNotification = (typePrefix, notificationType, dataOrError, notify) => {
  const [resource, operation] = typePrefix.split('/');
  const rule = notificationRules?.[resource]?.[operation];
  const settings = rule?.[notificationType];

  if (!settings?.isEnabled) return;

  const defaultMessage =
    notificationType === 'success'
      ? `Successfully ${operation}d ${resource}`
      : dataOrError.message || `Failed to ${operation} ${resource}`;

  const message =
    typeof settings.getMessage === 'function' ? settings.getMessage(dataOrError) : defaultMessage;

  console.log('thunk', settings.duration);

  notify?.({
    type: notificationType,
    message,
    popup: settings.popup || false,
    duration: settings.duration,
    placement: settings.placement || 'global'
  });

  return message;
};

export const createThunkWithNotify = (typePrefix, asyncFn) => {
  return createAsyncThunk(typePrefix, async (arg, thunkAPI) => {
    const { extra, rejectWithValue } = thunkAPI;

    try {
      const result = await asyncFn(arg, thunkAPI);
      executeCentralizedNotification(typePrefix, 'success', result, extra.notify);
      return result;
    } catch (err) {
      const message = executeCentralizedNotification(typePrefix, 'error', err, extra.notify);
      return rejectWithValue({ message });
    }
  });
};
