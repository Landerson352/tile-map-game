import React from 'react';
import { filter, find, isEmpty, map, reduce, sample } from 'lodash';
import { usePrevious } from 'react-use';

import useAuth from '../lib/useAuth';
import createSockets from '../utils/createSockets';
import {
  HAND_SIZE,
  dealGameUserTile,
  dealGameUserTiles,
  incrementGameUserScore,
  placeGameTile,
  removeAllGameTiles,
  updateGame,
  useGameData,
  useGameTilesData,
  useGameUsersData,
} from '../api';

const useCreateGameVM = ({ gameId }) => {
  const auth = useAuth();
  const game = useGameData(gameId);
  const tiles = useGameTilesData(gameId);
  const users = useGameUsersData(gameId);
  const previousTurnUserId = usePrevious(game.data?.currentTurnUserId);

  // aliases
  const loaded = game.loaded && tiles.loaded && users.loaded;
  const error = game.error || tiles.error || users.error;
  const myUserId = auth.user?.id;
  const userIds = game.data?.userIds || [];
  const currentTurnUserId = game.data?.currentTurnUserId;
  const hasStarted = !!currentTurnUserId;
  const isMyTurn = !!currentTurnUserId && currentTurnUserId === myUserId;
  const justBecameMyTurn = isMyTurn && (currentTurnUserId !== previousTurnUserId);

  // filters & aggregators
  // TODO: memoize
  const myTiles = filter(tiles.data, { userId: myUserId });
  const myTilesInHand = filter(myTiles, { isPlaced: false });
  const canDrawTile = myTilesInHand.length < HAND_SIZE;
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

  // functions
  // TODO: useCallback
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

  const placeTile = (tileId, x, y) => {
    return placeGameTile(gameId, tileId, x, y);
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

  // TODO: add tileFocus, setTileFocus, isFocusedTileEmpty
  const vm = {
    loaded,
    error,
    gameId,
    game: game.data,
    tiles: tiles.data,
    users: users.data,
    canDrawTile,
    currentTurnUserId,
    hasStarted,
    isFocusedTileEmpty: false,
    isMyTurn,
    justBecameMyTurn,
    myTiles,
    myTilesInHand,
    placedTiles,
    placedTilesHash,
    tileFocus: null,
    tileSockets,
    usersInTurnOrder,
    drawTile,
    incrementTurn,
    incrementUserScore,
    placeTile,
    restart,
    setTileFocus: () => {},
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
