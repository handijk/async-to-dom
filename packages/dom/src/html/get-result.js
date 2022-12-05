import { SPECIAL_REGEX } from './constants.js';

export const getResult = (item, items) =>
  item
    .split(SPECIAL_REGEX)
    .map((item, index) => (index % 2 === 0 ? item : items[parseInt(item, 10)]));
