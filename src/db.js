import firebase from 'firebase/app';
import 'firebase/firestore';
import { get } from 'lodash';
import { usePrevious } from 'react-use';

import useAuth, { updateUser } from './lib/useAuth';
import useCollectionData from './lib/useCollectionData';
import useDocumentData from './lib/useDocumentData';

const db = firebase.firestore;
const { arrayUnion, increment } = firebase.firestore.FieldValue;

export const addGame = (values) => {
  return db().collection('games').add({
    name: 'Untitled Game',
    ...values,
  });
};

export const addGameUser = async (gameId, userId, values) => {
  const gameUser = await db().collection('games')
    .doc(gameId)
    .collection('users')
    .doc(userId)
    .set(values, {
      merge: true
    });
  // Update the normalization arrays
  await updateUser(userId, {
    gameIds: arrayUnion(gameId),
  });
  await updateGame(gameId, {
    userIds: arrayUnion(userId),
  });
  return gameUser;
};

export const incrementGameUserScore = (gameId, userId, value) => {
  return db().collection('games')
    .doc(gameId)
    .collection('users')
    .doc(userId)
    .set({ score: increment(value) }, { merge: true });
};

export const removeGame = (id) => {
  return db().collection('games').doc(id).delete();
};

export const updateGame = (id, values) => {
  return db().collection('games').doc(id).set(values, {
    merge: true
  });
};

export const updateGameUser = (gameId, userId, values) => {
  return db().collection('games')
    .doc(gameId)
    .collection('users')
    .doc(userId)
    .set(values, {
      merge: true
    });
};

export const useAddGame = () => {
  const auth  = useAuth();
  const joinGame = useJoinGame();

  return async (data) => {
    const game = await addGame({
      ...data,
      hostUserId: auth.user.uid,
    });
    await joinGame(game.id);
    return game;
  };
};

export const useGame = (gameId) => {
  return useDocumentData(
    db().collection('games').doc(gameId)
  );
};

export const useGames = () => {
  return useCollectionData(
    db().collection('games')
  );
};

export const useGameUsers = (gameId) => {
  return useCollectionData(
    db().collection('games')
      .doc(gameId)
      .collection('users')
  );
};

export const useIncrementGameTurn = (gameId) => {
  const game = useGame(gameId);

  return () => {
    if (!game.loaded) return null;

    const { currentTurnUserId, userIds = [] } = game.data;
    const index = userIds.indexOf(currentTurnUserId);
    const nextIndex = (index + 1 ) % userIds.length;

    return updateGame(gameId, {
      currentTurnUserId: userIds[nextIndex],
    });
  };
};

export const useJoinGame = () => {
  const auth  = useAuth();

  return (gameId) => {
    return addGameUser(gameId, auth.user.uid, {
      displayName: auth.user.displayName,
      email: auth.user.email,
      photoURL: auth.user.photoURL,
    });
  };
};

export const useMyGames = () => {
  const auth  = useAuth();

  return useCollectionData(
    db().collection('games')
      .where('userIds', 'array-contains', auth.user.uid)
  );
};

export const useMyGameUser = (gameId) => {
  const auth  = useAuth();

  return useDocumentData(
    db().collection('games')
      .doc(gameId)
      .collection('users')
      .doc(auth.user.uid)
  );
};

export const useMyTurnCallback = (gameId, cb) => {
  const auth = useAuth();
  const game = useGame(gameId);
  const authUserId = get(auth, 'user.uid');
  const currentTurnUserId = get(game, 'data.currentTurnUserId');
  const previousTurnUserId = usePrevious(currentTurnUserId);

  const isMyTurn = currentTurnUserId === authUserId;
  const turnChanged = currentTurnUserId !== previousTurnUserId;

  if (turnChanged && isMyTurn) {
    cb();
  }
};

export const useMyUser = () => {
  const auth  = useAuth();

  return useDocumentData(
    db().collection('users').doc(auth.user.uid)
  );
};

export const useUser = (userId) => {
  return useDocumentData(
    db().collection('users').doc(userId)
  );
};
