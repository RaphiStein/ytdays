// set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 30, left: 80 };
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

let saturdayFlag = false;
const rowHeight = 25;
const interyearMargin = 20;
let calendarHeight = 200;
let currentRow = -1;

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const colors: any = {
  Pesach: "#1E90FF",
  Shavuot: "#7CF000",
  //"Shavuot": "#FFD700",
  "Rosh Hashana": "#D3143C",
  "Yom Kippur": "#8B0000",
  Sukkot: "#FFFF00"
};