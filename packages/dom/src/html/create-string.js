import { SPECIAL_DELIMITER, SPECIAL_STRING } from './constants.js';

export const createString = (strings, ...replacements) =>
  replacements
    .map((_replacement, i) => `${SPECIAL_STRING}${i}${SPECIAL_DELIMITER}`)
    .reduce((acc, curr, i) => [...acc, curr, strings[i + 1]], [strings[0]])
    .join('');
