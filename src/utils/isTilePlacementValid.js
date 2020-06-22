import getEdges from '../utils/getEdges';

const isTilePlacementValid = (tile, grid) => {
  const { x, y } = tile;
  const edges = getEdges(tile);

  console.log(edges);

  console.log(grid[`${x}_${y - 1}`] && getEdges(grid[`${x}_${y - 1}`]).bottom !== edges.roads.top);
  console.log(grid[`${x + 1}_${y}`] && getEdges(grid[`${x + 1}_${y}`]).left !== edges.roads.right);
  console.log(grid[`${x}_${y + 1}`] && getEdges(grid[`${x}_${y + 1}`]).top !== edges.roads.bottom);
  console.log(grid[`${x - 1}_${y}`] && getEdges(grid[`${x - 1}_${y}`]).right !== edges.roads.left);

  if (grid[`${x}_${y - 1}`] && getEdges(grid[`${x}_${y - 1}`]).roads.bottom !== edges.roads.top) return false;
  if (grid[`${x + 1}_${y}`] && getEdges(grid[`${x + 1}_${y}`]).roads.left !== edges.roads.right) return false;
  if (grid[`${x}_${y + 1}`] && getEdges(grid[`${x}_${y + 1}`]).roads.top !== edges.roads.bottom) return false;
  if (grid[`${x - 1}_${y}`] && getEdges(grid[`${x - 1}_${y}`]).roads.right !== edges.roads.left) return false;

  return true;
};

export default isTilePlacementValid;
