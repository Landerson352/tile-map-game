import React from 'react';
import {
  Avatar,
  // Box,
  Button,
  // Heading,
  Spinner,
  Stack,
  Text
} from '@chakra-ui/core';
import { map } from 'lodash';
import { useCopyToClipboard } from 'react-use';

import {
  useGame,
  useGameUsers,
} from '../db';

const Players = (props) => {
  const { gameId } = props;
  const users = useGameUsers(gameId);

  if (!users.loaded) return (
    <Spinner />
  );

  return (
    <Stack>
      {map(users.data, (user) => (
        <Stack key={user.id} isInline alignItems="center">
          <Avatar src={user.photoURL} />
          <Text>{user.displayName}</Text>
        </Stack>
      ))}
    </Stack>
  );
};

const InvitationButton = (props) => {
  const { gameId } = props;
  const [state, copyToClipboard] = useCopyToClipboard();

  let icon = 'copy';
  if (state.error) icon = 'warning-2';
  else if (state.value) icon = 'check';

  return (
    <Button
      rightIcon={icon}
      onClick={() => copyToClipboard(gameId)}
      variant="outline"
      size="xs"
      variantColor="green"
    >
      copy invitation code
    </Button>
  );
};

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
      <InvitationButton gameId={gameId} />
      <Players gameId={gameId} />
    </>
  );
};

export default Game;
