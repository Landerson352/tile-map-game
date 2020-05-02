import createEntity from '../lib/createEntity';

const GameEntity = createEntity({
  collection: 'games',
  defaultDocument: {
    name: 'Untitled Game',
  },
});

export default GameEntity;
