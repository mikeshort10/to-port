import { config } from "./config";

type Coords = [number, number];

export const getCoords = (index: number): Coords => {
  return [index % config.columnNum, Math.floor(index / config.columnNum)];
};
