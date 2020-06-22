import React from 'react';
import { filter, find, isEmpty, map, reduce, sample } from 'lodash';
import { usePrevious } from 'react-use';

import useAuth from '../lib/useAuth';
import createSockets from '../utils/createSockets';
import isTilePlacementValid from '../utils/isTilePlacementValid';
import {
  HAND_SIZE,
  dealGameUserTile,
  dealGameUserTiles,
  incrementGameUserScore,
  placeGameTile,
  removeAllGameTiles,
  rotateGameTile,
  setGameUserFocusedSocket,
  setGameUserFocusedTileId,
  updateGame,
  useGameData,
  useGameTilesData,
  useGameUserData,
  useGameUsersData,
} from '../api';

const useCreateGameVM = ({ gameId }) => {
  const auth = useAuth();
  const myUserId = auth.user?.id;
  const game = useGameData(gameId);
  const tiles = useGameTilesData(gameId);
  const users = useGameUsersData(gameId);
  const myUser = useGameUserData(gameId, myUserId);

  // aliases
  const loaded = game.loaded && tiles.loaded && users.loaded && myUser;
  const error = game.error || tiles.error || users.error || myUser.error;
  const userIds = game.data?.userIds || [];
  const currentTurnUserId = game.data?.currentTurnUserId;
  const focusedSocket = myUser.data?.focusedSocket;
  const focusedTileId = myUser.data?.focusedTileId;

  // calculated values
  const previousTurnUserId = usePrevious(currentTurnUserId);
  const hasStarted = !!currentTurnUserId;
  const isMyTurn = !!currentTurnUserId && currentTurnUserId === myUserId;
  const justBecameMyTurn = isMyTurn && (currentTurnUserId !== previousTurnUserId);
  // TODO: memoize
  const myTiles = filter(tiles.data, { userId: myUserId });
  const focusedTile = find(myTiles, { id: focusedTileId });
  const myTilesInHand = filter(myTiles, { isPlaced: false });
  const canDrawTile = myTilesInHand.length < HAND_SIZE;
  const emptySlotsInHand = Math.max(HAND_SIZE - myTilesInHand.length, 0);
  const placedTiles = filter(tiles.data, { isPlaced: true });
  const usersInTurnOrder = map(game.data?.userIds, (id) => {
    return find(users.data, { id });
  });
  const placedTilesHash = reduce(placedTiles, (sum, tile) => {
    return {
      ...sum,
      [`${tile.x}_${tile.y}`]: tile,
    };
  }, {});
  const tileSockets = createSockets(placedTilesHash);

  const canPlaceFocusedTile = isMyTurn && !!focusedSocket && !!focusedTileId && isTilePlacementValid({...focusedTile, ...focusedSocket }, placedTilesHash);

  // functions
  // TODO: useCallback?
  const drawTile = () => {
    return dealGameUserTile(gameId, myUserId);
  };

  const incrementTurn = () => {
    if (isEmpty(userIds)) return false;

    const index = userIds.indexOf(currentTurnUserId);
    const nextIndex = (index + 1 ) % userIds.length;

    return updateGame(gameId, {
      currentTurnUserId: userIds[nextIndex],
    });
  };

  const incrementUserScore = (userId, value) => {
    return incrementGameUserScore(gameId, userId, value);
  };

  // const placeTile = (tileId, x, y) => {
  //   return placeGameTile(gameId, tileId, x, y);
  // };

  const placeFocusedTile = async () => {
    const { x, y } = focusedSocket;
    await placeGameTile(gameId, focusedTileId, x, y);
    await Promise.all([
      setGameUserFocusedSocket(gameId, myUserId, null),
      setGameUserFocusedTileId(gameId, myUserId, null),
    ]);
    return incrementTurn();
  };

  const restart = async () => {
    if (isEmpty(userIds)) return null;

    await removeAllGameTiles(gameId);
    // Give each user a hand of tiles
    await Promise.all(map(userIds, (userId) => {
      return dealGameUserTiles(gameId, userId, HAND_SIZE);
    }));
    await updateGame(gameId, {
      currentTurnUserId: sample(userIds),
    });
    return true;
  };

  const rotateFocusedTile = (value) => {
    return rotateGameTile(gameId, focusedTileId, value);
  };

  const setFocusedSocket = (socket) => {
    return setGameUserFocusedSocket(gameId, myUserId, socket);
  };

  const setFocusedTileId = (tileId) => {
    return setGameUserFocusedTileId(gameId, myUserId, tileId);
  };

  const vm = {
    loaded,
    error,
    gameId,
    game: game.data,
    tiles: tiles.data,
    users: users.data,
    canDrawTile,
    canPlaceFocusedTile,
    currentTurnUserId,
    emptySlotsInHand,
    focusedSocket,
    focusedTile,
    hasStarted,
    isMyTurn,
    justBecameMyTurn,
    myTiles,
    myTilesInHand,
    placedTiles,
    placedTilesHash,
    tileSockets,
    usersInTurnOrder,
    drawTile,
    // incrementTurn,
    incrementUserScore,
    placeFocusedTile,
    // placeTile,
    restart,
    rotateFocusedTile,
    setFocusedSocket,
    setFocusedTileId,
  };

  // console.log(vm);

  return vm;
};

// Provider/consumer pattern, to make VM available to all descendants
const GameContext = React.createContext({});
export const useGameVM = () => React.useContext(GameContext);
export const GameVMProvider = (props) => {
  const { gameId, ...restProps } = props;
  const vm = useCreateGameVM({ gameId });
  return (
    <GameContext.Provider {...restProps} value={vm} />
  );
};
