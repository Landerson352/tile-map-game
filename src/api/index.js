import firebase from 'firebase';
import { map, random, sample, times } from 'lodash';

import { updateUser } from '../lib/useAuth';
import useCollectionData from '../lib/useCollectionData';
import useDocumentData from '../lib/useDocumentData';

const db = firebase.firestore;
const { arrayUnion, increment } = firebase.firestore.FieldValue;

export const HAND_SIZE = 7;
export const EDGES = {
  oooo: {},
  cooo: {},
  ccoo: {},
  ccco: {},
  cccc: {},
  coco: {},
};

export const addGame = (values) => {
  return db().collection('games').add({
    name: 'Untitled Game',
    ...values,
  });
};

export const addGameTile = (gameId, values) => {
  return db().collection('games')
    .doc(gameId)
    .collection('tiles')
    .add(values);
};

export const addGameUser = async (gameId, userId, values) => {
  const gameUser = await db().collection('games')
    .doc(gameId)
    .collection('users')
    .doc(userId)
    .set(values, { merge: true });
  // Update the normalization arrays
  await updateUser(userId, {
    gameIds: arrayUnion(gameId),
  });
  await updateGame(gameId, {
    userIds: arrayUnion(userId),
  });
  return gameUser;
};

export const dealGameUserTile = (gameId, userId, tile = null) => {
  return addGameTile(gameId, {
    userId,
    isPlaced: false,
    color: `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`, // debugging color
    roads: sample(Object.keys(EDGES)),
    water: sample(Object.keys(EDGES)),
    rotation: random(0,3),
    // biome: 'forest' | 'snow' | 'desert',
    ...tile,
  });
};

export const dealGameUserTiles = async (gameId, userId, number) => {
  const promises = times(number, () => {
    return dealGameUserTile(gameId, userId);
  });
  return Promise.all(promises);
};

export const incrementGameUserScore = (gameId, userId, value) => {
  return db().collection('games')
    .doc(gameId)
    .collection('users')
    .doc(userId)
    .set({ score: increment(value) }, { merge: true });
};

export const placeGameTile = (gameId, tileId, x, y) => {
  return db().collection('games')
    .doc(gameId)
    .collection('tiles')
    .doc(tileId)
    .set({ x, y, isPlaced: true }, { merge: true });
};

export const removeAllGameTiles = async (gameId) => {
  // read count: tiles
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

export const removeGame = (id) => {
  return db().collection('games')
    .doc(id).delete();
};

export const setGameUserFocusedSocket = (gameId, userId, focusedSocket) => {
  return db().collection('games')
    .doc(gameId)
    .collection('users')
    .doc(userId)
    .set({ focusedSocket }, { merge: true });
};

export const setGameUserFocusedTileId = (gameId, userId, focusedTileId) => {
  return db().collection('games')
    .doc(gameId)
    .collection('users')
    .doc(userId)
    .set({ focusedTileId }, { merge: true });
};

export const updateGame = (id, values) => {
  return db().collection('games')
    .doc(id)
    .set(values, { merge: true });
};

export const updateGameUser = (gameId, userId, values) => {
  return db().collection('games')
    .doc(gameId)
    .collection('users')
    .doc(userId)
    .set(values, { merge: true });
};

// read count: 1
export const useGameData = (gameId) => useDocumentData(
  db().collection('games')
    .doc(gameId)
);
// read count: tiles.length
export const useGameTilesData = (gameId) =>  useCollectionData(
  db().collection('games')
    .doc(gameId)
    .collection('tiles')
);
// read count: 1
export const useGameUserData = (gameId, userId) => useDocumentData(
  db().collection('games')
    .doc(gameId)
    .collection('users')
    .doc(userId)
);
// read count: users.length
export const useGameUsersData = (gameId) => useCollectionData(
  db().collection('games')
    .doc(gameId)
    .collection('users')
);
// read count: user.n.games.length
export const useUserGames = (userId) => useCollectionData(
  db().collection('games')
    .where('userIds', 'array-contains', userId)
);
