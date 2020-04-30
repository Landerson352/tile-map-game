import React from 'react';
import { isEmpty, map } from 'lodash';
import { useForm } from 'react-hook-form';

import {
  Button,
  Heading,
  Input,
  useDisclosure
} from '../lib/components/ui';
import useGames from '../hooks/useGames';
import ModalForm from '../lib/components/ModalForm';

const GamesListing = () => {
  const games = useGames();

  if (!games.loaded) {
    return <p>Loading...</p>;
  }

  if (isEmpty(games.data)) {
    return <p>No games found.</p>;
  }

  return (
    <ul>
      {map(games.data, (game) => (
        <li key={game.id}>{game.name || 'Untitled game'}</li>
      ))}
    </ul>
  );
};

const NewGameModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const games = useGames();

  const onSubmit = (data) => {
    games.add(data).then(() => {
      onClose();
    });
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
          ref={register({ maxLength: 30 })}
          autoFocus
        />
      </ModalForm>
    </>
  );
};

const Games = () => (
  <>
    <Heading>Games</Heading>
    <GamesListing />
    <NewGameModal />
  </>
);

export default Games;
