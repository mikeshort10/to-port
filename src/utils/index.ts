import { Ship, Fort, FortIndex, Area, Ships } from "../types";

export { isAttackable, getShip } from "./isAttackable";
export { config } from "./config";
export { getArea } from "./getPlayableArea";
export { changeWind } from "./changeWind";
export { rollDie } from "./rollDie";
export { getDistance } from "./getDistance";
export { moveShip } from "./moveShip";
export { reorientArea } from "./reorientArea";

export const initShips = (): Ships => ({
  496: { team: 0, hasMoved: 0, lastTurn: -1 },
  500: { team: 0, hasMoved: 0, lastTurn: -1 },
  503: { team: 1, hasMoved: 0, lastTurn: -1 },
  939: { team: 0, hasMoved: 0, lastTurn: -1 },
});

export const initArea = (): Area => ({});

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
  return turn === lastTurn ? hasMoved + spaces : spaces;
};

export const relocateShip = (
  from: number | undefined,
  to: number,
  turn: number,
  spaces: number,
  ships: Ships
): Ships => {
  if (from == null) {
    return ships;
  }
  const { [from]: ship, ...remainingShips } = ships;
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
