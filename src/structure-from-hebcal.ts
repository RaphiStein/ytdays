import {
  Day,
  IHebcalYearRaw,
  IHebcalYomTovItem,
  IYomTovDays,
  IInputYear,
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
      const processedTitle = unifyYomTovNames(hcyi);
      if (processedTitle) {
        (accumulator[processedTitle] = accumulator[processedTitle] || []).push(
          hcyi
        );
      }

      return accumulator;
    }, {});

  const arrayOfYomTovSets = Object.keys(yomTovSets).map((k) => yomTovSets[k]);

  const sets: IYomTovDays[] = [];
  for (let hebcalYomTovSet of arrayOfYomTovSets) {
    // All items in the YomTov set are the same YomTov, so just use the first
    // (there often only is one anyway, i.e. Yom Kippur, Purim, etc)
    const processedName = unifyYomTovNames(hebcalYomTovSet[0]);

    if (processedName) {
      const days: Day[] = [];
      for (const hebCalYomTovItem of hebcalYomTovSet) {
        days.push(dateToDayOfWeek(hebCalYomTovItem.date));
      }

      sets.push({
        yomTovName: processedName,
        days,
      });
    }
  }

  return {
    year: hebcalRaw.year,
    yomTovSets: sets,
  };
}

/** Hebcal names are different for different days of a Yom Tov, i.e. "Pesach I" and "Pesach II"
 * this function unifies the variations (i.e. Sukkot I & Sukkot II) into a single name
 */
function unifyYomTovNames(yomTovHebCalItem: IHebcalYomTovItem): YomTov | null {
  if (yomTovHebCalItem.memo.indexOf("The Jewish New Year") >= 0) {
    return YomTov.RoshHashana;
  }

  if (yomTovHebCalItem.title === "Yom Kippur") {
    return YomTov.YomKippur;
  }

  if (
    yomTovHebCalItem.title === "Sukkot I" ||
    yomTovHebCalItem.title === "Sukkot II" ||
    yomTovHebCalItem.title === "Sukkot III (CH''M)" ||
    yomTovHebCalItem.title === "Sukkot IV (CH''M)" ||
    yomTovHebCalItem.title === "Sukkot V (CH''M)" ||
    yomTovHebCalItem.title === "Sukkot VI (CH''M)" ||
    yomTovHebCalItem.title === "Sukkot VII (Hoshana Raba)"
  ) {
    return YomTov.Sukkot;
  }

  if (
    yomTovHebCalItem.title === "Shmini Atzeret" ||
    yomTovHebCalItem.title === "Simchat Torah"
  ) {
    return YomTov.SheminiAtzeret;
  }

  if (yomTovHebCalItem.title.indexOf("Chanukah") >= 0) {
    return YomTov.Chanukah;
  }

  if (yomTovHebCalItem.title === "Tu BiShvat") {
    return YomTov.TuBishvat;
  }

  if (yomTovHebCalItem.title === "Purim") {
    return YomTov.Purim;
  }

  if (
    yomTovHebCalItem.title === "Pesach I" ||
    yomTovHebCalItem.title === "Pesach II" ||
    yomTovHebCalItem.title === "Pesach III (CH''M)" ||
    yomTovHebCalItem.title === "Pesach IV (CH''M)" ||
    yomTovHebCalItem.title === "Pesach V (CH''M)" ||
    yomTovHebCalItem.title === "Pesach VI (CH''M)" ||
    yomTovHebCalItem.title === "Pesach VII" ||
    yomTovHebCalItem.title === "Pesach VIII"
  ) {
    return YomTov.Pesach;
  }

  if (yomTovHebCalItem.title === "Lag BaOmer") {
    return YomTov.LagBaomer;
  }

  if (yomTovHebCalItem.title.indexOf("Shavuot") >= 0) {
    return YomTov.Shavuot;
  }

  if (yomTovHebCalItem.title.indexOf("Tish'a B'Av") >= 0) {
    return YomTov.TishaBav;
  }

  return null;
}
