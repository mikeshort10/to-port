import { config } from "./config";
import { ordNumber, between } from "fp-ts/lib/Ord";

type Coords = [number, number];

export const getCoords = (index: number): Coords => {
  return [index % config.columnNum, Math.floor(index / config.columnNum)];
};

export const isWithinBoard = between(ordNumber)(
  0,
  config.rowNum * config.columnNum - 1
);

export const isAdjacent = (
  currentIndex: number,
  nextIndex: number,
  windCost: 1 | -1 | 0 = 0
): boolean => {
  const [cx, cy] = getCoords(currentIndex);
  const [nx, ny] = getCoords(nextIndex);

  const isHorizontal = Math.abs(cx - nx) === 1 + windCost && cy === ny;
  const isVertical = Math.abs(cy - ny) === 1 + windCost && cx === nx;

  return isWithinBoard(nextIndex) && (isHorizontal || isVertical);
};
