import { isEmpty, reduce, uniqBy } from 'lodash';

const createSocket = (x, y) => ({
  key: [x, y].join('_'),
  x,
  y,
});

const createSockets = (tiles) => {
  let tileSockets = [];
  if (isEmpty(tiles)) {
    tileSockets = [createSocket(0, 0)]
  } else {
    tileSockets = reduce(tiles, (sum, tile) => {
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
  return tileSockets;
};

export default createSockets;
