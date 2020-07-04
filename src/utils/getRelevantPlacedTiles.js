const getRelevantPlacedTiles = (tile, grid) => {
  const { x, y } = tile;
  const surroundingTiles = [];
  const surroundingTilesWithMatchingBiome = [];
  const surroundingTilesWithMatchingBiomeAndPoi = [];

  const checkForSurroundingTile = (testTile) => {
    if (testTile) {
      surroundingTiles.push(testTile);
      if (testTile.biome === tile.biome) {
        surroundingTilesWithMatchingBiome.push(testTile);
        if (testTile.isPoi) {
          surroundingTilesWithMatchingBiomeAndPoi.push(testTile);
        }
      }
    }
  };

  checkForSurroundingTile(grid[`${x - 1}_${y - 1}`]);
  checkForSurroundingTile(grid[`${x}_${y - 1}`]);
  checkForSurroundingTile(grid[`${x + 1}_${y - 1}`]);

  checkForSurroundingTile(grid[`${x - 1}_${y}`]);
  checkForSurroundingTile(grid[`${x + 1}_${y}`]);

  checkForSurroundingTile(grid[`${x - 1}_${y + 1}`]);
  checkForSurroundingTile(grid[`${x}_${y + 1}`]);
  checkForSurroundingTile(grid[`${x + 1}_${y + 1}`]);

  return {
    surroundingTiles,
    surroundingTilesWithMatchingBiome,
    surroundingTilesWithMatchingBiomeAndPoi,
  };
};

export default getRelevantPlacedTiles;
