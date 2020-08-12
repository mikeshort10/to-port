import { isWithinBoard } from "../../utils/isAdjacent";

describe("isWithinBoard", () => {
  it("negative is out of board", () => {
    expect(isWithinBoard(-1)).toBe(false);
  });

  it("0 is on of board", () => {
    expect(isWithinBoard(0)).toBe(true);
  });

  it("upper limit is on board", () => {
    expect(isWithinBoard(1319)).toBe(true);
  });

  it("upper limit + 1 is out of board", () => {
    expect(isWithinBoard(1320)).toBe(false);
  });
});
