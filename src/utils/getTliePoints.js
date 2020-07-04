import getRelevantPlacedTiles from './getRelevantPlacedTiles';

const getTilePoints = (tile, placedTilesHash) => {
  const relevantTiles = getRelevantPlacedTiles(tile, placedTilesHash);
  let points = 0;
  points += relevantTiles.surroundingTiles.length + 1;
  if (tile.isPoi) {
    points += relevantTiles.surroundingTilesWithMatchingBiome.length;
  } else {
    points += relevantTiles.surroundingTilesWithMatchingBiomeAndPoi.length;
  }
  return points;
}

export default getTilePoints;
