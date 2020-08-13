import { config, getArea } from "../../utils";
import { Tile } from "../../types";

describe("getArea", () => {
  const allWaterBoard: Tile[] = Array(config.rowNum * config.columnNum)
    .fill(null)
    .map((_, index) => ({ isLand: false, isPlayer: false, index }));
  const until = 4;
  it("findsAllTheCorrectSpaces", () => {
    const playableArea = getArea(allWaterBoard, 0)(25, until);

    expect(playableArea).toMatchInlineSnapshot(`
      Object {
        "113": 4,
        "21": 4,
        "22": 3,
        "23": 2,
        "24": 1,
        "25": 2,
        "26": 1,
        "27": 2,
        "28": 3,
        "29": 4,
        "67": 4,
        "68": 3,
        "69": 2,
        "70": 3,
        "71": 4,
      }
    `);
  });
});
