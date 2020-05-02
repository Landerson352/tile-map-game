import React from 'react';
import { map } from 'lodash';
import { useForm } from 'react-hook-form';
import {
  Button,
  Heading,
  Input,
  useDisclosure
} from '@chakra-ui/core';

import ModalForm from '../lib/components/ModalForm';
import GameEntity from '../entities/GameEntity';

const GamesListing = () => {
  const games = GameEntity.useCollectionData();

  if (!games.loaded) {
    return <p>Loading...</p>;
  }

  if (games.isEmpty) {
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

  const onSubmit = (data) => GameEntity.add(data).then(onClose);

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
