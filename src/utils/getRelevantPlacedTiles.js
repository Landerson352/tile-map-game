const getRelevantPlacedTiles = (tile, grid) => {
  const { x, y } = tile;
  const surroundingTiles = [];

  if (grid[`${x - 1}_${y - 1}`]) surroundingTiles.push(grid[`${x - 1}_${y - 1}`]);
  if (grid[`${x}_${y - 1}`]) surroundingTiles.push(grid[`${x}_${y - 1}`]);
  if (grid[`${x + 1}_${y - 1}`]) surroundingTiles.push(grid[`${x + 1}_${y - 1}`]);

  if (grid[`${x - 1}_${y}`]) surroundingTiles.push(grid[`${x - 1}_${y}`]);
  if (grid[`${x + 1}_${y}`]) surroundingTiles.push(grid[`${x + 1}_${y}`]);

  if (grid[`${x - 1}_${y + 1}`]) surroundingTiles.push(grid[`${x - 1}_${y + 1}`]);
  if (grid[`${x}_${y + 1}`]) surroundingTiles.push(grid[`${x}_${y + 1}`]);
  if (grid[`${x + 1}_${y + 1}`]) surroundingTiles.push(grid[`${x + 1}_${ y + 1}`]);

  return {
    surroundingTiles,
  };
};

export default getRelevantPlacedTiles;
