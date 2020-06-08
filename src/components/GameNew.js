import React from 'react';
import { map } from 'lodash';
import { Box } from '@chakra-ui/core';

import Button from './Button';
import Splay from './Splay';
import Suspender from './Suspender';
import { useGameVM, GameVMProvider } from '../viewmodels/game';

const GameView = () => {
  const vm = useGameVM();

  return (
    <Suspender {...vm}>
      {() => (
        <>
          <Splay type="Game" {...vm.game} />
          <Box mb={8}>
            <Button onClick={vm.incrementTurn}>Next turn</Button>
          </Box>
          <hr />
          {map(vm.users, (user) => (
            <Splay key={user.id} type="User" {...user}>
              <Box mb={8}>
                <Button onClick={() => vm.incrementUserScore(user.id, 100)}>+100 pts</Button>
              </Box>
            </Splay>
          ))}
          <hr />
          {map(vm.tiles, (tile) => (
            <Splay key={tile.id} type="Tile" {...tile} />
          ))}
        </>
      )}
    </Suspender>
  );
};

const GameNew = (props) => (
  <GameVMProvider gameId={props.match.params.gameId}>
    <GameView />
  </GameVMProvider>
);

export default GameNew;
