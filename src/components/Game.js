import React from 'react';
import {
  Avatar,
  // AvatarBadge,
  Box,
  Spinner,
  Stack,
  Text, useDisclosure,
  useToast,
} from '@chakra-ui/core';
import { map } from 'lodash';
import { useCopyToClipboard } from 'react-use';
import SimpleModal from '../lib/components/SimpleModal';
import { Link } from 'react-router-dom';

import Button from './Button';
import IconButton from './IconButton';
import {
  // incrementGameUserScore,
  useGame,
  useGameUsers,
  // useIncrementGameTurn,
  useMyTurnCallback,
} from '../db';
import usePanZoom from '../lib/useSvgPanZoom';

const playerColors = [
  'cyan',
  'pink',
  'orange',
  'purple',
  'green',
  'yellow',
  'red',
  'blue',
  'teal'
];

const Players = (props) => {
  const { gameId, ...restProps } = props;
  const game = useGame(gameId);
  const users = useGameUsers(gameId);

  if (!game.loaded || !users.loaded) return (
    <Spinner />
  );

  return (
    <Stack isInline spacing={4} {...restProps}>
      {map(users.data, (user, i) => {
        const firstName = user.displayName.split(' ')[0];
        const isCurrentTurn = (user.id === game.data.currentTurnUserId);
        const color = playerColors[i];
        const strokeColor = `${color}.500`;
        const bgColor = `${color}.200`;
        return (
          <Stack key={user.id} isInline alignItems="center" borderRadius={8} borderWidth={4} borderColor={strokeColor} width={160} bg={bgColor} userSelect="none" position="relative" marginLeft={4}>
            <Box borderRadius="50%" borderWidth={4} borderColor={strokeColor} position="absolute" left={-28}>
              <Avatar src={user.photoURL} pointerEvents="none">
                {/*{isCurrentTurn && (*/}
                {/*  <AvatarBadge size="1em" bg={strokeColor} />*/}
                {/*)}*/}
              </Avatar>
              {isCurrentTurn && (
                <Spinner position="absolute" top={-9} left={-9} size={66} thickness={2} speed="0.5s" color="gray.600" emptyColor="white" opacity={1} />
              )}
            </Box>
            <Stack alignItems="center" fontWeight="bold" lineHeight={0.7} fontSize="lg" flex={1} padding={2} paddingLeft={6}>
              <Text>{firstName}</Text>
              <Text>{user.score || 0}</Text>
              {/*<Button size="xs" onClick={() => incrementGameUserScore(gameId, user.id, 100)}>+100</Button>*/}
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
};

const InvitationButton = (props) => {
  const { gameId, ...restProps } = props;
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
      variantColor={variantColor}
      {...restProps}
    >
      Copy invitation code
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

// const AdvanceTurnTester = (props) => {
//   const { gameId } = props;
//   const game = useGame(gameId);
//   const incrementGameTurn = useIncrementGameTurn(gameId);
//
//   if (!game.loaded) return null;
//
//   return (
//     <Button
//       onClick={incrementGameTurn}
//       rightIcon="arrow-alt-to-right"
//     >
//       {game.data.currentTurnUserId ? 'End turn' : 'Start game'}
//     </Button>
//   );
// };

const useMyTurnToaster = (gameId) => {
  const toast = useToast();
  useMyTurnCallback(gameId, () => {
    toast({
      title: 'It is your turn!',
      status: 'success',
      position: 'bottom',
    });
  });
};

const AddPlayerButton = (props) => {
  const { gameId, ...restProps } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton {...restProps} onClick={onOpen} />
      <SimpleModal
        title="Invite more players"
        isOpen={isOpen}
        onClose={onClose}
      >
        <Text marginBottom={4}>
          Send the invitation code to your friends.
          They can use it in the "Join game" option on the main menu.
        </Text>
        <InvitationButton gameId={gameId} autoFocus />
      </SimpleModal>
    </>
  );
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
      <Stack isInline justifyContent="center" position="fixed" top={2} left={0} right={0}>
        <Stack isInline alignItems="center" justifyContent="center" bg="gray.300" py={2} px={4} rounded={36} pointerEvents="all" spacing={3}>
          <Players gameId={gameId} marginRight={16} />
          <AddPlayerButton gameId={gameId} icon="user-plus" isRound />
          <IconButton as={Link} to="/" icon="power-off" isRound />
          {/*<AdvanceTurnTester gameId={gameId} />*/}
        </Stack>
      </Stack>
    </>
  );
};

export default Game;
