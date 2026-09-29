import * as d3 from "d3";
import { restructure } from "./structure-for-d3";
import { constants, daysOfWeek, defaultCheckedYomTovs } from "./constants";
import {
  atLeastOneYomTovIsSelected,
  calculateNumberOfRows,
  minifyYTName,
  sortYomTovs,
} from "./utils";
import { structureFromHebcal } from "./structure-from-hebcal";
import { IInputYear, IStructuredD3Block } from "./types";
import { hebcal_data } from "./hebcal-data";
import { buildYearRange, loadYears, PreviousOrFollowing } from "./load-years";
import { loadSavedSelection, saveSelection } from "./selection-storage";

let originalData: IStructuredD3Block[][];
let activeData: IStructuredD3Block[][] = [];

// LOAD DATA FROM HEBCAL
// var xmlHttp = new XMLHttpRequest();
// xmlHttp.open( "GET", 'https://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=off&mod=off&nx=off&year=2019&month=x&mf=off&c=off&m=50', false ); // false for synchronous request
// xmlHttp.send( null );
//let hebcalDataProcessed = <IHebcalYearRaw>JSON.parse(xmlHttp.responseText);

const structuredYears: IInputYear[] = [];
hebcal_data.forEach((hebcalYear) =>
  structuredYears.push(structureFromHebcal(hebcalYear))
);
//const structuredByYear = structureFromHebcal(hebcalDataProcessed);
originalData = restructure(structuredYears);
activeData = originalData;

const AVAILABLE_YOM_TOVS: string[] = Array.from(
  new Set(
    activeData[0].map((block: IStructuredD3Block) => block.yomTov) // just take the 0 year. All years [should] have same Yom Tovs
  )
).sort((yt1, yt2) => sortYomTovs(yt1) - sortYomTovs(yt2));

const initiallyCheckedYomTovs: string[] =
  loadSavedSelection(AVAILABLE_YOM_TOVS) || defaultCheckedYomTovs;

const CURRENT_YEAR = String(new Date().getFullYear());

const previousyearsbtn = document.getElementById("previousyearsbtn");
if (previousyearsbtn) {
  previousyearsbtn.addEventListener("click", async () => {
    loadAdditionalYears("previous", previousyearsbtn as HTMLButtonElement);
  });
}
const followingyearsbtn = document.getElementById("followingyearsbtn");
if (followingyearsbtn) {
  followingyearsbtn.addEventListener("click", async () => {
    loadAdditionalYears("following", followingyearsbtn as HTMLButtonElement);
  });
}

function saveCheckedHolidays(): void {
  const checked: string[] = [];
  document
    .querySelectorAll<HTMLInputElement>(".chkbox:checked")
    .forEach((checkbox) => checked.push(checkbox.value));
  saveSelection(checked);
}

function setAllHolidaysChecked(checked: boolean): void {
  document
    .querySelectorAll<HTMLInputElement>(".chkbox")
    .forEach((checkbox) => (checkbox.checked = checked));
  saveCheckedHolidays();
  filterHolidays();
  draw();
}

const selectallbtn = document.getElementById("selectallbtn");
if (selectallbtn) {
  selectallbtn.addEventListener("click", () => setAllHolidaysChecked(true));
}
const deselectallbtn = document.getElementById("deselectallbtn");
if (deselectallbtn) {
  deselectallbtn.addEventListener("click", () => setAllHolidaysChecked(false));
}

async function loadAdditionalYears(
  previousOrFollowing: PreviousOrFollowing,
  button: HTMLButtonElement
) {
  const errorArea = document.getElementById(previousOrFollowing + "yearserror");
  const originalLabel = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<span class="loading-spinner"></span> Loading…';
  if (errorArea) errorArea.hidden = true;

  try {
    // Uses originalData because activeData years are empty when no holidays are checked
    const yearRange = buildYearRange(
      previousOrFollowing,
      previousOrFollowing === "previous"
        ? Number(originalData[0][0].year)
        : Number(originalData[originalData.length - 1][0].year)
    );
    const additionalYears = await loadYears(...yearRange);
    if (previousOrFollowing === "previous") {
      originalData = [...additionalYears, ...originalData];
    } else {
      originalData = [...originalData, ...additionalYears];
    }
    filterHolidays();
    draw();
  } catch (e) {
    console.error("Failed to load additional years", e);
    if (errorArea) {
      errorArea.textContent =
        "Couldn't load more years. Check your connection and try again.";
      errorArea.hidden = false;
    }
  } finally {
    button.disabled = false;
    button.innerHTML = originalLabel;
  }
}

