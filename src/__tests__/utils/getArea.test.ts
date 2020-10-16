import { getArea } from "../../utils";

describe("getArea", () => {
  const startingPoint = 762;
  it("returns only itself", () => {
    const until = 0;
    const playableArea = getArea({}, 0)(startingPoint, until);
    expect(playableArea).toMatchInlineSnapshot(`
      Object {
        "762": 0,
      }
    `);
  });

  it("can't jump over land", () => {
    const playableArea = getArea({}, 0)(503, 6);
    expect(playableArea).not.toHaveProperty("420");
  });

  it("doesn't return into-wind direction on 1", () => {
    const until = 1;
    const playableArea = getArea({}, 2)(startingPoint, until);
    expect(playableArea).toMatchInlineSnapshot(`
      Object {
        "761": 1,
        "762": 0,
        "763": 1,
        "850": 1,
      }
    `);
  });

  it("can't go through ship", () => {
    const until = 2;
    const playableArea = getArea({}, 1)(startingPoint, until);

    expect(playableArea).toMatchInlineSnapshot(`
      Object {
        "674": 2,
        "718": 1,
        "720": 2,
        "761": 2,
        "762": 0,
        "764": 1,
        "766": 2,
        "806": 1,
        "808": 2,
        "850": 2,
      }
    `);
  });

  it("finds area of 4", () => {
    const until = 4;
    const playableArea = getArea({}, 1)(startingPoint, until);
    expect(playableArea).toMatchInlineSnapshot(`
      Object {
        "586": 4,
        "630": 3,
        "632": 4,
        "673": 4,
        "674": 2,
        "676": 3,
        "678": 4,
        "717": 3,
        "718": 1,
        "719": 4,
        "720": 2,
        "722": 3,
        "724": 4,
        "760": 4,
        "761": 2,
        "762": 0,
        "763": 3,
        "764": 1,
        "765": 4,
        "766": 2,
        "768": 3,
        "770": 4,
        "805": 3,
        "806": 1,
        "807": 4,
        "808": 2,
        "810": 3,
        "812": 4,
        "849": 4,
        "850": 2,
        "852": 3,
        "854": 4,
        "894": 3,
        "896": 4,
        "938": 4,
      }
    `);
  });
});
