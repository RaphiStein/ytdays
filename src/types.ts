export interface IInputYear {
  year: string;
  sets: IInputSet[];
}

export interface IInputSet {
  setName: YomTov;
  setItems: IInputSetItem[];
}

export interface IInputSetItem {
  name: YomTov;
  days: Day[];
}

export interface IHebcalYearRaw {
  title: string; // i.e. Hebcal 2023
  items: IHebcalYomTovItem[];
  link?: string; // link to API url that was fetched to get this result
  location?: { geo: string };
  year?: string; // appended later by this app. Parsed from title,
}

/**
 * Represents a single day of a YomTov.
 * For example, Sukkot I, or Sukkot II, etc
 */
export interface IHebcalYomTovItem {
  title: string;
  link: string; // i.e https://www.hebcal.com/holidays/purim,
  hebrew: string; // hebrew characters
  date: string; // i.e. "2023-03-06",
  category: string; // i.e. "holiday",
  subcat?: string; // "major",
  memo: string; // "Purim is one of the most joyous and fun holidays on the Jewish calendar"
  yomtov?: boolean;
  leyning?: { [key: string]: string };
}

/** Block = a single day and and all the data that goes with it */
export interface IStructuredD3Block {
  year: string;
  yomTov: YomTov;
  yomTovIndex: number;
  yomTovColor: string;
  subYomTov: string;
  subYomTovIndex: number;
  day: Day;
}

//////////////////////////////////////
//    ENUMS
//////////////////////////////////////

export enum Day {
  Saturday = "Saturday",
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
}

export enum YomTov {
  RoshHashana = "Rosh Hashana",
  YomKippur = "Yom Kippur",
  Sukkot = "Sukkot",
  SheminiAtzeret = "SheminiAtzeret",
  Chanukah = "Chanukah",
  TuBishvat = "Tu BiShvat",
  Purim = "Purim",
  Pesach = "Pesach",
  LagBaomer = "Lag BaOmer",
  Shavuot = "Shavuot",
  TishaBav = "Tisha B'av",
}
