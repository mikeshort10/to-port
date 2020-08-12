import { Ship, Fort, FortIndex } from "../types";

export { config } from "./config";
export { getArea } from "./handleShipMove";
export { isAdjacent } from "./isAdjacent";
export { changeWind } from "./changeWind";
export { rollDie } from "./rollDie";
export { getDistance } from "./getDistance";
export { moveShip } from "./moveShip";

export const initShips = (): Record<number, Ship | undefined> => ({
  497: { team: 0, hasMoved: 0, lastTurn: -1 },
  500: { team: 0, hasMoved: 0, lastTurn: -1 },
  503: { team: 1, hasMoved: 0, lastTurn: -1 },
});

const initFort = (): Fort => ({ team: -1, lastProduced: 0 });

export const initForts = (
  overwrite?: { [index in FortIndex]?: Fort }
): Record<FortIndex, Fort> => ({
  95: initFort(),
  259: initFort(),
  310: initFort(),
  637: initFort(),
  1272: initFort(),
  1278: initFort(),
  ...overwrite,
});

export const updateHasMoved = (
  turn: number,
  spaces: number,
  { lastTurn, hasMoved }: Ship
): number => {
  console.log(hasMoved, spaces);
  return turn === lastTurn ? hasMoved + spaces : spaces;
};

export const relocateShip = (
  from: number | undefined,
  to: number,
  turn: number,
  spaces: number,
  ships: Record<number, Ship | undefined>
): Record<number, Ship | undefined> => {
  if (from == null) {
    return ships;
  }
  const { [from]: ship, ...remainingShips } = ships;
  console.log(ship);
  return ship
    ? {
        ...remainingShips,
        [to]: {
          ...ship,
          lastTurn: turn,
          hasMoved: updateHasMoved(turn, spaces, ship),
        },
      }
    : ships;
};

export const hasAlreadyMoved = (turn: number, roll: number) => {
  return ({ lastTurn, hasMoved }: Ship): boolean => {
    return lastTurn === turn && hasMoved === roll;
  };
};
