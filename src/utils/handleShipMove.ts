import type { Tile } from "../types";
import { config } from "./config";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe, constFalse } from "fp-ts/lib/function";
import { isAdjacent, isWithinBoard } from "./isAdjacent";

type Board = Tile[];
type Wind = 0 | 1 | 2 | 3;

const spaceFromIndex = (board: Board, index: number) => A.lookup(index)(board);

const isLand = (board: Board, index: number) =>
  pipe(
    spaceFromIndex(board, index),
    O.map(({ isLand }: Tile) => isLand),
    O.getOrElse(constFalse)
  );

const getWindBoost = (x: Wind) => (y: Wind): -1 | 0 | 1 => {
  if (x % 2 === y % 2) {
    return 0;
  }
  return x === y ? 1 : -1;
};

const getMultiplier = (x: Wind) => (y: Wind): number => (x === y ? 2 : 1);

const getAround = (
  board: Board,
  windDirection: 0 | 1 | 2 | 3,
  roll: number
) => {
  const windBoost = getWindBoost(windDirection);
  const windMultiplier = getMultiplier(windDirection);
  const untilMultiplier = (w: Wind) => windMultiplier(w) - 1;
  return function rec(
    index: number,
    until = roll,
    boost: -1 | 0 | 1 = 0,
    lastIndex?: number
  ): [number, number][] {
    if (
      (lastIndex != null && !isAdjacent(lastIndex, index, boost)) ||
      isLand(board, index)
    ) {
      console.log(
        lastIndex,
        index,
        boost,
        lastIndex != null && !isAdjacent(lastIndex, index, boost)
      );
      return [];
    }

    const distanceTuple = [index, roll - until] as [number, number];
    const nextUntil = until - 1;

    if (until < 0) {
      return [];
    } else if (until === 0) {
      return [distanceTuple];
    }
    return [distanceTuple].concat(
      rec(
        index + windMultiplier(1),
        nextUntil - untilMultiplier(3),
        windBoost(1),
        index
      ),
      rec(
        index - windMultiplier(3),
        nextUntil - untilMultiplier(1),
        windBoost(3),
        index
      ),
      rec(
        index + config.columnNum * windMultiplier(2),
        nextUntil - untilMultiplier(0),
        windBoost(2),
        index
      ),
      rec(
        index - config.columnNum * windMultiplier(0),
        nextUntil - untilMultiplier(2),
        windBoost(0),
        index
      )
    );
  };
};

const condenseToMinimumDistance = A.reduce(
  {} as Record<number, number>,
  (acc, [index, distance]: [number, number]) => ({
    ...acc,
    [index]: Math.min(distance, acc[index] || Infinity),
  })
);

export const getArea = (board: Board, windDirection: Wind) => (
  index: number,
  until: number
): Record<number, number> =>
  pipe(
    index,
    getAround(board, windDirection, until),
    (e) => (console.log(e), e),
    condenseToMinimumDistance
  );
