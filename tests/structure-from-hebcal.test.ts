import { structureFromHebcal } from "../src/structure-from-hebcal";
import { Day, IHebcalYearRaw, YomTov } from "../src/types";

const sampleYear: IHebcalYearRaw = {
  title: "Hebcal Diaspora 2017",
  items: [
    {
      title: "Rosh Hashana 5778",
      date: "2017-09-21",
      category: "holiday",
      subcat: "major",
      hebrew: "",
      link: "",
      memo: "The Jewish New Year",
      yomtov: true,
    },
    {
      title: "Rosh Hashana II",
      date: "2017-09-22",
      category: "holiday",
      subcat: "major",
      hebrew: "",
      link: "",
      memo: "The Jewish New Year",
      yomtov: true,
    },
    {
      title: "Yom Kippur",
      date: "2017-09-30",
      category: "holiday",
      subcat: "major",
      hebrew: "",
      link: "",
      memo: "Day of Atonement",
      yomtov: true,
    },
    {
      title: "Erev Yom Kippur",
      date: "2017-09-29",
      category: "holiday",
      subcat: "major",
      hebrew: "",
      link: "",
      memo: "Day of Atonement",
    },
    {
      title: "Chanukah: 1st Day",
      date: "2017-12-13",
      category: "holiday",
      subcat: "major",
      hebrew: "",
      link: "",
      memo: "Hanukkah",
    },
    {
      title: "Chanukah: 8th Day",
      date: "2017-12-20",
      category: "holiday",
      subcat: "minor",
      hebrew: "",
      link: "",
      memo: "Zos Chanukah",
    },
  ],
};

describe("structureFromHebcal", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("parses the year and unifies multi-day holidays", () => {
    const structured = structureFromHebcal(sampleYear);

    expect(structured.year).toBe("2017");

    const byName = Object.fromEntries(
      structured.yomTovSets.map((set) => [set.yomTovName, set.days])
    );

    expect(byName[YomTov.RoshHashana]).toEqual([Day.Thursday, Day.Friday]);
    expect(byName[YomTov.YomKippur]).toEqual([Day.Saturday]);
    expect(byName[YomTov.Chanukah]).toEqual([Day.Wednesday]);
  });

  it("ignores Erev days and minor Zos Chanukah entries", () => {
    const structured = structureFromHebcal(sampleYear);
    const names = structured.yomTovSets.map((set) => set.yomTovName);

    expect(names).not.toContain(undefined);
    expect(
      structured.yomTovSets.find((set) => set.yomTovName === YomTov.Chanukah)
        ?.days
    ).toHaveLength(1);
  });
});
