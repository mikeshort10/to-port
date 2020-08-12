import { isNotPlayableAndUnique } from "../../utils/isNotPlayableAndUnique";
import * as O from "fp-ts/lib/Option";

describe("isNotPlayableAndUnique", () => {
  const mockTile = O.some({ isLand: false, isPlayer: false, index: -1 });
  it("returns false when playable", () => {
    expect(isNotPlayableAndUnique(mockTile, 5, 1, [4])).toBe(false);
  });

  it("returns true on included in indexes", () => {
    expect(isNotPlayableAndUnique(mockTile, 4, 1, [4])).toBe(true);
  });

  it("returns true on included on unique === 0", () => {
    expect(isNotPlayableAndUnique(mockTile, 4, 0, [3])).toBe(true);
  });

  it("returns true on included on unique < 0", () => {
    expect(isNotPlayableAndUnique(mockTile, 4, -100, [3])).toBe(true);
  });

  it("returns true on included on index < 0", () => {
    expect(isNotPlayableAndUnique(mockTile, -1, 1, [3])).toBe(true);
  });
});
