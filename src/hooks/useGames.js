import useCrud from '../lib/hooks/useCrud';

const useGames = (config) => useCrud({
  collection: 'games',
  defaultDocument: {
    name: 'Untitled Game',
  },
  ...config,
});

export default useGames;
