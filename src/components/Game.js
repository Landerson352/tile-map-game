import React from 'react';
import {
  Avatar,
  Box, Flex,
  Spinner,
  Stack,
  Text, useDisclosure,
  useToast,
} from '@chakra-ui/core';
import { find, map, reduce, uniqBy } from 'lodash';
import { useCopyToClipboard } from 'react-use';
import SimpleModal from '../lib/components/SimpleModal';
import { Link } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';

import Button from './Button';
import IconButton from './IconButton';
import {
  GameIdContext,
  // incrementGameUserScore,
  useGame,
  useGameId,
  useGameTiles,
  useGameUsers,
  useIncrementGameTurn,
  useMyGameTiles,
  useMyTurnCallback, usePlaceTile,
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
  const { ...restProps } = props;
  const game = useGame();
  const users = useGameUsers();

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
              <Avatar src={user.photoURL} pointerEvents="none" />
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
  const gameId = useGameId();
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

const AdvanceTurnTester = () => {
  const game = useGame();
  const incrementGameTurn = useIncrementGameTurn();

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

const StartGameButton = () => {
  const startGame = useStartGame();

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

const useMyTurnToaster = () => {
  const toast = useToast();
  useMyTurnCallback(() => {
    toast({
      title: 'It is your turn!',
      status: 'success',
      position: 'bottom',
    });
  });
};

const AddPlayerButton = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton {...props} onClick={onOpen} />
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
  const startGame = useStartGame();

  return (
    <IconButton {...props} onClick={startGame} />
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
  const { x, y } = props;
  const tileData = { x, y };
  const placeTile = usePlaceTile();
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

  const [, { setTileFocus }] = useAppState();
  const handleClick = () => {
    setTileFocus(tileData);
  };

  return (
    <TileWrapper tileData={tileData}>
      <rect
        ref={drop}
        width={100}
        height={100}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
        onClick={handleClick}
      />
    </TileWrapper>
  );
};

const TileFocusRing = () => {
  const [{ tileFocus }] = useAppState();
  const tiles = useGameTiles();

  if (!tiles.loaded || !tileFocus) return null;

  const isFocusedTileEmpty = !find(tiles.data, tileFocus);

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
  const game = useGame();
  const myTiles = useMyGameTiles();
  const tiles = useGameTiles();
  const svgRef = usePanZoom();
  useMyTurnToaster();

  if (!game.loaded || !myTiles.loaded || !tiles.loaded) {
    return <p>Loading...</p>;
  }

  if (game.isEmpty) {
    return <p>No game info found.</p>;
  }

  const gameHasStarted = game.data.currentTurnUserId;

  // create sockets near existing tiles
  const createSocket = (x, y) => ({
    key: [x, y].join('_'),
    x,
    y,
  });
  let tileSockets = [];
  if (tiles.isEmpty) {
    tileSockets = [createSocket(0, 0)]
  } else {
    tileSockets = reduce(tiles.data, (sum, tile) => {
      const { x, y } = tile;
      return [
        ...sum,
        createSocket(x - 1, y),
        createSocket(x + 1, y),
        createSocket(x, y - 1),
        createSocket(x, y + 1),
      ];
    }, []);
    // remove duplicates
    tileSockets = uniqBy(tileSockets, 'key');
  }

  return (
    <>
      {gameHasStarted ? (
        <>
          <Box viewBox="-200 -200 400 400" as="svg" cursor="pointer" height="100%" width="100%" _focus={{ outline: 'none' }}>
            <g ref={svgRef}>
              {map(tileSockets, ({ key, x, y }) => (
                <TileSocket
                  key={key}
                  x={x}
                  y={y}
                />
              ))}
              {map(tiles.data, (tile) => (
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
              {map(myTiles.data, (tile, i) => (
                <InventoryTile key={i} tileData={tile} />
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
          <ResetGameButton icon="redo-alt" isRound />
          <IconButton as={Link} to="/" icon="power-off" isRound />
          <AdvanceTurnTester />
        </Stack>
      </Stack>
    </>
  );
};

const Game = (props) => {
  return (
    <GameIdContext.Provider value={props.match.params['gameId']}>
      <GameView />
    </GameIdContext.Provider>
  );
};

export default Game;
