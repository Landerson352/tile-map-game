import React from 'react';
import {
  Avatar,
  // AvatarBadge,
  Box, Flex,
  // Modal,
  // ModalContent,
  Spinner,
  Stack,
  Text, useDisclosure,
  useToast,
} from '@chakra-ui/core';
import { find, map, times } from 'lodash';
import { useCopyToClipboard } from 'react-use';
import SimpleModal from '../lib/components/SimpleModal';
import { Link } from 'react-router-dom';

import Button from './Button';
import IconButton from './IconButton';
import {
  // incrementGameUserScore,
  useGame,
  // useGameTiles,
  useGameUsers,
  useIncrementGameTurn,
  useMyGameTiles,
  useMyTurnCallback,
  useStartGame,
} from '../db';
import useAppState from '../useAppState';
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

  const usersInTurnOrder = map(game.data.userIds, (id) => {
    return find(users.data, { id });
  });

  return (
    <Stack isInline spacing={4} {...restProps}>
      {map(usersInTurnOrder, (user, i) => {
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

const StartGameButton = (props) => {
  const { gameId } = props;
  const startGame = useStartGame(gameId);

  return (
    <Button
      onClick={startGame}
      rightIcon="arrow-alt-to-right"
      size="lg"
      variantColor="green"
    >
      Start game
    </Button>
  );
};

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

const ResetGameButton = (props) => {
  const { gameId, ...restProps } = props;
  const startGame = useStartGame(gameId);

  return (
    <IconButton {...restProps} onClick={startGame} />
  );
};

const TileWrapper = (props) => {
  const { size = 100, tileData = {}, ...restProps } = props;
  const { x = 4.5, y = 4.5 } = tileData;

  const transforms = [
    `translate(${(x - 4.5) * size}px, ${(y - 4.5) * size}px)`,
    `scale(${size / 100})`,
  ];

  return (
    <g style={{ transform: transforms.join(' ') }} {...restProps} />
  );
};

const Tile = (props) => {
  const { tileData } = props;
  const [, { setTileFocus }] = useAppState();
  const handleClick = () => {
    setTileFocus(tileData);
  };

  return (
    <TileWrapper onClick={handleClick}  {...props}>
      <rect width={100} height={100} fill="green" stroke="green" strokeWidth={2} />
    </TileWrapper>
  );
};

const TileSocket = (props) => {
  return (
    <TileWrapper {...props}>
      <rect width={100} height={100} fill="transparent" stroke="#ddd" strokeWidth={1} />
    </TileWrapper>
  );
};

const TileFocusRing = (props) => {
  return (
    <TileWrapper {...props}>
      <rect width={108} height={108} x={-4} y={-4} rx={2} fill="transparent" stroke="red" strokeWidth={4} />
    </TileWrapper>
  );
};

const Game = (props) => {
  const { gameId } = props.match.params;

  const game = useGame(gameId);
  const tiles = useMyGameTiles(gameId);
  const svgRef = usePanZoom();
  useMyTurnToaster(gameId);
  const [{ tileFocus }] = useAppState();

  if (!game.loaded || !tiles.loaded) {
    return <p>Loading...</p>;
  }

  if (game.isEmpty) {
    return <p>No game info found.</p>;
  }

  const gameHasStarted = game.data.currentTurnUserId;

  return (
    <>
      {gameHasStarted ? (
        <>
          <Box viewBox="-1000 -1000 2000 2000" as="svg" cursor="pointer" height="100%" width="100%" _focus={{ outline: 'none' }}>
            <g ref={svgRef}>
              {times(10, (y) => (
                <React.Fragment key={y}>
                  {times(10, (x) => (
                    <TileSocket
                      key={x}
                      tileData={{
                        x,
                        y,
                      }}
                    />
                  ))}
                </React.Fragment>
              ))}
              {times(2, (y) => (
                <React.Fragment key={y}>
                  {times(2, (x) => (
                    <Tile
                      key={x}
                      tileData={{
                        x,
                        y,
                      }}
                    />
                  ))}
                </React.Fragment>
              ))}
              {!!tileFocus && (
                <TileFocusRing
                  tileData={tileFocus}
                />
              )}
            </g>
          </Box>
          <Stack isInline justifyContent="center" position="fixed" bottom={2} left={0} right={0}>
            <Stack isInline alignItems="center" justifyContent="center" bg="gray.300" p={4} rounded={16} pointerEvents="all" spacing={4}>
              {map(tiles.data, (tile, i) => (
                <Box key={i}>
                  <svg width={100} height={100}>
                    <Tile />
                  </svg>
                </Box>
              ))}
            </Stack>
          </Stack>
        </>
      ) : (
        <Flex height="100%" alignItems="center" justifyContent="center">
          <Stack width={220}>
            <StartGameButton gameId={gameId} />
          </Stack>
        </Flex>
      )}
      <Stack isInline justifyContent="center" position="fixed" top={2} left={0} right={0}>
        <Stack isInline alignItems="center" justifyContent="center" bg="gray.300" py={2} px={4} rounded={36} pointerEvents="all" spacing={3}>
          <Players gameId={gameId} marginRight={16} />
          <AddPlayerButton gameId={gameId} icon="user-plus" isRound />
          <ResetGameButton gameId={gameId} icon="redo-alt" isRound />
          <IconButton as={Link} to="/" icon="power-off" isRound />
          <AdvanceTurnTester gameId={gameId} />
        </Stack>
      </Stack>
    </>
  );
};

export default Game;
