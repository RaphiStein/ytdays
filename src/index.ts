import * as d3 from "d3";
import { restructure } from "./structure-for-d3";
import { constants, daysOfWeek, defaultCheckedYomTovs } from "./constants";
import {
  atLeastOneYomTovIsSelected,
  calculateNumberOfRows,
  minifyYTName,
} from "./utils";
import { structureFromHebcal } from "./structure-from-hebcal";
import { IInputYear, IStructuredD3Block } from "./types";
import { hebcal_data } from "./hebcal-data";
import { buildYearRange, loadYears, PreviousOrFollowing } from "./load-years";

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
    activeData[0].map((block: IStructuredD3Block) => block.subYomTov) // just take the 0 year. All years [should] have same Yom Tovs
  )
);

const previousyearsbtn = document.getElementById("previousyearsbtn");
if (previousyearsbtn) {
  previousyearsbtn.addEventListener("click", async () => {
    loadAdditionalYears("previous");
  });
}
const followingyearsbtn = document.getElementById("followingyearsbtn");
if (followingyearsbtn) {
  followingyearsbtn.addEventListener("click", async () => {
    loadAdditionalYears("following");
  });
}

async function loadAdditionalYears(previousOrFollowing: PreviousOrFollowing) {
  const yearRange = buildYearRange(
    previousOrFollowing,
    previousOrFollowing === "previous"
      ? Number(activeData[0][0].year)
      : Number(activeData[activeData.length - 1][0].year)
  );
  const additionalYears = await loadYears(...yearRange);
  if (previousOrFollowing === "previous") {
    originalData = [...additionalYears, ...originalData];
  } else {
    originalData = [...originalData, ...additionalYears];
  }
  filterHolidays();
  draw();
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
  .append("label")
  .attr("for", (d, i) => "chkbox_" + minifyYTName(d))
  .text((d: string) => {
    return d;
  })
  .append("input")
  .attr("class", "chkbox ml-2")
  .attr("value", (d: string) => {
    return d;
  })
  .attr("id", (d, i) => "chkbox_" + minifyYTName(d))
  .attr("type", "checkbox")
  .attr("checked", (ytName) => {
    return defaultCheckedYomTovs.indexOf(ytName) > -1 ? "true" : null;
  });

d3.selectAll(".chkbox").on("change", () => {
  filterHolidays();
  draw();
});

// set the ranges
var x = d3
  .scaleBand()
  .domain(daysOfWeek.concat(" "))
  .range([0, constants.width]);

const dayWidth = x.bandwidth();

function draw() {
  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  d3.select("#calendar-area > svg").remove();
  /* Tooltip Holder */

  let div = d3
    .select("#calendar-area")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

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

  // Days of the week column headers
  const LEFT_MARGIN = 25;
  svg
    .selectAll(".text")
    .data(daysOfWeek)
    .enter()
    .append("text")
    .text((i) => i)
    .attr("x", (i: any) => {
      const domainValue = x(i);
      if (domainValue) return domainValue + LEFT_MARGIN;
      return LEFT_MARGIN;
      //else throw Error('x(i) returned undefined!');
    })
    .attr("class", "year-text")
    .style("fill", "black");
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
    ); // just take first element's year, to determine year of group

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
      return daysOfWeek.indexOf(dayObj.day) * dayWidth;
    })
    .attr("y", (d, i, j: any) => {
      return j[i].attributes["row-number-wrt-year"].value * constants.rowHeight;
    })
    // END ANIMATION
    .attr("width", (i) => dayWidth)
    .attr("height", 20)
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
