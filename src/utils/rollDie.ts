import { randomInt } from "fp-ts/lib/Random";

export const rollDie = (): number => {
  return randomInt(1, 6)();
};
