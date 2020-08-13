import { pipe, tupled } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { Area } from "../types";

export const moveShip = <R>(area: Area, fn: (a: number, b: number) => R) => {
  return (i: number): O.Option<R> =>
    pipe(
      i,
      (index): O.Option<[number, number]> =>
        area[index] ? O.some([index, area[index]]) : O.none,
      O.map(tupled(fn))
    );
};
