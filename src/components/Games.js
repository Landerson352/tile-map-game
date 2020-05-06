import React from 'react';
import { isEmpty, map } from 'lodash';
import { useForm } from 'react-hook-form';
import {
  Box,
  Flex,
  Input,
  Spinner,
  Stack,
  useDisclosure
} from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';

import Button from './Button';
import SimpleModal from '../lib/components/SimpleModal';
import {
  useAddGame,
  useJoinGame,
  useMyGames,
  useMyUser,
} from '../db';
import useAuth from '../lib/useAuth';

// const HostOptions = (props) => {
//   const { game } = props;
//   const auth = useAuth();
//   const host = useUser(game.hostUserId);
//   const [state, copyToClipboard] = useCopyToClipboard();
//
//   let icon = 'copy';
//   if (state.error) icon = 'warning-2';
//   else if (state.value) icon = 'check';
//
//   if (!host.loaded) return null;
//
//   const hostIsMe = game.hostUserId === auth.user.uid;
//
//   if (!hostIsMe) return `Host: ${host.data.displayName}`;
//
//   return (
//     <Button
//       rightIcon={icon}
//       onClick={() => copyToClipboard(game.id)}
//       variant="outline"
//       size="xs"
//       variantColor="green"
//     >
//       copy invitation code
//     </Button>
//   );
// };

const GamesListing = () => {
  const history = useHistory();
  const games = useMyGames();

  if (!games.loaded) {
    return <Spinner />;
  }

  if (games.isEmpty) {
    return <p>No games found.</p>;
  }

  return (
    <Stack>
      {map(games.data, (game, i) => (
        <Button
          key={game.id}
          onClick={() => history.push(`game/${game.id}`)}
          variant="outline"
          size="lg"
          variantColor="green"
          autoFocus={i === 0}
        >
          <Stack isInline justifyContent="space-between" width="100%">
            <Box>{game.name}</Box>
            <Box>{game.userIds.length} players</Box>
          </Stack>
        </Button>
      ))}
    </Stack>
  );
};

const NewGameButton = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const addGame = useAddGame();
  const history = useHistory();

  const onSubmit = async (values) => {
    const game = await addGame(values);
    history.push(`game/${game.id}`);
  };

  return (
    <>
      <Button {...props} onClick={onOpen}>New game</Button>
      <SimpleModal
        title="Name your game"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit(onSubmit)}
        footer={<Button type="submit" rightIcon="arrow-alt-right">Start playing</Button>}
      >
        <Input
          name="name"
          placeholder="Untitled Game"
          ref={register({ maxLength: 30, required: 'Required' })}
          autoFocus
        />
      </SimpleModal>
    </>
  );
};

const JoinGameButton = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const joinGame = useJoinGame();
  const history = useHistory();

  const onSubmit = async (values) => {
    const { gameId } = values;
    await joinGame(gameId);
    history.push(`game/${gameId}`);
  };

  return (
    <>
      <Button {...props} onClick={onOpen}>Join game</Button>
      <SimpleModal
        title="Enter invitation code"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit(onSubmit)}
        footer={<Button type="submit" rightIcon="arrow-alt-right">Join game</Button>}
      >
        <Input
          name="gameId"
          placeholder="xxxxxxxxxxxx"
          ref={register({ maxLength: 20, required: 'Required' })}
          autoFocus
        />
      </SimpleModal>
    </>
  );
};

const LoadGameButton = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const myUser = useMyUser();

  const disabled = !myUser.loaded || isEmpty(myUser.data.gameIds);

  return (
    <>
      <Button  {...props} onClick={onOpen} disabled={disabled}>Load game</Button>
      <SimpleModal
        title="Saved games"
        isOpen={isOpen}
        onClose={onClose}
      >
        <GamesListing />
      </SimpleModal>
    </>
  );
};

const Games = () => {
  const auth = useAuth();

  return (
    <Flex height="100%" alignItems="center" justifyContent="center">
      <Stack width={220}>
        <NewGameButton />
        <LoadGameButton />
        <JoinGameButton />
        <Button
          onClick={auth.signOut}
          alignSelf="center"
          variant="outline"
          size="sm"
          marginTop={4}
          minWidth={128}
          rightIcon="sign-out-alt"
        >
          Log out
        </Button>
      </Stack>
    </Flex>
  );
};

export default Games;
