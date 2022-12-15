export const filterResult = (items) => {
  const filtered = items.filter(
    (str) => typeof str !== 'string' || str.length > 0
  );
  if (filtered.length === 0) {
    return null;
  }
  if (filtered.length === 1) {
    return filtered[0];
  }
  return filtered;
};
