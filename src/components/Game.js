import React from 'react';
import {
  Heading,
} from '@chakra-ui/core';

import {
  useGame,
} from '../db';

const Game = (props) => {
  const { gameId } = props.match.params;
  const game = useGame(gameId);

  if (!game.loaded) {
    return <p>Loading...</p>;
  }

  if (game.isEmpty) {
    return <p>No games found.</p>;
  }

  return (
    <>
      <Heading>Game: {game.data.name}</Heading>
    </>
  );
};

export default Game;
