import {
  IHebcalYearRaw,
  IInputYear,
  IInputSetItem,
  IInputSet,
  IHebcalYomTovItem,
  YomTov,
} from "./types";
import { dateToDayOfWeek } from "./utils";

/** Converts HebCal structure to IInputYear for a single year */

export function structureFromHebcal(hebcalRaw: IHebcalYearRaw): IInputYear {
  // Parse year from title
  const parsedYear = hebcalRaw.title.match(/\d+$/);
  if (!parsedYear || !parseInt(parsedYear[0])) {
    throw "Could not parse year for " + hebcalRaw.title;
  }
  hebcalRaw.year = parsedYear[0];

  const yomTovSets: { [key: string]: IHebcalYomTovItem[] } = hebcalRaw.items
    .filter((hcyi) => !hcyi.title.match(/^Erev.*/))
    .reduce(function (accumulator, hcyi) {
      const processedTitle = unifyYomTovNames(hcyi.title);
      (accumulator[processedTitle] = accumulator[processedTitle] || []).push(
        hcyi
      );
      return accumulator;
    }, {});

  const mappedToArray = Object.keys(yomTovSets).map((k) => yomTovSets[k]);

  const sets: IInputSet[] = [];
  for (let s of mappedToArray) {
    const setItems: IInputSetItem[] = [];
    for (const hebCalYearItem of s) {
      const processedName = unifyYomTovNames(hebCalYearItem.title);

      setItems.push({
        name: processedName,
        days: [dateToDayOfWeek(hebCalYearItem.date)],
      });
      //}
    }

    const processedName = unifyYomTovNames(s[0].title);

    sets.push({
      setName: processedName,
      setItems,
    });
  }

  return {
    year: hebcalRaw.year,
    sets,
  };
}

/** Hebcal names are different for different days of a Yom Tov, i.e. "Pesach I" and "Pesach II"
 * this function unifies the variations (i.e. Sukkot I & Sukkot II) into a single name
 */
function unifyYomTovNames(yomTovHebCalName: string): YomTov {
  if (yomTovHebCalName.indexOf("Rosh Hashana") >= 0) {
    return YomTov.RoshHashana;
  }

  if (yomTovHebCalName === "Yom Kippur") {
    return YomTov.YomKippur;
  }

  if (
    yomTovHebCalName === "Sukkot I" ||
    yomTovHebCalName === "Sukkot II" ||
    yomTovHebCalName === "Sukkot III (CH''M)" ||
    yomTovHebCalName === "Sukkot IV (CH''M)" ||
    yomTovHebCalName === "Sukkot V (CH''M)" ||
    yomTovHebCalName === "Sukkot VI (CH''M)" ||
    yomTovHebCalName === "Sukkot VII (Hoshana Raba)"
  ) {
    return YomTov.Sukkot;
  }

  if (
    yomTovHebCalName === "Shmini Atzeret" ||
    yomTovHebCalName === "Simchat Torah"
  ) {
    return YomTov.SheminiAtzeret;
  }

  if (yomTovHebCalName.indexOf("Chanukah") >= 0) {
    return YomTov.Chanukah;
  }

  if (yomTovHebCalName === "Purim") {
    return YomTov.Purim;
  }

  if (
    yomTovHebCalName === "Pesach I" ||
    yomTovHebCalName === "Pesach II" ||
    yomTovHebCalName === "Pesach III (CH''M)" ||
    yomTovHebCalName === "Pesach IV (CH''M)" ||
    yomTovHebCalName === "Pesach V (CH''M)" ||
    yomTovHebCalName === "Pesach VI (CH''M)" ||
    yomTovHebCalName === "Pesach VII" ||
    yomTovHebCalName === "Pesach VIII"
  ) {
    return YomTov.Pesach;
  }

  if (yomTovHebCalName.indexOf("Shavuot") >= 0) {
    return YomTov.Shavuot;
  }

  if (yomTovHebCalName.indexOf("Tish'a B'Av") >= 0) {
    return YomTov.TishaBav;
  }

  throw "Unhandled Yom Tov " + yomTovHebCalName;
}
