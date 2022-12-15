import { SPECIAL_REGEX } from './constants.js';

export const getResult = (string, items) =>
  string
    .split(SPECIAL_REGEX)
    .map((item, index) => (index % 2 === 0 ? item : items[parseInt(item, 10)]));
