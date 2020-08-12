import { getDistance } from "../../utils/getDistance";

describe("getDistance", () => {
  it("doubles when going with wind (South)", () => {
    const distance = getDistance(88, 44, 2);
    expect(distance).toEqual(2);
  });

  it("doubles when going with wind (West)", () => {
    const distance = getDistance(44, 45, 3);
    expect(distance).toEqual(2);
  });

  it("doubles when going with wind (North)", () => {
    const distance = getDistance(44, 88, 0);
    expect(distance).toEqual(2);
  });

  it("doubles when going with wind (East)", () => {
    const distance = getDistance(74, 73, 1);
    expect(distance).toEqual(2);
  });

  it("halves when going against wind (North)", () => {
    const distance = getDistance(132, 44, 0);
    expect(distance).toEqual(1);
  });

  it("halves when going against wind (East)", () => {
    const distance = getDistance(44, 46, 1);
    expect(distance).toEqual(1);
  });

  it("halves when going against wind (South)", () => {
    const distance = getDistance(32, 120, 2);
    expect(distance).toEqual(1);
  });

  it("halves when going against wind (West)", () => {
    const distance = getDistance(74, 72, 3);
    expect(distance).toEqual(1);
  });

  it("rounds down against the wind", () => {
    const distance = getDistance(74, 73, 3);
    expect(distance).toEqual(0);
  });

  it("unaffected moving laterally North with East wind", () => {
    const distance = getDistance(132, 44, 1);
    expect(distance).toEqual(2);
  });

  it("unaffected moving laterally East with South wind", () => {
    const distance = getDistance(44, 46, 2);
    expect(distance).toEqual(2);
  });

  it("unaffected moving laterally South with West wind", () => {
    const distance = getDistance(32, 120, 3);
    expect(distance).toEqual(2);
  });

  it("unaffected moving laterally West with North wind", () => {
    const distance = getDistance(74, 72, 0);
    expect(distance).toEqual(2);
  });
});
