import * as fs from "fs";
import * as path from "path";

const APP_SHELL = `
  <div class="container">
    <div id="new-checkboxes-area">
      <button id="selectallbtn">Select all</button>
      <button id="deselectallbtn">Deselect all</button>
      <ul class="list-group"></ul>
    </div>
    <button id="previousyearsbtn" class="btn">Load 3 previous years</button>
    <button id="hideearliestyearsbtn" class="btn">Hide earliest 3 years</button>
    <small id="previousyearserror" hidden></small>
    <div id="calendar-area"></div>
    <button id="followingyearsbtn" class="btn">Load next 3 years</button>
    <button id="hidelatestyearsbtn" class="btn">Hide latest 3 years</button>
    <small id="followingyearserror" hidden></small>
  </div>
`;

export interface LoadAppOptions {
  /** Page URL path + query to load with, e.g. "/?holidays=pesach". Defaults to "/". */
  url?: string;
  /** Keep localStorage and the current URL from a previous load (simulates a page reload). */
  keepSavedState?: boolean;
}

/**
 * Loads the built webpack bundle into a fresh DOM shell that mirrors index.html.
 * Does not import or modify any application source modules.
 */
export function loadApp(options: LoadAppOptions = {}): void {
  if (!options.keepSavedState) {
    window.localStorage.clear();
    window.history.replaceState(null, "", options.url || "/");
  }
  document.body.innerHTML = APP_SHELL;

  const bundlePath = path.resolve(__dirname, "../../dist/bundle.js");
  const bundleSource = fs.readFileSync(bundlePath, "utf8");

  // Execute the browser bundle against the jsdom window.
  // eslint-disable-next-line no-new-func
  const runBundle = new Function(bundleSource);
  runBundle.call(window);
}

export function getYearGroupIds(): string[] {
  return Array.from(
    document.querySelectorAll("#container > g[id^='year-']")
  ).map((el) => el.id);
}

export function getCheckedHolidayValues(): string[] {
  return Array.from(
    document.querySelectorAll<HTMLInputElement>(
      "#new-checkboxes-area input.chkbox:checked"
    )
  ).map((el) => el.value);
}

export function getAllHolidayCheckboxValues(): string[] {
  return Array.from(
    document.querySelectorAll<HTMLInputElement>(
      "#new-checkboxes-area input.chkbox"
    )
  ).map((el) => el.value);
}

export function getBarsForYear(year: string): Element[] {
  return Array.from(document.querySelectorAll(`#year-${year} rect.bar`));
}

export function clickCheckboxByValue(value: string): void {
  const checkbox = Array.from(
    document.querySelectorAll<HTMLInputElement>(
      "#new-checkboxes-area input.chkbox"
    )
  ).find((el) => el.value === value);
  if (!checkbox) {
    throw new Error(`Checkbox not found for value: ${value}`);
  }
  checkbox.checked = !checkbox.checked;
  checkbox.dispatchEvent(new Event("change", { bubbles: true }));
}
