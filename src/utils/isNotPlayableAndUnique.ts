import { Tile } from "../types";
import * as O from "fp-ts/lib/Option";
import { pipe, constFalse } from "fp-ts/lib/function";
import { isAdjacent } from ".";

const isWater = ({ isLand }: Tile) => !isLand;

export const isNotPlayableAndUnique = (
  space: O.Option<Tile>,
  index: number,
  until: number,
  indexes: number[]
): boolean => {
  return pipe(
    space,
    O.map((space) => {
      return (
        isWater(space) === false ||
        until <= 0 ||
        isAdjacent(indexes[0], index) === false
      );
    }),
    O.getOrElse(constFalse)
  );
};
