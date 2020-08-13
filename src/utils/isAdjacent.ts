import { config } from "./config";
import { ordNumber, between } from "fp-ts/lib/Ord";

export const isWithinBoard = between(ordNumber)(
  0,
  config.rowNum * config.columnNum - 1
);
