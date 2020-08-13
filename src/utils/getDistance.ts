import { Wind } from "../types";
import { getCoords } from "./getCoords";

const handleBoost = (windDirection: Wind) => {
  const windHelpsPositive = windDirection % 3 === 0;
  return (distance: number, affectedDirection: boolean): number => {
    if (distance === 0 || !affectedDirection) {
      return Math.abs(distance);
    }
    return distance > 0 === windHelpsPositive
      ? Math.abs(distance * 2)
      : Math.floor(Math.abs(distance / 2));
  };
};

export const getDistance = (
  from: number,
  to: number,
  windDirection: Wind
): number => {
  const [ax, ay] = getCoords(from);
  const [bx, by] = getCoords(to);

  const isNorthSouth = windDirection % 2 === 0;
  const getDistance = handleBoost(windDirection);

  const xDistance = getDistance(bx - ax, !isNorthSouth);
  const yDistance = getDistance(by - ay, isNorthSouth);

  return xDistance + yDistance;
};