console.log("Starting script..");

let filterOutHolidays: string[] = [];

d3.selectAll(".chkbox").on("change", () => {
  filterHolidays();
  draw();
});

function filterHolidays(): void {
  var newData: any[];
  var checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll(
    "input[type=checkbox]:not(:checked)"
  );
  filterOutHolidays = [];
  for (var i = 0; i < checkboxes.length; i++) {
    filterOutHolidays.push(checkboxes[i].value);
  }
  newData = [];
  for (var d1 = 0; d1 < originalData.length; d1++) {
    newData[d1] = [];
    for (var d2 = 0; d2 < originalData[d1].length; d2++) {
      if (filterOutHolidays.indexOf(originalData[d1][d2].yomTov) === -1) {
        newData[d1].push(originalData[d1][d2]);
        // originalData[d1][d2]['hide'] = true;
      }
    }
  }
  activeData = newData;
}

// Checkboxes
let checkBoxArea = d3
  .select("#new-checkboxes-area > .list-group")
  .selectAll("input")
  .data(AVAILABLE_YOM_TOVS)
  .enter()
  .append("li")
  .attr("class", "list-group-item")
  .append("div")
  .attr("class", "custom-control custom-checkbox");

checkBoxArea
  .append("input")
  .attr("class", "chkbox custom-control-input")
  .attr("value", (d: string) => {
    return d;
  })
  .attr("id", (d, i) => "chkbox_" + minifyYTName(d))
  .attr("type", "checkbox")
  .attr("checked", (ytName) => {
    return initiallyCheckedYomTovs.indexOf(ytName) > -1 ? "true" : null;
  });

checkBoxArea
  .append("label")
  .attr("class", "custom-control-label")
  .attr("for", (d, i) => "chkbox_" + minifyYTName(d))
  .text((d: string) => {
    return d;
  });

d3.selectAll(".chkbox").on("change", () => {
  saveCheckedHolidays();
  filterHolidays();
  draw();
});

// set the ranges
var x = d3
  .scaleBand()
  .domain(daysOfWeek.concat(" "))
  .range([0, constants.width]);

const dayWidth = x.bandwidth();
const BAR_PADDING = 3;
const BAR_HEIGHT = 20;

