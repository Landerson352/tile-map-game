import firebase from 'firebase';
import { map, random, times } from 'lodash';

import weightedSample from '../utils/weightedSample';
import dataLayer from './dataLayer';

const { increment } = firebase.firestore.FieldValue;

export const HAND_SIZE = 7;
export const EDGES = {
  oooo: { weight: 2 },
  cooo: { weight: 6 },
  ccoo: { weight: 12 },
  ccco: { weight: 6 },
  cccc: { weight: 12 },
  coco: { weight: 12 },
};

// Business layer
export const dealGameUserTile = (gameId, userId, tile = null) => {
  return dataLayer.addGameTile(gameId, {
    userId,
    isPlaced: false,
    // color: `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`, // debugging color
    // roads: sample(Object.keys(EDGES)),
    roads: weightedSample(EDGES),
    // water: sample(Object.keys(EDGES)),
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
  return dataLayer.updateGameUser(gameId, userId, { score: increment(value) });
};

export const placeGameTile = (gameId, tileId, x, y) => {
  return dataLayer.updateGameTile(gameId, tileId, { x, y, isPlaced: true });
};

export const removeAllGameTiles = async (gameId) => {
  // read count: tiles
  const tiles = await dataLayer.getGame(gameId);
  const promises = map(tiles.docs, ({ id: tileId }) => {
    return dataLayer.deleteGameTile(gameId, tileId);
  });
  return Promise.all(promises);
};

export const rotateGameTile = (gameId, tileId, value) => {
  return dataLayer.updateGameTile(gameId, tileId, { rotation: increment(value) });
};

export const setGameUserFocusedSocket = (gameId, userId, focusedSocket) => {
  return dataLayer.updateGameUser(gameId, userId, { focusedSocket });
};

export const setGameUserFocusedTileId = (gameId, userId, focusedTileId) => {
  return dataLayer.updateGameUser(gameId, userId, { focusedTileId });
};

export default {
  ...dataLayer,

  HAND_SIZE,
  EDGES,

  dealGameUserTile,
  dealGameUserTiles,
  incrementGameUserScore,
  placeGameTile,
  removeAllGameTiles,
  rotateGameTile,
  setGameUserFocusedSocket,
  setGameUserFocusedTileId,
};
