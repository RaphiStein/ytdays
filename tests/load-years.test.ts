import { buildYearRange } from "../src/load-years";

describe("buildYearRange", () => {
  it("builds the previous and following three-year windows", () => {
    expect(buildYearRange("previous", 2020)).toEqual([2017, 2019]);
    expect(buildYearRange("following", 2020)).toEqual([2021, 2023]);
  });
});
