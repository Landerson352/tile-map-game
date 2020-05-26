import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { get, isEmpty, map, sample, times } from 'lodash';
import { usePrevious } from 'react-use';

import useAuth, { updateUser } from './lib/useAuth';
import useCollectionData from './lib/useCollectionData';
import useDocumentData from './lib/useDocumentData';

const db = firebase.firestore;
const { arrayUnion, increment } = firebase.firestore.FieldValue;

export const GameIdContext = React.createContext(null);
export const useGameId = () => React.useContext(GameIdContext);

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

export const useGame = () => {
  const gameId = useGameId();
  return useDocumentData(
    db().collection('games').doc(gameId)
  );
};

export const useGameTiles = () => {
  const gameId = useGameId();
  return useCollectionData(
    db().collection('games')
      .doc(gameId)
      .collection('tiles')
      .where('isPlaced', '==', true)
  );
};

export const useMyGameTiles = () => {
  const auth = useAuth();
  const gameId = useGameId();

  return useCollectionData(
    db().collection('games')
      .doc(gameId)
      .collection('tiles')
      .where('userId', '==', auth.user.uid)
      .where('isPlaced', '==', false)
  );
};

export const usePlaceTile = () => {
  const gameId = useGameId();
  return (tileId, x, y) => db().collection('games')
    .doc(gameId)
    .collection('tiles')
    .doc(tileId)
    .set({
      x,
      y,
      isPlaced: true,
    }, {
      merge: true
    });
};

export const useGames = () => {
  return useCollectionData(
    db().collection('games')
  );
};

export const useGameUsers = () => {
  const gameId = useGameId();
  return useCollectionData(
    db().collection('games')
      .doc(gameId)
      .collection('users')
  );
};

export const useIncrementGameTurn = () => {
  const gameId = useGameId();
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

export const useMyTurnCallback = (cb) => {
  const gameId = useGameId();
  const auth = useAuth();
  const game = useGame(gameId);
  const authUserId = get(auth, 'user.uid');
  const currentTurnUserId = get(game, 'data.currentTurnUserId');
  const previousTurnUserId = usePrevious(currentTurnUserId);

  const isMyTurn = currentTurnUserId === authUserId;
  const turnChanged = currentTurnUserId !== previousTurnUserId;

  React.useEffect(() => {
    if (turnChanged && isMyTurn) {
      cb();
    }
  }, [cb, turnChanged, isMyTurn]);
};

export const useMyUser = () => {
  const auth  = useAuth();

  return useDocumentData(
    db().collection('users').doc(auth.user.uid)
  );
};

export const addGameTile = async (gameId, tile) => {
  return db().collection('games')
    .doc(gameId)
    .collection('tiles')
    .add(tile);
};

const dealGameUserTiles = async (gameId, userId) => {
  const promises = times(7, () => {
    const tile = {
      userId: userId,
      isPlaced: false,
      biome: 'forest',
      road: 'straight',
      river: 'straight',
    };
    return addGameTile(gameId, tile);
  });
  return Promise.all(promises);
};

const removeGameTiles = async (gameId) => {
  const tiles = await db().collection('games')
    .doc(gameId)
    .collection('tiles')
    .get();

  const promises = map(tiles.docs, ({ id: tileId }) => {
    return db().collection('games')
      .doc(gameId)
      .collection('tiles')
      .doc(tileId)
      .delete();
  });

  return Promise.all(promises);
};

export const useStartGame = () => {
  const gameId = useGameId();
  const game = useGame();

  return async () => {
    if (!game.loaded) return null;

    const { userIds } = game.data;

    if (isEmpty(userIds)) return null;

    await removeGameTiles(gameId);

    // Give each user 7 tiles
    await Promise.all(map(userIds, (userId) => {
      return dealGameUserTiles(gameId, userId);
    }));

    await updateGame(gameId, {
      currentTurnUserId: sample(userIds),
    });

    return game;
  };
};

export const useUser = (userId) => {
  return useDocumentData(
    db().collection('users').doc(userId)
  );
};
