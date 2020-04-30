import useCrud from '../lib/useCrud';

const useGames = () => useCrud({
  collection: 'games',
  defaultDocument: {
    name: 'Untitled Game',
  },
});

export default useGames;
