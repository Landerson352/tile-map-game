import React from 'react';
import firebase from 'firebase/app';
import { isEmpty } from 'lodash';
import useAuth from '../lib/useAuth';

// import useDocumentData from '../lib/useDocumentData';
import useCollectionData from '../lib/useCollectionData';
import { addGame, addGameUser } from '../api';

const db = firebase.firestore;
// const { arrayUnion, increment } = firebase.firestore.FieldValue;

const useCreateAuthorizedVM = () => {
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

  const joinGame = (gameId, userValues) => {
    if (!myUserId) return false;
    return addGameUser(gameId, myUserId, userValues);
  };

  const vm = {
    loaded: auth.loaded && myGames.loaded,
    error: auth.error || myGames.error,
    user: auth.user,
    myGames: myGames.data,
    haveGames: !isEmpty(myGames.data),
    hostGame,
    joinGame,
  };

  // console.log(vm);

  return vm;
};

// Provider/consumer pattern, to make VM available to all descendants
const AuthorizedContext = React.createContext({});
export const useAuthorizedVM = () => React.useContext(AuthorizedContext);
export const AuthorizedVMProvider = (props) => {
  const vm = useCreateAuthorizedVM();
  return (
    <AuthorizedContext.Provider {...props} value={vm} />
  );
};
