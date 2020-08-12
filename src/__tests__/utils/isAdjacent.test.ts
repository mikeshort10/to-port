import { isAdjacent } from "../../utils/isAdjacent";

describe("isAdjacent", () => {
  it("returns true if to left", () => {
    expect(isAdjacent(75, 74)).toBe(true);
  });

  it("returns true if to right", () => {
    expect(isAdjacent(75, 76)).toBe(true);
  });

  it("returns true if below", () => {
    expect(isAdjacent(75, 119)).toBe(true);
  });

  it("returns true if above", () => {
    expect(isAdjacent(75, 31)).toBe(true);
  });

  it("returns false if off top of board", () => {
    expect(isAdjacent(0, -50)).toBe(false);
  });

  it("returns false if off bottom of board", () => {
    expect(isAdjacent(50 ** 2, 50 ** 2)).toBe(false);
  });

  it("returns false if starts next row", () => {
    expect(isAdjacent(43, 44)).toBe(false);
  });

  it("returns false if starts last row", () => {
    expect(isAdjacent(88, 87)).toBe(false);
  });

  it("returns false if diagonal", () => {
    expect(isAdjacent(75, 118)).toBe(false);
  });
});
