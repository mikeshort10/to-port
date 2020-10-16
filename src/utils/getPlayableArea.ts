import type { Tile, Wind, Area, Ships } from "../types";
import { config } from "./config";
import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { board } from "../board";
import {
  pipe,
  constFalse,
  decrement,
  flow,
  increment,
  tupled,
  not,
} from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/boolean";
import * as IO from "fp-ts/lib/IO";
import { isWithinBoard } from "./isAdjacent";

type Tuple<A, B = A> = [A, B];
const toTuple = <A, B>(a: A, b: B): Tuple<A, B> => [a, b];

const spaceFromIndex = (index: number) => A.lookup(index)(board);

const isLand = flow(
  spaceFromIndex,
  O.map(({ isLand }: Tile) => isLand),
  O.getOrElse(constFalse)
);

const getMultiplier = (x: Wind) => (y: Wind): number => (x === y ? 2 : 1);

const untilMultiplier = (direction: Wind) =>
  flow((w: Wind) => ((w + 2) % 4) as Wind, getMultiplier(direction), decrement);

const isModulo = (m: number) => (x: number) => x % m === 0;

const ifModulo = <A>(m: number, ifTrue: A, ifFalse: A) => (x: number) =>
  pipe(x, isModulo(m), fold(IO.of(ifFalse), IO.of(ifTrue)));

const negativeIfNorthOrWest = ifModulo(3, -1, 1);
const addRowIfNorthOrSouth = ifModulo(2, config.columnNum, 1);

const getIndexChange = (direction: Wind) =>
  negativeIfNorthOrWest(direction) * addRowIfNorthOrSouth(direction);

const getIndexChangeWithWindBoost = (windDirection: Wind) => {
  return (direction: Wind) =>
    getIndexChange(direction) * getMultiplier(windDirection)(direction);
};

const isPlayable = (ships: Ships) => (i: number) =>
  pipe(
    i,
    O.fromPredicate(not(isOtherShip(ships))),
    O.chain(O.fromPredicate(isWithinBoard)),
    O.chain(O.fromPredicate(not(isLand))),
    O.isSome
  );

const isJumpingOverObstacle = (
  ships: Ships,
  index: number,
  indexChange: number
) => {
  const potentialObstacleIndex = (index + indexChange) / 2;
  return (
    Math.abs(indexChange % config.columnNum) > 1 &&
    (ships[potentialObstacleIndex] || board[potentialObstacleIndex]) != null
  );
};

const isNotPlayable = (ships: Ships, i: number) => not(isPlayable(ships))(i);

// TODO: prevent ships from "jumping"
const getSpaceFromDirection = (ships: Ships, windDirection: Wind) => {
  const getIndexChange = getIndexChangeWithWindBoost(windDirection);
  const getUntilChange = flow(untilMultiplier(windDirection), increment);
  return (index: number, until: number) => {
    return (direction: Wind): Tuple<number> => {
      if (isJumpingOverObstacle(ships, index, getIndexChange(direction))) {
        return [-1, -1]; // unplayable
      }
      return [
        index + getIndexChange(direction),
        until - getUntilChange(direction),
      ];
    };
  };
};

const isOtherShip = (ships: Ships) => (i: number) => ships[i] != null;

const isNotStartingPoint = (movesLeft: number, roll: number) =>
  movesLeft !== roll;

const getAround = (ships: Ships, windDirection: Wind, roll: number) => {
  const getNextSpaceFromLast = getSpaceFromDirection(ships, windDirection);

  return function rec(index: number, movesRemaining = roll): Tuple<number>[] {
    if (
      movesRemaining < 0 ||
      (isNotStartingPoint(movesRemaining, roll) && isNotPlayable(ships, index))
    ) {
      return [];
    }
    const distanceTuple = toTuple(index, roll - movesRemaining);
    const evaluateSpaceInDirection = flow(
      getNextSpaceFromLast(index, movesRemaining),
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
  (acc, [index, distance]: [number, number]) => {
    return {
      ...acc,
      [index]: Math.min(distance, acc[index] ?? Infinity),
    };
  }
);

export const getArea = (ships: Ships, windDirection: Wind) => {
  return (index: number, until: number): Area =>
    pipe(
      index,
      getAround(ships, windDirection, until),
      condenseToMinimumDistance
    );
};
