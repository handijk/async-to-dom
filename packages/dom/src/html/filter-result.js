export const filterResult = (items) => {
  const filtered = items.filter(
    (str) => typeof str !== 'string' || str.length > 0
  );
  return filtered.length === 1 ? filtered[0] : filtered;
};
