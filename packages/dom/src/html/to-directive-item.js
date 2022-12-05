import { combineLatest, map, pipe } from 'create-async-generator';

export const toDirectiveItem = (nameItems, valueItems) => [
  ...nameItems,
  pipe(
    combineLatest(
      [
        '=',
        '"',
        (async function* () {
          yield '';
          yield valueItems;
        })(),
        '"',
      ],
      { eager: false }
    ),
    map((test) => test.join(''))
  ),
];
