import { pipe, tupled } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";

export const moveShip = <R>(
  area: Record<number, number>,
  fn: (a: number, b: number) => R
) => (i: number): O.Option<R> =>
  pipe(
    i,
    (index): O.Option<[number, number]> =>
      area[index] ? O.some([index, area[index]]) : O.none,
    O.map(tupled(fn))
  );
