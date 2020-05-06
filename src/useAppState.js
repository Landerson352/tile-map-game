import createAppState from './lib/createAppState';

const initialState = {
};

const mutators = {
};

export const [AppStateProvider, useUnderlyingAppState] = createAppState(initialState, mutators);

export const useAppState = () => {
  const [{ ship, ...restState}, actions] = useUnderlyingAppState();

  return [{
    ...restState,
  }, actions]
};

export default useAppState;
