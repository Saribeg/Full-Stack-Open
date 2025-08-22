import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addCases } from '../../../../src/store/utils/addCases.js';

const makeAsyncThunkTypes = (base) => ({
  pending: `${base}/pending`,
  fulfilled: `${base}/fulfilled`,
  rejected: `${base}/rejected`
});

const createInitialState = () => ({
  status: {
    fetch: { loading: false, error: null },
    create: { loading: false, error: null }
  },
  blogList: []
});

describe('addCases (unit - contract level)', () => {
  let builderMock;
  let thunkTypes;

  beforeEach(() => {
    builderMock = { addCase: vi.fn().mockReturnThis() };
    thunkTypes = makeAsyncThunkTypes('blogs/fetch');
  });

  it('returns a chainable API with .for and .also', () => {
    const api = addCases(builderMock);
    const result = api.for(thunkTypes, 'fetch').also('misc/cleanup', () => {});

    expect(result).toBe(api);
  });

  it('registers exactly 3 cases for .for(): pending, fulfilled, rejected (in that order)', () => {
    addCases(builderMock).for(thunkTypes, 'fetch');

    expect(builderMock.addCase).toHaveBeenCalledTimes(3);

    const calls = builderMock.addCase.mock.calls;
    expect(calls[0][0]).toBe(thunkTypes.pending);
    expect(calls[1][0]).toBe(thunkTypes.fulfilled);
    expect(calls[2][0]).toBe(thunkTypes.rejected);
  });

  it('sets loading/error flags correctly and delegates to custom callbacks when provided', () => {
    const onFulfilled = vi.fn();
    const onRejected = vi.fn();

    addCases(builderMock).for(thunkTypes, 'fetch', {
      fulfilled: onFulfilled,
      rejected: onRejected
    });

    const [pendingType, pendingReducer] = builderMock.addCase.mock.calls[0];
    const [fulfilledType, fulfilledReducer] = builderMock.addCase.mock.calls[1];
    const [rejectedType, rejectedReducer] = builderMock.addCase.mock.calls[2];

    expect(pendingType).toBe(thunkTypes.pending);
    expect(fulfilledType).toBe(thunkTypes.fulfilled);
    expect(rejectedType).toBe(thunkTypes.rejected);

    // pending
    {
      const state = createInitialState();
      pendingReducer(state);
      expect(state.status.fetch.loading).toBe(true);
      expect(state.status.fetch.error).toBeNull();
    }

    // fulfilled + custom callback is executed
    {
      const state = createInitialState();
      const action = { type: fulfilledType, payload: [{ id: 1 }] };
      fulfilledReducer(state, action);
      expect(state.status.fetch.loading).toBe(false);
      expect(onFulfilled).toHaveBeenCalledTimes(1);
      expect(onFulfilled).toHaveBeenCalledWith(state, action);
    }

    // rejected uses payload.message first; falls back to error.message
    {
      const state = createInitialState();
      const action = {
        type: rejectedType,
        payload: { message: 'FromPayload' },
        error: { message: 'FromError' }
      };
      rejectedReducer(state, action);
      expect(state.status.fetch.loading).toBe(false);
      expect(state.status.fetch.error).toBe('FromPayload');
      expect(onRejected).toHaveBeenCalledTimes(1);
      expect(onRejected).toHaveBeenCalledWith(state, action);
    }

    {
      const state = createInitialState();
      const action = {
        type: rejectedType,
        payload: undefined,
        error: { message: 'FromErrorOnly' }
      };
      rejectedReducer(state, action);
      expect(state.status.fetch.loading).toBe(false);
      expect(state.status.fetch.error).toBe('FromErrorOnly');
    }
  });

  it('also() registers an additional case via builder.addCase', () => {
    const reducer = (state) => {
      state.blogList = [];
    };

    addCases(builderMock).also('auth/logout/fulfilled', reducer);

    expect(builderMock.addCase).toHaveBeenCalledTimes(1);
    const [type, registeredReducer] = builderMock.addCase.mock.calls[0];
    expect(type).toBe('auth/logout/fulfilled');

    const state = { ...createInitialState(), blogList: [{ id: 1 }] };
    registeredReducer(state);
    expect(state.blogList).toEqual([]);
  });

  it('handles .for() without custom callbacks gracefully', () => {
    addCases(builderMock).for(thunkTypes, 'fetch');

    const [, fulfilledReducer] = builderMock.addCase.mock.calls[1];
    const [, rejectedReducer] = builderMock.addCase.mock.calls[2];

    const state1 = createInitialState();
    fulfilledReducer(state1, { type: thunkTypes.fulfilled, payload: 123 });
    expect(state1.status.fetch.loading).toBe(false);

    const state2 = createInitialState();
    rejectedReducer(state2, { type: thunkTypes.rejected, error: { message: 'oops' } });
    expect(state2.status.fetch.loading).toBe(false);
    expect(state2.status.fetch.error).toBe('oops');
  });
});
