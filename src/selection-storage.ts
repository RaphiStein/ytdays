import { minifyYTName } from "./utils";

const STORAGE_KEY = "ytdays.selectedHolidays";
const URL_PARAM = "holidays";

/**
 * Returns the holidays to check on load: the URL wins (so shared links work),
 * then the last saved selection, then null so the caller can fall back to defaults.
 */
export function loadSavedSelection(availableYomTovs: string[]): string[] | null {
  const params = new URLSearchParams(window.location.search);
  if (params.has(URL_PARAM)) {
    const ids = (params.get(URL_PARAM) || "").split(",").filter(Boolean);
    return availableYomTovs.filter((yt) => ids.indexOf(minifyYTName(yt)) > -1);
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return availableYomTovs.filter((yt) => parsed.indexOf(yt) > -1);
      }
    }
  } catch (e) {
    // localStorage can be unavailable (e.g. privacy modes) or hold bad JSON
  }

  return null;
}

export function saveSelection(selectedYomTovs: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedYomTovs));
  } catch (e) {
    // localStorage can be unavailable (e.g. privacy modes)
  }

  const params = new URLSearchParams(window.location.search);
  params.set(URL_PARAM, selectedYomTovs.map(minifyYTName).join(","));
  window.history.replaceState(
    null,
    "",
    window.location.pathname +
      "?" +
      params.toString().replace(/%2C/g, ",") +
      window.location.hash
  );
}
