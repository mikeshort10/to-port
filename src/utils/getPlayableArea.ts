import type { Tile, Board, Wind, Area } from "../types";
import { config } from "./config";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import {
  pipe,
  constFalse,
  decrement,
  flow,
  increment,
  tupled,
} from "fp-ts/lib/function";
import { isWithinBoard } from "./isAdjacent";

type Tuple<A, B = A> = [A, B];
const toTuple = <A, B>(a: A, b: B): Tuple<A, B> => [a, b];

const spaceFromIndex = (board: Board, index: number) => A.lookup(index)(board);

const isLand = (board: Board, index: number) =>
  pipe(
    spaceFromIndex(board, index),
    O.map(({ isLand }: Tile) => isLand),
    O.getOrElse(constFalse)
  );

const getMultiplier = (x: Wind) => (y: Wind): number => (x === y ? 2 : 1);

const untilMultiplier = (direction: Wind) =>
  flow((w: Wind) => ((w + 2) % 4) as Wind, getMultiplier(direction), decrement);

const ifModulo = <A, B>(m: number, ifTrue: A, ifFalse: B) => (x: number) =>
  x % m === 0 ? ifTrue : ifFalse;

const negativeIfNorthOrWest = ifModulo(3, -1, 1);
const addRowIfNorthOrSouth = ifModulo(2, config.columnNum, 1);

const getIndexChange = (direction: Wind) =>
  negativeIfNorthOrWest(direction) * addRowIfNorthOrSouth(direction);

const getIndexChangeWithWindBoost = (windDirection: Wind) => (
  direction: Wind
) => getIndexChange(direction) * getMultiplier(windDirection)(direction);

const getSpaceFromDirection = (windDirection: Wind) => {
  const getIndexChange = getIndexChangeWithWindBoost(windDirection);
  const getUntilChange = flow(untilMultiplier(windDirection), increment);
  return (index: number, until: number) => {
    return (direction: Wind): Tuple<number> => {
      return [
        index + getIndexChange(direction),
        until - getUntilChange(direction),
      ];
    };
  };
};

const getAround = (board: Board, windDirection: Wind, roll: number) => {
  const getNextSpaceFromLast = getSpaceFromDirection(windDirection);

  return function rec(index: number, until = roll): Tuple<number>[] {
    if (until < 0 || !isWithinBoard(index) || isLand(board, index)) {
      return [];
    }
    const distanceTuple = toTuple(index, roll - until);
    const evaluateSpaceInDirection = flow(
      getNextSpaceFromLast(index, until),
      tupled(rec)
    );

    return [distanceTuple].concat(
      evaluateSpaceInDirection(0),
      evaluateSpaceInDirection(1),
      evaluateSpaceInDirection(2),
      evaluateSpaceInDirection(3)
    );
  };
};

const condenseToMinimumDistance = A.reduce(
  {} as Area,
  (acc, [index, distance]: [number, number]) => ({
    ...acc,
    [index]: Math.min(distance, acc[index] || Infinity),
  })
);

export const getArea = (board: Board, windDirection: Wind) => {
  return (index: number, until: number): Area =>
    pipe(
      index,
      getAround(board, windDirection, until),
      condenseToMinimumDistance
    );
};
