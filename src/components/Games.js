import React from 'react';
import { isEmpty, map } from 'lodash';
import { useForm } from 'react-hook-form';

import {
  Button,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from './ui';
import useGames from '../hooks/useGames';

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
        <li key={game.id}>{game.name}</li>
      ))}
    </ul>
  );
};

function NewGameModal() {
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

      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>New game</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input name="name" placeholder="Untitled Game" ref={register({ maxLength: 30 })} autoFocus />
            </ModalBody>
            <ModalFooter>
              <Button name="name" type="submit">Save</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

const Games = () => (
  <>
    <Heading>Games</Heading>
    <GamesListing />
    <NewGameModal />
  </>
);

export default Games;
