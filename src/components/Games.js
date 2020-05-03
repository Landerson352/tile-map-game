import React from 'react';
import { map } from 'lodash';
import { useForm } from 'react-hook-form';
import {
  Button,
  Heading,
  Input,
  useDisclosure
} from '@chakra-ui/core';
import { useCopyToClipboard } from 'react-use';
import { Link } from 'react-router-dom';

import ModalForm from '../lib/components/ModalForm';
import {
  useAddGame,
  useJoinGame,
  useMyGames,
} from '../db';

const CopyButton = (props) => {
  const { text } = props;
  const [state, copyToClipboard] = useCopyToClipboard();

  let icon = 'copy';
  if (state.error) icon = 'warning-2';
  else if (state.value) icon = 'check';

  return (
    <Button
      rightIcon={icon}
      onClick={() => copyToClipboard(text)}
    >
      copy
    </Button>
  );
};

const GamesListing = () => {
  const games = useMyGames();

  if (!games.loaded) {
    return <p>Loading...</p>;
  }

  if (games.isEmpty) {
    return <p>No games found.</p>;
  }

  return (
    <table>
      <thead>
      <tr>
        {/*<th>ID</th>*/}
        <th>Name</th>
        <th>Host</th>
        <th>Players</th>
        <th>Invitation</th>
      </tr>
      </thead>
      <tbody>
      {map(games.data, (game) => (
        <tr key={game.id}>
          {/*<td>{game.id}</td>*/}
          <td><Link to={`game/${game.id}`}>{game.name}</Link></td>
          <td>{game.host}</td>
          <td>{game.userIds.length}</td>
          <td><CopyButton text={game.id} /></td>
        </tr>
      ))}
      </tbody>
    </table>

  );
};

const NewGameModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const addGame = useAddGame();

  const onSubmit = async (values) => {
    await addGame(values);
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen}>New game</Button>
      <ModalForm
        title="New game"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          name="name"
          placeholder="Untitled Game"
          ref={register({ maxLength: 30, required: 'Required' })}
          autoFocus
        />
      </ModalForm>
    </>
  );
};

const JoinGameModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const joinGame = useJoinGame();

  const onSubmit = async (values) => {
    await joinGame(values.id);
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen}>Join game</Button>
      <ModalForm
        title="Join game"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          name="id"
          placeholder="xxxxxxxxxxxx"
          ref={register({ maxLength: 20, required: 'Required' })}
          autoFocus
        />
      </ModalForm>
    </>
  );
};

const Games = () => {
  return (
    <>
      <Heading>Games</Heading>
      <GamesListing />
      <NewGameModal />
      <JoinGameModal />
    </>
  );
};

export default Games;
