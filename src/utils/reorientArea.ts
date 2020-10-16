import { pipe, flow } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { Ship, Ships } from "../types";

export const reorientArea = (
  selectedShipIndex: number | undefined,
  ships: Ships
): O.Option<Ship> =>
  pipe(
    selectedShipIndex,
    O.fromNullable,
    O.chain(flow((index) => ships[index], O.fromNullable))
  );
