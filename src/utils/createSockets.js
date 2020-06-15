import { isEmpty, reduce, uniqBy } from 'lodash';

const createSocket = (x, y) => ({
  key: [x, y].join('_'),
  x,
  y,
});

const createSockets = (tilesHash) => {
  let tileSockets = [];
  if (isEmpty(tilesHash)) {
    tileSockets = [createSocket(0, 0)]
  } else {
    tileSockets = reduce(tilesHash, (sum, tile) => {
      const { x, y } = tile;
      const newSum = [ ...sum ];
      if (!tilesHash[`${x - 1}_${y}`]) newSum.push(createSocket(x - 1, y));
      if (!tilesHash[`${x + 1}_${y}`]) newSum.push(createSocket(x + 1, y));
      if (!tilesHash[`${x}_${y - 1}`]) newSum.push(createSocket(x, y - 1));
      if (!tilesHash[`${x}_${y + 1}`]) newSum.push(createSocket(x, y + 1));
      return newSum;
    }, []);
    // remove duplicates
    tileSockets = uniqBy(tileSockets, 'key');
  }
  return tileSockets;
};

export default createSockets;
