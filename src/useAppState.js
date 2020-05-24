import createAppState from './lib/createAppState';

const initialState = {
};

const mutators = {
  setTileFocus: (state, tileFocus) => {
    state.tileFocus = tileFocus;
  },
};

export const [AppStateProvider, useUnderlyingAppState] = createAppState(initialState, mutators);

export const useAppState = () => {
  const [{ ...restState }, actions] = useUnderlyingAppState();

  // Pull out and enhance any state properties you want.

  return [{
    ...restState,
  }, actions]
};

export default useAppState;