/** Pattern ids go inside url(#...), so keep them to safe characters */
function photoPatternId(yomTov: string): string {
  return "photo-" + yomTov.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function draw() {
  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  d3.select("#calendar-area > .day-header").remove();
  d3.select("#calendar-area > svg").remove();
  /* Tooltip Holder */

  let div = d3
    .select("#calendar-area")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Days of the week column headers, in a sticky strip above the calendar
  const LEFT_MARGIN = 25;
  const DAY_HEADER_HEIGHT = 28;
  d3.select("#calendar-area")
    .append("div")
    .attr("class", "day-header")
    .append("svg")
    .attr(
      "width",
      constants.width + constants.margin.left + constants.margin.right
    )
    .attr("height", DAY_HEADER_HEIGHT)
    .append("g")
    .attr("transform", "translate(" + constants.margin.left + ",0)")
    .selectAll(".text")
    .data(daysOfWeek)
    .enter()
    .append("text")
    .text((i) => i)
    .attr("x", (i: any) => {
      const domainValue = x(i);
      if (domainValue) return domainValue + LEFT_MARGIN;
      return LEFT_MARGIN;
    })
    .attr("y", DAY_HEADER_HEIGHT - 8)
    .attr("class", "year-text")
    .style("fill", "black");

  let svg_main = d3.select("#calendar-area").append("svg");

  let svg = svg_main
    .attr(
      "width",
      constants.width + constants.margin.left + constants.margin.right
    )
    .attr(
      "width",
      constants.width + constants.margin.left + constants.margin.right
    )
    .attr(
      "height",
      constants.height + constants.margin.top + constants.margin.bottom
    )
    .append("g")
    .attr("id", "container")
    .attr(
      "transform",
      "translate(" + constants.margin.left + "," + constants.margin.top + ")"
    );

  const defs = svg_main.append("defs");
  Object.keys(constants.holidayImages).forEach((yomTov) => {
    defs
      .append("pattern")
      .attr("id", photoPatternId(yomTov))
      .attr("patternUnits", "objectBoundingBox")
      .attr("width", 1)
      .attr("height", 1)
      .append("image")
      .attr("href", constants.holidayImages[yomTov])
      .attr("width", dayWidth - BAR_PADDING * 2)
      .attr("height", BAR_HEIGHT)
      .attr("preserveAspectRatio", "xMidYMid slice");
  });

  // svg
  //   .append('g')
  //   .selectAll('.day-line')
  //   .data(daysOfWeek)
  //   .enter()
  //   .append('line')
  //   .attr("x1", (d, i) => i*dayWidth)
  //   .attr("y1", 0)
  //   .attr("x2", (d, i) => i*dayWidth)
  //   .attr("y2", calendarHeight)
  //   .style("stroke-width", 2)
  //   .style("stroke", "#222")
  //   .style("fill", "none");

  //console.log("data", data);
  // Scale the range of the data in the domains

  const yearGroup = svg
    .selectAll(".year-group")
    .data(activeData, (d: any) =>
      atLeastOneYomTovIsSelected(d) ? d[0].year : 0
    ) // key is the year
    .enter()
    .append("g")
    .attr("year-height", (d, i, j) => {
      //var yearHeight = i===0? 0 : calculateNumberOfRows(j[i].__data__)*rowHeight;
      var yearHeight = calculateNumberOfRows(d) * constants.rowHeight;
      return yearHeight;
    })
    .attr("transform", (d, i, j) => {
      var totalOffset = constants.interyearMargin; // first year should be offset by 20
      if (i > 0) {
        var heightOfPreviousYear = parseInt(
          d3.select(j[i - 1]).attr("year-height")
        );
        var offsetOfPreviousYear = parseInt(
          d3
            .select(j[i - 1])
            .attr("transform")
            .split(",")[1]
        );
        totalOffset =
          heightOfPreviousYear +
          offsetOfPreviousYear +
          constants.interyearMargin;
      }
      return "translate(0," + totalOffset + ")";
    })
    .attr("id", (d) =>
      atLeastOneYomTovIsSelected(d) ? "year-" + d[0].year : ""
    ) // just take first element's year, to determine year of group
    .classed("current-year", (d) =>
      atLeastOneYomTovIsSelected(d) ? d[0].year === CURRENT_YEAR : false
    );

  yearGroup
    .filter(".current-year")
    .append("rect")
    .attr("class", "current-year-band")
    .attr("x", -70)
    .attr("y", -3)
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("width", constants.width + 70)
    .attr("height", (d) => calculateNumberOfRows(d) * constants.rowHeight + 1);

  // Each day
  const bars = yearGroup.selectAll(".bar-groups").data(
    (d) => d,
    (d: any) => `${d.year}-${d.yomTov}-${d.subYomTov}`
  );

  bars
    .enter()
    // .filter(d => {
    //   return !!!d.hide;
    // })
    .append("rect")
    .attr("class", "bar")
    .attr("day", (dayObj: any) => dayObj.day)
    .attr("row-number-wrt-year", (d: any, i, j: any) => {
      if (i === 0) return "0";
      var newIndex;
      const previousDay = j[i - 1].attributes.day.value;
      const currentDay = d.day;
      var previousBarRowIndex = parseInt(
        j[i - 1].attributes["row-number-wrt-year"].value
      );
      // Was there a Saturday in between this set and the last?
      // Skip for index = 0, since obviously we haven't hit a Saturday yet
      if (
        daysOfWeek.indexOf(currentDay) - daysOfWeek.indexOf(previousDay) <=
        0
      ) {
        // We've crossed a Saturday
        newIndex = previousBarRowIndex + 1;
      } else {
        // we didn't cross a Saturday
        newIndex = previousBarRowIndex;
      }
      return newIndex;
    })
    // ANIMATION START
    /*.attr("x", dayObj => {
      return (daysOfWeek.indexOf(dayObj.day) * dayWidth);
    })
    .attr("y", (d, i, j) => {
      return j[i].attributes['row-number-wrt-year'].value * rowHeight;
    })
    .transition()
    .duration(500)*/
    .attr("x", (dayObj: any) => {
      return daysOfWeek.indexOf(dayObj.day) * dayWidth + BAR_PADDING;
    })
    .attr("y", (d, i, j: any) => {
      return j[i].attributes["row-number-wrt-year"].value * constants.rowHeight;
    })
    // END ANIMATION
    .attr("width", (i) => dayWidth - BAR_PADDING * 2)
    .attr("height", BAR_HEIGHT)
    .attr("rx", 4)
    .attr("ry", 4)
    .style("fill", (dayObj: any) => constants.colors[dayObj.yomTov] || "#222")
    // TOOLTIP START
    .on("mouseover", function (d: any) {
      let tooltipString = d.yomTov;
      if (d.subYomTov && d.subYomTov !== d.yomTov) {
        tooltipString = tooltipString + "/ " + d.subYomTov;
      }
      tooltipString = tooltipString + " " + d.year;
      div.transition().duration(200).style("opacity", 0.9);
      div
        .html(tooltipString)
        .style("left", d3.select(this).attr("x") + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      div.transition().duration(500).style("opacity", 0);
    });
  // END TOOLTIP

  bars.exit().remove();

  // Holiday photo over each bar; pointer-events off so the bar still gets the tooltip
  yearGroup
    .selectAll("rect.bar")
    .filter((d: any) => !!constants.holidayImages[d.yomTov])
    .each(function (d: any) {
      const bar = d3.select(this as SVGRectElement);
      d3.select((this as SVGRectElement).parentNode as SVGGElement)
        .append("rect")
        .attr("class", "bar-photo")
        .attr("x", bar.attr("x"))
        .attr("y", bar.attr("y"))
        .attr("width", bar.attr("width"))
        .attr("height", bar.attr("height"))
        .attr("rx", bar.attr("rx"))
        .attr("ry", bar.attr("ry"))
        .attr("fill", "url(#" + photoPatternId(d.yomTov) + ")")
        .attr("pointer-events", "none");
    });

  /*
const bars = yomTovObjects.selectAll()
  .data((ytObj) => {
    console.log('ytObj.days', ytObj.days);
    return ytObj;
  })
  .append("rect")
  .attr("class", "bar")
  .attr("x", 100) //
  .attr("y", 50)
  .attr("width", 200)
  .attr("height", 20)
  .style('fill', (i) => '#123' ); // colors[i.yomTov]);
*/

  let totalNumberOfRows = 0;

  yearGroup
    .append("text")
    .attr("class", "year-label")
    .attr("x", "-60")
    .attr("y", (d) => {
      var numberOfRows = calculateNumberOfRows(d);
      totalNumberOfRows += numberOfRows;
      return (numberOfRows * constants.rowHeight) / 2;
    })
    /*.attr('transform', (d) => {
      var numberOfRows = calculateNumberOfRows(d);
      return `translate(-40, ${numberOfRows*rowHeight})`
    })*/
    .text((d) => (atLeastOneYomTovIsSelected(d) ? d[0].year : ""));

  // Recalculate the height of visualizer area
  const calculatedFinalHeight =
    totalNumberOfRows * constants.rowHeight + // all the rows
    (originalData.length - 1) * constants.interyearMargin + // all the spaces between the rows
    constants.margin.bottom * 2;
  svg_main.attr("height", calculatedFinalHeight);

  // Shade the weekend columns behind everything else
  ["Sunday", "Saturday"].forEach((day) => {
    svg
      .insert("rect", ":first-child")
      .attr("class", "weekend-column")
      .attr("x", daysOfWeek.indexOf(day) * dayWidth)
      .attr("y", 0)
      .attr("width", dayWidth)
      .attr("height", calculatedFinalHeight);
  });

  // Draw the day swimlanes
  svg
    .append("g")
    .selectAll(".day-lines")
    .data(daysOfWeek)
    .enter()
    .append("line")
    .attr("x1", (d, i) => i * dayWidth)
    .attr("y1", 0)
    .attr("x2", (d, i) => i * dayWidth)
    .attr("y2", calculatedFinalHeight)
    .style("stroke-width", 2)
    .style("stroke", "#ddd");
}

filterHolidays();
draw();
