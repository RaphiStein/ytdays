import {
  atLeastOneYomTovIsSelected,
  calculateNumberOfRows,
  dateToDayOfWeek,
  minifyYTName,
  sortYomTovs,
} from "../src/utils";
import { Day, IStructuredD3Block, YomTov } from "../src/types";

describe("utils", () => {
  it("calculates row wraps when day-of-week order resets", () => {
    expect(
      calculateNumberOfRows([
        { day: Day.Thursday },
        { day: Day.Friday },
        { day: Day.Saturday },
      ])
    ).toBe(1);

    expect(
      calculateNumberOfRows([
        { day: Day.Friday },
        { day: Day.Saturday },
        { day: Day.Sunday },
      ])
    ).toBe(2);
  });

  it("maps ISO dates to weekdays", () => {
    expect(dateToDayOfWeek("2017-09-21")).toBe(Day.Thursday);
    expect(dateToDayOfWeek("2017-09-30")).toBe(Day.Saturday);
  });

  it("minifies holiday names for checkbox ids", () => {
    expect(minifyYTName("Rosh Hashana")).toBe("roshhashana");
    expect(minifyYTName("Tisha B'av")).toBe("tishab'av");
  });

  it("detects whether a year has selected holiday blocks", () => {
    expect(atLeastOneYomTovIsSelected([])).toBeFalsy();
    expect(
      atLeastOneYomTovIsSelected([
        { year: "2020", yomTov: YomTov.Purim } as IStructuredD3Block,
      ])
    ).toBeTruthy();
  });

  it("sorts holidays in calendar order", () => {
    expect(sortYomTovs(YomTov.RoshHashana)).toBeLessThan(
      sortYomTovs(YomTov.YomKippur)
    );
    expect(sortYomTovs(YomTov.Chanukah)).toBeLessThan(
      sortYomTovs(YomTov.Pesach)
    );
  });
});
