import {
  clickCheckboxByValue,
  getAllHolidayCheckboxValues,
  getBarsForYear,
  getCheckedHolidayValues,
  getYearGroupIds,
  loadApp,
} from "./helpers/loadApp";

describe("D3 calendar rendering (default state)", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => undefined);
    loadApp();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders one SVG calendar with a tooltip holder", () => {
    expect(document.querySelectorAll("#calendar-area > svg")).toHaveLength(1);
    expect(document.querySelector("#calendar-area > .tooltip")).not.toBeNull();
    expect(document.querySelector("#container")).not.toBeNull();
  });

  it("renders year groups for every embedded year (2017–2030)", () => {
    expect(getYearGroupIds()).toEqual([
      "year-2017",
      "year-2018",
      "year-2019",
      "year-2020",
      "year-2021",
      "year-2022",
      "year-2023",
      "year-2024",
      "year-2025",
      "year-2026",
      "year-2027",
      "year-2028",
      "year-2029",
      "year-2030",
    ]);
  });

  it("renders Sunday–Saturday column headers and day swimlanes", () => {
    const headers = Array.from(
      document.querySelectorAll("#calendar-area > .day-header text.year-text")
    ).map((el) => el.textContent);

    expect(headers).toEqual([
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ]);
    expect(document.querySelectorAll("#container line")).toHaveLength(7);
  });

  it("builds the holiday checkbox list with Rosh Hashana and Yom Kippur checked by default", () => {
    expect(getAllHolidayCheckboxValues()).toEqual([
      "Rosh Hashana",
      "Yom Kippur",
      "Sukkot",
      "SheminiAtzeret",
      "Chanukah",
      "Tu BiShvat",
      "Purim",
      "Pesach",
      "Lag BaOmer",
      "Shavuot",
      "Tisha B'av",
    ]);
    expect(getCheckedHolidayValues()).toEqual([
      "Rosh Hashana",
      "Yom Kippur",
    ]);
  });

  it("draws the default holiday bars (Rosh Hashana + Yom Kippur only)", () => {
    expect(document.querySelectorAll("rect.bar")).toHaveLength(42);

    const bars2017 = getBarsForYear("2017");
    expect(bars2017).toHaveLength(3);
    expect(bars2017.map((bar) => bar.getAttribute("day"))).toEqual([
      "Thursday",
      "Friday",
      "Saturday",
    ]);
    expect(bars2017.map((bar) => bar.getAttribute("style"))).toEqual([
      "fill: #D3143C;",
      "fill: #D3143C;",
      "fill: #8B0000;",
    ]);
  });

  it("sizes the SVG to the default layout", () => {
    const svg = document.querySelector("#calendar-area > svg");
    expect(svg?.getAttribute("width")).toBe("960");
    expect(svg?.getAttribute("height")).toBe("795");
  });

  it("shows a light-red Rosh Hashana square in Saturday for year 2026 when Rosh Hashana is checked", () => {
    expect(getCheckedHolidayValues()).toContain("Rosh Hashana");

    const roshHashanaSaturday2026 = getBarsForYear("2026").find(
      (bar) =>
        bar.getAttribute("day") === "Saturday" &&
        (bar.getAttribute("style") || "").includes("fill: #D3143C")
    );

    expect(roshHashanaSaturday2026).toBeDefined();
  });
});

describe("D3 calendar rendering (checkbox filtering)", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => undefined);
    loadApp();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("adds Pesach bars when Pesach is checked", () => {
    clickCheckboxByValue("Pesach");

    expect(getCheckedHolidayValues()).toEqual([
      "Rosh Hashana",
      "Yom Kippur",
      "Pesach",
    ]);
    expect(document.querySelectorAll("rect.bar")).toHaveLength(154);
    expect(getYearGroupIds()).toHaveLength(14);
    expect(
      document.querySelector("#calendar-area > svg")?.getAttribute("height")
    ).toBe("1245");
  });

  it("removes Rosh Hashana bars when it is unchecked", () => {
    clickCheckboxByValue("Pesach");
    clickCheckboxByValue("Rosh Hashana");

    expect(getCheckedHolidayValues()).toEqual(["Yom Kippur", "Pesach"]);
    expect(document.querySelectorAll("rect.bar")).toHaveLength(126);
  });

  it("keeps a single sticky day-of-week header after redrawing", () => {
    clickCheckboxByValue("Pesach");
    clickCheckboxByValue("Pesach");

    expect(document.querySelectorAll("#calendar-area > .day-header")).toHaveLength(1);
    expect(
      document.querySelectorAll("#calendar-area > .day-header text.year-text")
    ).toHaveLength(7);
  });

  it("checks every holiday and draws all years when Select all is clicked", () => {
    document.getElementById("selectallbtn")!.click();

    expect(getCheckedHolidayValues()).toEqual(getAllHolidayCheckboxValues());
    expect(getYearGroupIds()).toHaveLength(14);
    expect(document.querySelectorAll("rect.bar").length).toBeGreaterThan(154);
  });

  it("unchecks every holiday and clears the calendar when Deselect all is clicked", () => {
    document.getElementById("deselectallbtn")!.click();

    expect(getCheckedHolidayValues()).toEqual([]);
    expect(document.querySelectorAll("rect.bar")).toHaveLength(0);
    expect(getYearGroupIds()).toHaveLength(0);
  });

  it("clears year groups and bars when every holiday is unchecked", () => {
    for (const value of getCheckedHolidayValues()) {
      clickCheckboxByValue(value);
    }

    expect(getCheckedHolidayValues()).toEqual([]);
    expect(document.querySelectorAll("rect.bar")).toHaveLength(0);
    expect(getYearGroupIds()).toHaveLength(0);
    expect(
      document.querySelector("#calendar-area > svg")?.getAttribute("height")
    ).toBe("320");
  });
});
