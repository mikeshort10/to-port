import { pipe, flow } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { Ship } from "../types";

export const reorientArea = (
  selectedShipIndex: number | undefined,
  ships: Record<number, Ship | undefined>
): O.Option<Ship> =>
  pipe(
    selectedShipIndex,
    O.fromNullable,
    O.chain(flow((index) => ships[index], O.fromNullable))
  );
