import React from 'react';
import {
  Avatar,
  Box,
  Flex,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/core';
import { map } from 'lodash';
import { useCopyToClipboard } from 'react-use';
import { Link } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';

import usePanZoom from '../lib/useSvgPanZoom';
import SimpleModal from '../lib/components/SimpleModal';
import useMyTurnToaster from '../utils/useMyTurnToaster';
import { AuthorizedVMProvider } from '../vms/authorized';
import { GameVMProvider, useGameVM } from '../vms/game';
import Button from './Button';
import IconButton from './IconButton';
import Suspender from './Suspender';

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
  const { currentTurnUserId, usersInTurnOrder } = useGameVM();

  return (
    <Stack isInline spacing={4} {...props}>
      {map(usersInTurnOrder, (user, i) => {
        const firstName = user.displayName.split(' ')[0];
        const isCurrentTurn = (user.id === currentTurnUserId);
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
              {/*<Button size="xs" onClick={() => incrementUserScore(user.id, 100)}>+100</Button>*/}
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
};

const InvitationButton = (props) => {
  const { game } = useGameVM();
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
      variant="outline"
      variantColor={variantColor}
      onClick={() => copyToClipboard(game.id)}
      {...props}
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
  const { currentTurnUserId, incrementTurn } = useGameVM();

  return (
    <Button
      rightIcon="arrow-alt-to-right"
      onClick={incrementTurn}
      {...props}
    >
      {currentTurnUserId ? 'End turn' : 'Start game'}
    </Button>
  );
};

const StartGameButton = () => {
  const { restart } = useGameVM();

  return (
    <Button
      onClick={restart}
      rightIcon="arrow-alt-to-right"
      size="lg"
      variantColor="green"
    >
      Start game
    </Button>
  );
};

const AddPlayerButton = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton onClick={onOpen} {...props} />
      <SimpleModal
        title="Invite more players"
        isOpen={isOpen}
        onClose={onClose}
      >
        <Text marginBottom={4}>
          Send the invitation code to your friends.
          They can use it in the "Join game" option on the main menu.
        </Text>
        <InvitationButton autoFocus />
      </SimpleModal>
    </>
  );
};

const ResetGameButton = (props) => {
  const { restart } = useGameVM();

  return (
    <IconButton onClick={restart} {...props} />
  );
};

const TileWrapper = (props) => {
  const { size = 100, tileData = {}, ...restProps } = props;
  const { x = 0.5, y = 0.5 } = tileData;

  const transforms = [
    `translate(${(x - 0.5) * size}px, ${(y - 0.5) * size}px)`,
    `scale(${size / 100})`,
  ];

  return (
    <g style={{ transform: transforms.join(' ') }} {...restProps} />
  );
};

const Tile = (props) => {
  const { tileData } = props;
  const { setTileFocus } = useGameVM();

  return (
    <TileWrapper onClick={() => setTileFocus(tileData)} {...props}>
      <rect width={100} height={100} fill="green" stroke="green" strokeWidth={2} />
    </TileWrapper>
  );
};

const TileSocket = (props) => {
  const { x, y } = props;
  const tileData = { x, y };
  const { placeTile, setTileFocus } = useGameVM();
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'TILE',
    drop: ({ tileData: { id } }) => {
      return placeTile(id, x, y)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  });

  let fill = 'transparent';
  let stroke = '#ddd';
  if (isOver) {
    if (canDrop) {
      fill = 'rgba(0,0,255,0.2)';
      stroke = 'blue';
    } else {
      fill = 'rgba(255,0,0,0.2)';
      stroke = 'red';
    }
  }

  return (
    <TileWrapper tileData={tileData}>
      <rect
        ref={drop}
        width={100}
        height={100}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
        onClick={() => setTileFocus(tileData)}
      />
    </TileWrapper>
  );
};

const TileFocusRing = () => {
  const { isFocusedTileEmpty, tileFocus } = useGameVM();

  if (!tileFocus) return null;

  return (
    <TileWrapper tileData={tileFocus}>
      <rect
        style={{ pointerEvents: 'none' }}
        width={108}
        height={108}
        x={-4}
        y={-4}
        rx={2}
        fill="transparent"
        stroke={isFocusedTileEmpty ? 'cyan' : 'red'}
        strokeWidth={4}
      />
    </TileWrapper>
  );
};

const InventoryTile = (props) => {
  const { tileData } = props;
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: 'TILE',
      tileData,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });

  return (
    <Box
      ref={drag}
      style={{
        opacity: isDragging ? 0 : 1,
      }}
    >
      <svg width={100} height={100}>
        <Tile />
      </svg>
    </Box>
  );
};

const GameView = () => {
  const vm = useGameVM();
  const { gameId, hasStarted, myTiles, tiles, tileSockets } = vm;
  const svgRef = usePanZoom();
  useMyTurnToaster(gameId);

  return (
    <Suspender {...vm}>
      {() => (
        <>
          {hasStarted ? (
            <>
              <Box viewBox="-200 -200 400 400" as="svg" cursor="pointer" height="100%" width="100%" _focus={{ outline: 'none' }}>
                <g ref={svgRef}>
                  {map(tileSockets, ({ key, x, y }) => (
                    <TileSocket
                      key={key}
                      gameId={gameId}
                      x={x}
                      y={y}
                    />
                  ))}
                  {map(tiles, (tile) => (
                    <Tile
                      key={tile.id}
                      tileData={tile}
                    />
                  ))}
                  <TileFocusRing />
                </g>
              </Box>
              <Stack isInline justifyContent="center" position="fixed" bottom={2} left={0} right={0}>
                <Stack isInline alignItems="center" justifyContent="center" bg="gray.300" p={4} rounded={16} pointerEvents="all" spacing={4} shouldWrapChildren>
                  {map(myTiles, (tile, i) => (
                    <InventoryTile key={i} tileData={tile} />
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
      )}
    </Suspender>
  );
};

const Game = (props) => (
  <AuthorizedVMProvider>
    <GameVMProvider gameId={props.match.params.gameId}>
      <GameView />
    </GameVMProvider>
  </AuthorizedVMProvider>
);

export default Game;
