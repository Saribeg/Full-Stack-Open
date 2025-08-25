import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../../../src/store/utils/notificationRules.js', () => ({
  notificationRules: {
    auth: {
      login: {
        success: {
          isEnabled: true,
          popup: true,
          getMessage: (result) => `Welcome, ${result.name}! 😊`
        },
        error: { isEnabled: true, popup: false, placement: 'LoginForm', duration: -1 }
      }
    },
    users: {
      fetchById: {
        success: { isEnabled: false },
        error: { isEnabled: true, popup: false, placement: 'UserDetails', duration: -1 }
      }
    },
    blogs: {
      fetchAll: {
        success: { isEnabled: false },
        error: { isEnabled: true, popup: false, placement: 'BlogList', duration: -1 }
      }
    }
  }
}));

import { createThunkWithNotify } from '../../../../src/store/utils/createThunkWithNotify.js';

describe('createThunkWithNotify (unit)', () => {
  let notify;
  let dispatch;
  let getState;
  let extra;

  beforeEach(() => {
    notify = vi.fn();
    dispatch = vi.fn();
    getState = vi.fn();
    extra = { notify };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // helper: run thunk like Redux would
  const run = (thunk, arg) => thunk(arg)(dispatch, getState, extra);

  it('success: calls notify with custom message (auth/login)', async () => {
    const thunk = createThunkWithNotify('auth/login', async () => ({ name: 'Alice' }));

    const action = await run(thunk, undefined);

    expect(action.type).toBe('auth/login/fulfilled');
    expect(action.payload).toEqual({ name: 'Alice' });
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        message: 'Welcome, Alice! 😊',
        popup: true,
        placement: 'global'
      })
    );
  });

  it('error: falls back to error.message (users/fetchById)', async () => {
    const thunk = createThunkWithNotify('users/fetchById', async () => {
      throw new Error('Network down');
    });

    const action = await run(thunk, { id: 1 });

    expect(action.type).toBe('users/fetchById/rejected');
    expect(action.payload).toEqual({ message: 'Network down' });
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        message: 'Network down',
        placement: 'UserDetails',
        popup: false,
        duration: -1
      })
    );
  });

  it('does not notify if success rule disabled (blogs/fetchAll)', async () => {
    const thunk = createThunkWithNotify('blogs/fetchAll', async () => 'Data');

    const action = await run(thunk, undefined);

    expect(action.type).toBe('blogs/fetchAll/fulfilled');
    expect(action.payload).toBe('Data');
    expect(notify).not.toHaveBeenCalled();
  });

  it('error: uses error.message if no payload.message (blogs/fetchAll)', async () => {
    const thunk = createThunkWithNotify('blogs/fetchAll', async () => {
      throw new Error('Server is down');
    });

    const action = await run(thunk, undefined);

    expect(action.type).toBe('blogs/fetchAll/rejected');
    expect(action.payload).toEqual({ message: 'Server is down' });
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        message: 'Server is down',
        placement: 'BlogList',
        duration: -1
      })
    );
  });

  it('unknown typePrefix: does not crash, does not notify', async () => {
    const thunk = createThunkWithNotify('unknown/operation', async () => 'X');

    const action = await run(thunk, undefined);

    expect(action.type).toBe('unknown/operation/fulfilled');
    expect(action.payload).toBe('X');
    expect(notify).not.toHaveBeenCalled();
  });
});
