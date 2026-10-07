// set the dimensions and margins of the graph

const MARGIN = { top: 20, right: 20, bottom: 30, left: 80 };

export const constants: any = {
  margin: MARGIN,
  width: 960 - MARGIN.left - MARGIN.right,
  height: 500 - MARGIN.top - MARGIN.bottom,
  rowHeight: 25,
  interyearMargin: 20,
  colors: {
    "Rosh Hashana": "#D3143C",
    "Yom Kippur": "#8B0000",
    Sukkot: "#287d35",
    SheminiAtzeret: "#219c33",
    Chanukah: "#1E90FF",
    Purim: "#ecff73",
    Pesach: "#CAE5E8",
    Shavuot: "#7CF000",
    //"Shavuot": "#FFD700",
  },
  /** Photo strips (5:1) drawn faintly over each holiday's bars. Paths are relative to index.html */
  holidayImages: {
    "Rosh Hashana": "images/holidays/rosh-hashana.jpg",
    "Yom Kippur": "images/holidays/yom-kippur.jpg",
    Sukkot: "images/holidays/sukkot.jpg",
    SheminiAtzeret: "images/holidays/shemini-atzeret.jpg",
    Chanukah: "images/holidays/chanukah.jpg",
    "Tu BiShvat": "images/holidays/tu-bishvat.jpg",
    Purim: "images/holidays/purim.jpg",
    Pesach: "images/holidays/pesach.jpg",
    "Lag BaOmer": "images/holidays/lag-baomer.jpg",
    Shavuot: "images/holidays/shavuot.jpg",
    "Tisha B'av": "images/holidays/tisha-bav.jpg",
  },
};

/** These Yom Tovs are the ones checked by default on load */
export const defaultCheckedYomTovs = ["Rosh Hashana", "Yom Kippur"];

export let globals = {
  saturdayFlag: false,
  calendarHeight: 200,
  currentRow: -1,
};

export const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
