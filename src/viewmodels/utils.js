import firebase from 'firebase';
import { isEmpty, map, sample, times } from 'lodash';

import { updateUser } from '../lib/useAuth';
import useCollectionData from '../lib/useCollectionData';
import useDocumentData from '../lib/useDocumentData';

const db = firebase.firestore;
const { arrayUnion, increment } = firebase.firestore.FieldValue;

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

export const dealGameUserTiles = async (gameId, userId, number) => {
  const promises = times(number, () => {
    const tile = {
      userId: userId,
      isPlaced: false,
      // biome: 'forest',
      // road: 'straight',
      // river: 'straight',
    };
    return addGameTile(gameId, tile);
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

export const updateGame = (id, values) => {
  return db().collection('games')
    .doc(id).set(values, { merge: true });
};

// read count: 1
export const useGameData = (gameId) => useDocumentData(
  db().collection('games').doc(gameId)
);
// read count: tiles.length
export const useGameTilesData = (gameId) =>  useCollectionData(
  db().collection('games').doc(gameId)
    .collection('tiles')
);
// read count: users.length
export const useGameUsersData = (gameId) =>   useCollectionData(
  db().collection('games')
    .doc(gameId)
    .collection('users')
);
