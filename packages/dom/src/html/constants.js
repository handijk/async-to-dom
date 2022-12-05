export const SPECIAL_STRING = 'data-zxs';
export const SPECIAL_DELIMITER = '__';
export const SPECIAL_PATTERN = `${SPECIAL_STRING}([0-9]+)${SPECIAL_DELIMITER}`;
export const SPECIAL_REGEX = new RegExp(SPECIAL_PATTERN);
