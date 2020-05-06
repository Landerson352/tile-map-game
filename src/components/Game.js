import React from 'react';
import {
  Avatar,
  AvatarBadge,
  Box,
  Spinner,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/core';
import { map } from 'lodash';
import { useCopyToClipboard } from 'react-use';

import Button from './Button';
import {
  incrementGameUserScore,
  useGame,
  useGameUsers,
  useIncrementGameTurn,
  useMyTurnCallback,
} from '../db';
import usePanZoom from '../lib/useSvgPanZoom';

const Players = (props) => {
  const { gameId } = props;
  const game = useGame(gameId);
  const users = useGameUsers(gameId);

  if (!game.loaded || !users.loaded) return (
    <Spinner />
  );

  return (
    <Stack>
      {map(users.data, (user) => {
        const firstName = user.displayName.split(' ')[0];
        const isCurrentTurn = (user.id === game.data.currentTurnUserId);
        return (
          <Stack key={user.id} isInline alignItems="center">
            <Avatar src={user.photoURL}>
              {isCurrentTurn && (
                <AvatarBadge size="1em" bg="green.500" />
              )}
            </Avatar>
            <Text>{firstName}</Text>
            <Text>Score: {user.score || 0}</Text>
            <Button size="xs" onClick={() => incrementGameUserScore(gameId, user.id, 100)}>+100</Button>
          </Stack>
        );
      })}
    </Stack>
  );
};

const InvitationButton = (props) => {
  const { gameId } = props;
  const [state, copyToClipboard] = useCopyToClipboard();

  let icon = 'copy';
  let variantColor = 'green';
  if (state.error) {
    icon = 'exclamation-triangle';
    variantColor = 'orange';
  }
  else if (state.value) icon = 'check';

  return (
    <Button
      rightIcon={icon}
      onClick={() => copyToClipboard(gameId)}
      variant="outline"
      size="xs"
      variantColor={variantColor}
    >
      copy invitation code
    </Button>
  );
};

// const AddToScoreTester = (props) => {
//   const { gameId } = props;
//   const myGameUser = useMyGameUser(gameId);
//
//   if (!myGameUser.loaded) return null;
//
//   const score = myGameUser.data.score || 0;
//
//   const onClick = () => {
//     console.log(gameId, myGameUser.data.id);
//     return incrementGameUserScore(gameId, myGameUser.data.id, 352)
//   };
//
//   return (
//     <>
//       <p>My score: {score}</p>
//       <Button onClick={onClick}>Add to my score</Button>
//     </>
//   );
// };

const AdvanceTurnTester = (props) => {
  const { gameId } = props;
  const game = useGame(gameId);
  const incrementGameTurn = useIncrementGameTurn(gameId);

  if (!game.loaded) return null;

  return (
    <Button
      onClick={incrementGameTurn}
      rightIcon="arrow-alt-to-right"
    >
      {game.data.currentTurnUserId ? 'End turn' : 'Start game'}
    </Button>
  );
};

const useMyTurnToaster = (gameId) => {
  const toast = useToast();
  useMyTurnCallback(gameId, () => {
    toast({
      title: 'It is your turn!',
      status: 'success',
    });
  });
};

const Game = (props) => {
  const { gameId } = props.match.params;
  const game = useGame(gameId);
  const svgRef = usePanZoom();
  useMyTurnToaster(gameId);

  if (!game.loaded) {
    return <p>Loading...</p>;
  }

  if (game.isEmpty) {
    return <p>No games found.</p>;
  }

  return (
    <>
      <Box as="svg" id="svg-viewport" cursor="pointer" height="100%" width="100%" _focus={{ outline: 'none' }}>
        <g ref={svgRef}>
          <circle
            r={15}
            fill="white"
            stroke="red"
            strokeWidth={3}
          />
        </g>
      </Box>
      <Box position="fixed" bottom={0} left={0} right={0} bg="rgba(255,255,255,0.8)">
        <InvitationButton gameId={gameId} />
        <Players gameId={gameId} />
        <AdvanceTurnTester gameId={gameId} />
      </Box>
    </>
  );
};

export default Game;
