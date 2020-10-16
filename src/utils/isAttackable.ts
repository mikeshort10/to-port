import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { flow, pipe } from "fp-ts/lib/function";
import { getSurroundingSquares } from "./getSurroundingSquares";
import { Area, Ships } from "../types";

export const getShip = (ships: Ships) => {
  return (i: number): Ships[number] => ships[i];
};

const isInRange = (area: Area) =>
  flow(
    getSurroundingSquares,
    A.reduce(
      false,
      (isInRange, adjacentSquare) => isInRange || area[adjacentSquare] != null
    )
  );

const isOpponent = (ships: Ships, turn: number) =>
  flow(
    getShip(ships),
    O.fromNullable,
    O.chain(O.fromPredicate(({ team }) => team !== turn)),
    O.isSome
  );

export const isAttackable = (ships: Ships, turn: number, area: Area) => {
  return (i: number): boolean =>
    pipe(
      i,
      O.fromPredicate(isOpponent(ships, turn)),
      O.chain(O.fromPredicate(isInRange(area))),
      O.isSome
    );
};
