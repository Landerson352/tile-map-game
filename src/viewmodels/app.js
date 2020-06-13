import React from 'react';
import firebase from 'firebase/app';
// import { filter, isEmpty } from 'lodash';
import useAuth from '../lib/useAuth';

// import useDocumentData from '../lib/useDocumentData';
import useCollectionData from '../lib/useCollectionData';
import { addGame, addGameUser } from './utils';

const db = firebase.firestore;
// const { arrayUnion, increment } = firebase.firestore.FieldValue;

const useCreateAppVM = () => {
  const auth = useAuth();
  const myUserId = auth.user?.id;

  const myGames = useCollectionData(
    db().collection('games')
      .where('userIds', 'array-contains', myUserId)
  );

  const hostGame = async (gameValues, userValues) => {
    const game = await addGame({
      ...gameValues,
      hostUserId: myUserId,
    });
    await addGameUser(game.id, myUserId, userValues);
    return game;
  };

  const joinGame = (gameId, values) => {
    if (!myUserId) return false;
    return addGameUser(gameId, myUserId, values);
  };

  const vm = {
    loaded: auth.loaded && myGames.loaded,
    error: auth.error || myGames.error,
    myGames,
    hostGame,
    joinGame,
  };

  // console.log(vm);

  return vm;
};

// Provider/consumer pattern, to make VM available to all descendants
const AppContext = React.createContext({});
export const useAppVM = () => React.useContext(AppContext);
export const AppVMProvider = (props) => {
  const vm = useCreateAppVM();
  return (
    <AppContext.Provider {...props} value={vm} />
  );
};
