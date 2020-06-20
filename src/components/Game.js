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
import { map, times } from 'lodash';
import { useCopyToClipboard } from 'react-use';
import { Link } from 'react-router-dom';

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

const AdvanceTurnTester = (props) => {
  const { canPlaceFocusedTile, hasStarted, placeFocusedTile } = useGameVM();

  if (!hasStarted) return null;

  return (
    <Button
      rightIcon="arrow-alt-to-right"
      onClick={placeFocusedTile}
      {...props}
      disabled={!canPlaceFocusedTile}
    >
      End turn
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

// const ResetGameButton = (props) => {
//   const { restart } = useGameVM();
//
//   return (
//     <IconButton onClick={restart} {...props} />
//   );
// };

const TileWrapper = (props) => {
  const { size = 100, tileData = {}, ...restProps } = props;
  const { x = 0.5, y = 0.5 } = tileData;

  const transforms = [
    `translate(${(x - 0.5) * size}px, ${(y - 0.5) * size}px)`,
    `scale(${size / 100})`,
  ];

  return (
    <g style={{ transform: transforms.join(' '), transition: 'transform 0.3s' }} {...restProps} />
  );
};

const Tile = (props) => {
  const { selected, tileData } = props;
  const { roads = 'cccc', rotation = 0 } = tileData;
  const rotatedRoads = (roads + roads).substr(rotation, 4);
  return (
    <TileWrapper {...props}>
      {!!tileData.id && (
        <>
          <rect width={100} height={100} fill={tileData.color} />
          {rotatedRoads[0] === 'o' && (
            <rect
              width={16}
              height={50 + 8}
              x={50 - 8}
              y={0}
              fill="black"
            />
          )}
          {rotatedRoads[1] === 'o' && (
            <rect
              width={50 + 8}
              height={16}
              x={50 - 8}
              y={50 - 8}
              fill="black"
            />
          )}
          {rotatedRoads[2] === 'o' && (
            <rect
              width={16}
              height={50 + 8}
              x={50 - 8}
              y={50 - 8}
              fill="black"
            />
          )}
          {rotatedRoads[3] === 'o' && (
            <rect
              width={50 + 8}
              height={16}
              x={0}
              y={50 - 8}
              fill="black"
            />
          )}
        </>
      )}
      {selected && (
        <rect
          style={{ pointerEvents: 'none' }}
          width={108}
          height={108}
          x={-4}
          y={-4}
          rx={2}
          fill="transparent"
          stroke="cyan"
          strokeWidth={4}
        />
      )}
    </TileWrapper>
  );
};

const TileSocket = (props) => {
  const { x, y } = props;
  const tileData = { x, y };
  const { setFocusedSocket } = useGameVM();

  return (
    <TileWrapper tileData={tileData} cursor="pointer">
      <rect
        width={84}
        height={84}
        x={8}
        y={8}
        rx={8}
        fill="transparent"
        stroke="#ddd"
        strokeDasharray="8 2"
        strokeWidth={2}
        onClick={() => setFocusedSocket({ x, y })}
      />
    </TileWrapper>
  );
};

// const TileFocusRing = () => {
//   const { focusedSocket } = useGameVM();
//
//   if (!focusedSocket) return null;
//
//   return (
//     <TileWrapper tileData={focusedSocket}>
//       <rect
//         style={{ pointerEvents: 'none' }}
//         width={108}
//         height={108}
//         x={-4}
//         y={-4}
//         rx={2}
//         fill="transparent"
//         stroke="cyan"
//         strokeWidth={4}
//       />
//     </TileWrapper>
//   );
// };

const InventoryTile = (props) => {
  const { tileData } = props;
  const { focusedTile, setFocusedTileId } = useGameVM();
  const isFocused = tileData.id === focusedTile?.id;

  return (
    <Box
      onClick={() => setFocusedTileId(tileData.id)}
      cursor="pointer"
      margin="-8px"
    >
      <svg width={116} height={116} viewBox="-8 -8 116 116">
        <Tile tileData={tileData} selected={isFocused} />
      </svg>
    </Box>
  );
};

const GameView = () => {
  const vm = useGameVM();
  const { drawTile, emptySlotsInHand, focusedTile, focusedSocket, gameId, hasStarted, myTilesInHand, placedTiles, tileSockets } = vm;
  const svgRef = usePanZoom();
  useMyTurnToaster(gameId);

  return (
    <Suspender {...vm}>
      {() => (
        <>
          {hasStarted ? (
            <>
              <Box viewBox="-200 -200 400 400" as="svg" height="100%" width="100%" _focus={{ outline: 'none' }}>
                <g ref={svgRef}>
                  {map(tileSockets, ({ key, x, y }) => (
                    <TileSocket
                      key={key}
                      x={x}
                      y={y}
                    />
                  ))}
                  {map(placedTiles, (tile) => (
                    <Tile
                      key={tile.id}
                      tileData={tile}
                    />
                  ))}
                  {focusedSocket && (
                    <Tile selected tileData={{ ...focusedTile, ...focusedSocket }} />
                  )}
                </g>
              </Box>
              <Stack isInline justifyContent="center" position="fixed" bottom={2} left={0} right={0}>
                <Stack isInline alignItems="center" justifyContent="center" bg="gray.300" p={4} rounded={16} pointerEvents="all" spacing={4} shouldWrapChildren>
                  {map(myTilesInHand, (tile, i) => (
                    <InventoryTile key={i} tileData={tile} />
                  ))}
                  {times(emptySlotsInHand, (i) => (
                    <Flex key={i} width={100} height={100} alignItems="center" justifyContent="center">
                      {i === emptySlotsInHand - 1 && (
                        <Button onClick={drawTile}>Draw</Button>
                      )}
                    </Flex>
                  ))}
                </Stack>
              </Stack>
            </>
          ) : (
            <Flex height="100%" alignItems="center" justifyContent="center">
              <Stack width={220}>
                <StartGameButton />
              </Stack>
            </Flex>
          )}
          <Stack isInline justifyContent="center" position="fixed" top={2} left={0} right={0}>
            <Stack isInline alignItems="center" justifyContent="center" bg="gray.300" py={2} px={4} rounded={36} pointerEvents="all" spacing={3}>
              <Players marginRight={16} />
              <AddPlayerButton icon="user-plus" isRound />
              {/*<ResetGameButton icon="redo-alt" isRound />*/}
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
