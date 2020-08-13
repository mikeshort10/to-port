export type Tile = {
  isLand: boolean;
  isPlayer: boolean;
  index: number;
};

export type Wind = 0 | 1 | 2 | 3;

export type Area = Record<number, number>;

export type Ship = {
  team: number;
  hasMoved: number;
  lastTurn: number;
};

export type Fort = {
  team: number;
  lastProduced: number;
};

const fortIndices = [95, 259, 310, 637, 1272, 1278] as const;

export type FortIndex = typeof fortIndices[number];

export const isFortIndex = (a: number): a is FortIndex =>
  fortIndices.includes(a as FortIndex);

export type Board = Tile[];
