export const clamp = (num, range = [0, 0]) => {
  const [min, max] = range;
  return Math.min(Math.max(num, min), max);
};

export const inRange = (x, range = [0, 0]) => {
  const [min, max] = range;
  return x >= min && x <= max;
};
