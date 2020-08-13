import { isWithinBoard } from "./isAdjacent";
import { config } from "./config";

const ifWithinBoard = (index: number) => (isWithinBoard(index) ? [index] : []);

export const getSurroundingSquares = (index: number): number[] => [
  ...ifWithinBoard(index + 1),
  ...ifWithinBoard(index - 1),
  ...ifWithinBoard(index + config.columnNum),
  ...ifWithinBoard(index - config.columnNum),
  ...ifWithinBoard(index + config.columnNum + 1),
  ...ifWithinBoard(index - config.columnNum + 1),
  ...ifWithinBoard(index + config.columnNum - 1),
  ...ifWithinBoard(index - config.columnNum - 1),
];
