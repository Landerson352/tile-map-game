import { random, sumBy } from 'lodash';

const weightedSample = (collection) => {
  const max = sumBy(Object.keys(collection), (key) => collection[key].weight);
  const pick = random(0, max);
  let n = 0;
  for (let key in collection) {
    n += collection[key].weight;
    if (pick <= n) return key;
  }
};

export default weightedSample;
