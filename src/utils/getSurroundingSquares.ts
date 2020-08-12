import { isWithinBoard } from "./isAdjacent";
import { config } from "./config";

export const getSurroundingSquares = (index: number): number[] => {
  const ifWithinBoard = (index: number) =>
    isWithinBoard(index) ? [index] : [];
  return [
    ...ifWithinBoard(index + 1),
    ...ifWithinBoard(index - 1),
    ...ifWithinBoard(index + config.columnNum),
    ...ifWithinBoard(index - config.columnNum),
    ...ifWithinBoard(index + config.columnNum + 1),
    ...ifWithinBoard(index - config.columnNum + 1),
    ...ifWithinBoard(index + config.columnNum - 1),
    ...ifWithinBoard(index - config.columnNum - 1),
  ];
};
