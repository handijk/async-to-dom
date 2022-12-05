import { combineLatest, map, pipe } from 'create-async-generator';

export const renderIterableFactory = (item, { render, ...props }, ...args) =>
  render(
    pipe(
      combineLatest(item, { eager: true, flatten: Infinity, depth: Infinity }),
      map((value) => value.join(''))
    ),
    { ...props, render },
    ...args
  );
