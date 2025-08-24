import { useState, useMemo } from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

/**
 * Factory for a static test renderer: wraps components with a Context.Provider
 * using the given value directly. Useful for simple snapshot-like tests where
 * state does not need to change dynamically.
 *
 * @param {React.Context<any>} Context - The React context to wrap
 * @param {(value: any) => any} mapContextValue - Maps provided props into the context value
 * @returns {Function} - A render function for testing with a static context
*/
export const createRenderWithStaticContext = (Context, mapContextValue) => {
  return (ui, value) => {
    return render(
      <Context.Provider value={mapContextValue(value)}>
        {ui}
      </Context.Provider>
    );
  };
};

/**
 * Factory function to create a test utility for rendering components
 * with a "live" version of a given React context. The context value is
 * backed by local state and a mocked dispatch function that mimics reducer
 * updates, making it possible to test context-driven components in isolation.
 *
 * @param {React.Context<any>} Context - The React context to wrap
 * @param {(state: any, action: any) => any} reducer - Function to update state from dispatched actions
 * @param {any} initialState - Initial state value for the context
 * @param {(state: any, dispatchSpy: Function) => any} [mapContextValue] - Maps state and dispatchSpy into the context value
 * @returns {Function} - A render function for testing components with the live context
*/
export const createRenderWithLiveContext = (
  Context,
  reducer,
  initialState,
  mapContextValue = (s, d) => ({ state: s, dispatch: d })
) => {
  return (ui, { state = initialState, onDispatch } = {}) => {
    let dispatchSpyRef;
    let setStateRef;

    const Wrapper = ({ children }) => {
      const [localState, setState] = useState(state);
      setStateRef = setState;

      const dispatchSpy = useMemo(
        () =>
          vi.fn((action) => {
            setState((prev) => reducer(prev, action));
            onDispatch?.(action);
          }),
        []
      );

      dispatchSpyRef = dispatchSpy;

      return (
        <Context.Provider value={mapContextValue(localState, dispatchSpy)}>
          {children}
        </Context.Provider>
      );
    };

    const renderResult = render(<Wrapper>{ui}</Wrapper>);
    return { ...renderResult, dispatchSpy: dispatchSpyRef, setState: setStateRef };
  };
};

/**
 * Factory function to create a "live" provider for isolated integration tests.
 * The provider uses local state and a mocked dispatch function
 * that updates state through the given reducer, making it possible
 * to test components with realistic context behavior without wiring
 * the full application store.
 *
 * @param {React.Context<any>} Context - The React context to wrap
 * @param {(state: any, action: any) => any} reducer - Function to update state based on dispatched actions
 * @param {any} initialState - Initial state value for the context
 * @param {(state: any, dispatchSpy: Function) => any} [mapContextValue] - Maps state and dispatchSpy into the value passed to the Context.Provider
 * @returns {React.FC<{ initial?: any, onDispatch?: Function, children: React.ReactNode }>} - A live provider component for use in tests
*/
export const createLiveProvider = (
  Context,
  reducer,
  initialState,
  mapContextValue = (s, d) => ({ state: s, dispatch: d })
) => {
  return function LiveProvider({ initial = initialState, onDispatch, children }) {
    const [state, setState] = useState(initial);

    const dispatchSpy = useMemo(
      () =>
        vi.fn((action) => {
          setState((prev) => reducer(prev, action));
          onDispatch?.(action);
        }),
      [onDispatch]
    );

    const value = useMemo(
      () => mapContextValue(state, dispatchSpy),
      [state, dispatchSpy]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };
};
