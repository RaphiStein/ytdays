import { restructure } from "../src/structure-for-d3";
import { Day, IInputYear, YomTov } from "../src/types";

describe("restructure", () => {
  it("flattens each holiday day into a D3 block grouped by year", () => {
    const input: IInputYear[] = [
      {
        year: "2020",
        yomTovSets: [
          {
            yomTovName: YomTov.RoshHashana,
            days: [Day.Monday, Day.Tuesday],
          },
          {
            yomTovName: YomTov.YomKippur,
            days: [Day.Wednesday],
          },
        ],
      },
    ];

    expect(restructure(input)).toEqual([
      [
        {
          year: "2020",
          yomTov: YomTov.RoshHashana,
          yomTovIndex: 0,
          yomTovColor: "#444",
          subYomTov: YomTov.RoshHashana,
          subYomTovIndex: 0,
          day: Day.Monday,
        },
        {
          year: "2020",
          yomTov: YomTov.RoshHashana,
          yomTovIndex: 0,
          yomTovColor: "#444",
          subYomTov: YomTov.RoshHashana,
          subYomTovIndex: 0,
          day: Day.Tuesday,
        },
        {
          year: "2020",
          yomTov: YomTov.YomKippur,
          yomTovIndex: 1,
          yomTovColor: "#444",
          subYomTov: YomTov.YomKippur,
          subYomTovIndex: 1,
          day: Day.Wednesday,
        },
      ],
    ]);
  });
});
