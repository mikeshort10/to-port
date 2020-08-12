import { getSurroundingSquares } from "../../utils/getSurroundingSquares";

describe("getSurroundingSquares", () => {
  it("get squares", () => {
    expect(getSurroundingSquares(80)).toHaveLength(8);
  });
});
