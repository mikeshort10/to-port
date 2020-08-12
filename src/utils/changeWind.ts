import { randomInt } from "fp-ts/lib/Random";
import { Wind } from "../types";

export const changeWind = (): Wind => randomInt(0, 3)() as Wind;
