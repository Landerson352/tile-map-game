import React from 'react';
import { filter, isEmpty, map, sample } from 'lodash';

import useAuth from '../lib/useAuth';
import {
  dealGameUserTiles,
  incrementGameUserScore,
  placeGameTile,
  removeAllGameTiles,
  updateGame,
  useGameData,
  useGameTilesData,
  useGameUsersData,
} from './utils';

const useCreateGameVM = ({ gameId }) => {
  const auth = useAuth();
  const game = useGameData(gameId);
  const tiles = useGameTilesData(gameId);
  const users = useGameUsersData(gameId);

  // aliases
  const loaded = game.loaded && tiles.loaded && users.loaded;
  const error = game.error || tiles.error || users.error;
  const myUserId = auth.user?.uid;
  const userIds = game.data?.userIds || [];
  const currentTurnUserId = game.data?.currentTurnUserId;
  const isMyTurn = !!currentTurnUserId && currentTurnUserId === myUserId;

  // filters
  const myTiles = filter(tiles.data, { userId: myUserId });
  const placedTiles = filter(tiles.data, { isPlaced: true });

  // functions
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
      return dealGameUserTiles(gameId, userId, 7);
    }));
    await updateGame(gameId, {
      currentTurnUserId: sample(userIds),
    });
    return true;
  };

  const vm = {
    loaded,
    error,
    gameId,
    game: game.data,
    tiles: tiles.data,
    users: users.data,
    isMyTurn,
    myTiles,
    placedTiles,
    incrementTurn,
    incrementUserScore,
    placeTile,
    restart,
  };

  console.log(vm);

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
