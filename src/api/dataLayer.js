import firebase from 'firebase';

import { updateUser } from '../lib/useAuth';
import useCollectionData from '../lib/useCollectionData';
import useDocumentData from '../lib/useDocumentData';

const { arrayRemove, arrayUnion } = firebase.firestore.FieldValue;

// Firebase shorthand references
const dbr = {};
dbr.games = () => firebase.firestore().collection('games');
dbr.game = (gameId) => dbr.games().doc(gameId);
dbr.gameTiles = (gameId) => dbr.games().doc(gameId).collection('tiles');
dbr.gameTile = (gameId, tileId) => dbr.gameTiles(gameId).doc(tileId);
dbr.gameUsers = (gameId) => dbr.games().doc(gameId).collection('users');
dbr.gameUser = (gameId, userId) => dbr.gameUsers(gameId).doc(userId);

// Data hooks
export const useGameData = (gameId) => useDocumentData(dbr.game(gameId));
export const useGameTilesData = (gameId) => useCollectionData(dbr.gameTiles(gameId));
export const useGameUserData = (gameId, userId) => useDocumentData(dbr.gameUser(gameId, userId));
export const useGameUsersData = (gameId) => useCollectionData(dbr.gameUsers(gameId));
export const useUserGames = (userId) => useCollectionData(
  dbr.games().where('userIds', 'array-contains', userId)
);

// Games
export const addGame = (values) => {
  return dbr.games().add({
    name: 'Untitled Game',
    ...values,
  });
};
export const getGame = (gameId) => {
  return dbr.game(gameId).get();
};
export const updateGame = (gameId, values) => {
  return dbr.game(gameId).set(values, { merge: true });
};
export const deleteGame = (gameId) => {
  return dbr.game(gameId).delete();
};

// Game Tiles
export const addGameTile = (gameId, values) => {
  return dbr.gameTiles(gameId).add(values);
};
export const getGameTile = (gameId, tileId) => {
  return dbr.gameTile(gameId, tileId).get();
};
export const updateGameTile = (gameId, tileId, values) => {
  return dbr.gameTile(gameId, tileId).set(values, { merge: true });
};
export const deleteGameTile = (gameId, tileId) => {
  return dbr.gameTile(gameId, tileId).delete();
};

// Game Users
export const addGameUser = async (gameId, userId, values) => {
  const gameUser = await updateGameUser(gameId, userId, values);
  // Update the normalization arrays
  await updateUser(userId, { gameIds: arrayUnion(gameId) });
  await updateGame(gameId, { userIds: arrayUnion(userId) });
  return gameUser;
};
export const getGameUser = (gameId, userId) => {
  return dbr.gameUser(gameId, userId).get();
};
export const updateGameUser = (gameId, userId, values) => {
  return dbr.gameUser(gameId, userId).set(values, { merge: true });
};
export const deleteGameUser = async (gameId, userId) => {
  await updateGame(gameId, { userIds: arrayRemove(userId) });
  // TODO advance the turn if it's this user's turn (handle in business layer?)
  return dbr.gameUser(gameId, userId).delete();
};

export default {
  useGameData,
  useGameTilesData,
  useGameUserData,
  useGameUsersData,
  useUserGames,

  addGame,
  getGame,
  updateGame,
  deleteGame,

  addGameTile,
  getGameTile,
  updateGameTile,
  deleteGameTile,

  addGameUser,
  getGameUser,
  updateGameUser,
  deleteGameUser,
};
