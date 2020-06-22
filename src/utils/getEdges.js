const getEdges = (tile) => {
  const { roads = 'cccc', rotation = 0 } = tile;
  const rotationalOffset = - (rotation >= 0 ? rotation : rotation - Math.floor(rotation / 4) * 4);
  // const normalizedRotation = (rotation >= 0 ? rotation : rotation - Math.floor(rotation / 4) * 4) % 4;
  // const rotatedRoads = (roads + roads).substr(normalizedRotation, 4);

  return {
    roads: {
      top: roads.substr((0 + rotationalOffset) % 4, 1) === 'o',
      right: roads.substr((1 + rotationalOffset) % 4, 1) === 'o',
      bottom: roads.substr((2 + rotationalOffset) % 4, 1) === 'o',
      left: roads.substr((3 + rotationalOffset) % 4, 1) === 'o',
    },
  };
};

export default getEdges;
