import {
  clickCheckboxByValue,
  getCheckedHolidayValues,
  getYearGroupIds,
  loadApp,
} from "./helpers/loadApp";

function flushPromises(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function fakeHebcalYear(year: number) {
  return {
    title: `Hebcal Diaspora ${year}`,
    items: [
      {
        title: "Rosh Hashana",
        date: `${year}-09-18`,
        category: "holiday",
        subcat: "major",
        hebrew: "",
        link: "",
        memo: "The Jewish New Year",
      },
    ],
  };
}

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
  delete (window as any).fetch;
});

describe("remembering selected holidays", () => {
  it("restores the previous selection after a reload", () => {
    loadApp();
    clickCheckboxByValue("Pesach");
    clickCheckboxByValue("Rosh Hashana");

    loadApp({ keepSavedState: true });

    expect(getCheckedHolidayValues()).toEqual(["Yom Kippur", "Pesach"]);
  });

  it("restores an empty selection after Deselect all and a reload", () => {
    loadApp();
    document.getElementById("deselectallbtn")!.click();

    loadApp({ keepSavedState: true });

    expect(getCheckedHolidayValues()).toEqual([]);
  });

  it("writes the selection into the URL so it can be shared", () => {
    loadApp();
    clickCheckboxByValue("Pesach");

    expect(window.location.search).toBe(
      "?holidays=roshhashana,yomkippur,pesach"
    );
  });

  it("uses the holidays in the URL over the saved selection", () => {
    loadApp();
    clickCheckboxByValue("Sukkot");

    window.history.replaceState(null, "", "/?holidays=pesach,chanukah");
    loadApp({ keepSavedState: true });

    expect(getCheckedHolidayValues()).toEqual(["Chanukah", "Pesach"]);
  });

  it("falls back to the default holidays when nothing is saved", () => {
    loadApp();

    expect(getCheckedHolidayValues()).toEqual(["Rosh Hashana", "Yom Kippur"]);
  });
});

describe("current year highlight", () => {
  it("highlights only the current year", () => {
    jest.useFakeTimers({ now: new Date(2026, 8, 29) });
    loadApp();

    const highlighted = Array.from(
      document.querySelectorAll("#container > g.current-year")
    ).map((el) => el.id);

    expect(highlighted).toEqual(["year-2026"]);
    expect(
      document.querySelectorAll("#year-2026 > rect.current-year-band")
    ).toHaveLength(1);
    expect(
      document.querySelector("#year-2026 > text.year-label")?.textContent
    ).toBe("2026");
  });

  it("highlights nothing when the current year isn't on the calendar", () => {
    jest.useFakeTimers({ now: new Date(2040, 0, 1) });
    loadApp();

    expect(document.querySelectorAll("g.current-year")).toHaveLength(0);
    expect(document.querySelectorAll("rect.current-year-band")).toHaveLength(0);
  });
});

describe("loading more years", () => {
  it("disables the button and shows a spinner while loading, then adds the years", async () => {
    let resolveAll: () => void = () => undefined;
    const allowed = new Promise<void>((resolve) => (resolveAll = resolve));
    (window as any).fetch = jest.fn(async (url: string) => {
      await allowed;
      const year = Number(/year=(\d+)/.exec(url)![1]);
      return { json: async () => fakeHebcalYear(year) };
    });

    loadApp();
    const button = document.getElementById(
      "followingyearsbtn"
    ) as HTMLButtonElement;
    button.click();

    expect(button.disabled).toBe(true);
    expect(button.querySelector(".loading-spinner")).not.toBeNull();

    resolveAll();
    for (let i = 0; i < 5; i++) await flushPromises();

    expect(button.disabled).toBe(false);
    expect(button.textContent).toBe("Load next 3 years");
    expect(getYearGroupIds().slice(-3)).toEqual([
      "year-2031",
      "year-2032",
      "year-2033",
    ]);
    expect(document.getElementById("followingyearserror")!.hidden).toBe(true);
  });

  it("shows an error message and re-enables the button when loading fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    (window as any).fetch = jest.fn(() => Promise.reject(new Error("offline")));

    loadApp();
    const button = document.getElementById(
      "previousyearsbtn"
    ) as HTMLButtonElement;
    button.click();
    for (let i = 0; i < 5; i++) await flushPromises();

    const error = document.getElementById("previousyearserror")!;
    expect(error.hidden).toBe(false);
    expect(error.textContent).toMatch(/Couldn't load more years/);
    expect(button.disabled).toBe(false);
    expect(button.textContent).toBe("Load 3 previous years");
    expect(getYearGroupIds()).toHaveLength(14);
  });

  it("can load more years even when every holiday is unchecked", async () => {
    (window as any).fetch = jest.fn(async (url: string) => {
      const year = Number(/year=(\d+)/.exec(url)![1]);
      return { json: async () => fakeHebcalYear(year) };
    });

    loadApp();
    document.getElementById("deselectallbtn")!.click();
    document.getElementById("previousyearsbtn")!.click();
    for (let i = 0; i < 5; i++) await flushPromises();

    expect(document.getElementById("previousyearserror")!.hidden).toBe(true);
    document.getElementById("selectallbtn")!.click();
    expect(getYearGroupIds().slice(0, 3)).toEqual([
      "year-2014",
      "year-2015",
      "year-2016",
    ]);
  });
});

describe("hiding years", () => {
  it("hides the earliest 3 years", () => {
    loadApp();
    document.getElementById("hideearliestyearsbtn")!.click();

    const ids = getYearGroupIds();
    expect(ids).toHaveLength(11);
    expect(ids[0]).toBe("year-2020");
    expect(ids[ids.length - 1]).toBe("year-2030");
  });

  it("hides the latest 3 years", () => {
    loadApp();
    document.getElementById("hidelatestyearsbtn")!.click();

    const ids = getYearGroupIds();
    expect(ids).toHaveLength(11);
    expect(ids[0]).toBe("year-2017");
    expect(ids[ids.length - 1]).toBe("year-2027");
  });

  it("brings hidden years back without refetching them", async () => {
    (window as any).fetch = jest.fn();

    loadApp();
    document.getElementById("hideearliestyearsbtn")!.click();
    document.getElementById("hideearliestyearsbtn")!.click();
    document.getElementById("hidelatestyearsbtn")!.click();

    document.getElementById("previousyearsbtn")!.click();
    document.getElementById("followingyearsbtn")!.click();
    for (let i = 0; i < 5; i++) await flushPromises();

    const ids = getYearGroupIds();
    expect(ids[0]).toBe("year-2020");
    expect(ids[ids.length - 1]).toBe("year-2030");
    expect(ids).toHaveLength(11);
    expect((window as any).fetch).not.toHaveBeenCalled();
  });

  it("disables both hide buttons once 3 or fewer years remain", () => {
    loadApp();
    const earliest = document.getElementById(
      "hideearliestyearsbtn"
    ) as HTMLButtonElement;
    const latest = document.getElementById(
      "hidelatestyearsbtn"
    ) as HTMLButtonElement;

    earliest.click();
    earliest.click();
    latest.click();
    expect(getYearGroupIds()).toHaveLength(5);
    expect(earliest.disabled).toBe(false);

    latest.click();
    expect(getYearGroupIds()).toHaveLength(2);
    expect(earliest.disabled).toBe(true);
    expect(latest.disabled).toBe(true);

    latest.click();
    expect(getYearGroupIds()).toHaveLength(2);
  });
});
