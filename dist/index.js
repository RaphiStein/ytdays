"use strict";
let activeData = [];
let originalData = restructure(dates);
activeData = originalData;
/*var xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", 'https://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=off&mod=off&nx=off&year=2023&month=x&mf=off&c=off&m=50', false ); // false for synchronous request
xmlHttp.send( null );
let originalData = JSON.parse(xmlHttp.responseText).items;
activeData = originalData;*/
console.log("Starting script..");
let filterOutHolidays = [];
d3.selectAll(".chkbox").on("change", filterHolidays);
function filterHolidays(event) {
    var newData;
    var checkboxes = document.querySelectorAll("input[type=checkbox]:not(:checked)");
    filterOutHolidays = [];
    for (var i = 0; i < checkboxes.length; i++) {
        filterOutHolidays.push(checkboxes[i].value);
        console.log("filterOutHolidays", filterOutHolidays);
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
    draw();
}
// set the ranges
var x = d3
    .scaleBand()
    .domain(daysOfWeek.concat(" "))
    .range([0, width]);
const dayWidth = x.bandwidth();
function draw() {
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    d3
        .select("#calendar-area > svg").remove();
    /* Tooltip Holder */
    let div = d3
        .select("#calendar-area")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    let svg = d3
        .select("#calendar-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("id", "container")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
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
    svg
        .append("g")
        .selectAll(".day-lines")
        .data(daysOfWeek)
        .enter()
        .append("line")
        .attr("x1", (d, i) => i * dayWidth)
        .attr("y1", 0)
        .attr("x2", (d, i) => i * dayWidth)
        .attr("y2", 500)
        .style("stroke-width", 2)
        .style("stroke", "#ddd");
    svg
        .selectAll(".text")
        .data(daysOfWeek)
        .enter()
        .append("text")
        .text(i => i)
        .attr("x", (i) => {
        const domainValue = x(i);
        if (domainValue)
            return domainValue + 25;
        return 25;
        //else throw Error('x(i) returned undefined!');
    })
        .attr("class", "year-text")
        .style("fill", "black");
    //console.log("data", data);
    // Scale the range of the data in the domains
    const yearGroup = svg
        .selectAll(".year-group")
        .data(activeData, (d) => {
        console.log("d", d[0].year);
        return d ? d[0].year : 0;
    }) // key is the year
        .enter()
        .append("g")
        .attr("year-height", (d, i, j) => {
        //var yearHeight = i===0? 0 : calculateNumberOfRows(j[i].__data__)*rowHeight;
        var yearHeight = calculateNumberOfRows(d) * rowHeight;
        return yearHeight;
    })
        .attr("transform", (d, i, j) => {
        var totalOffset = interyearMargin; // first year should be offset by 20
        if (i > 0) {
            var heightOfPreviousYear = parseInt(d3.select(j[i - 1]).attr("year-height"));
            var offsetOfPreviousYear = parseInt(d3
                .select(j[i - 1])
                .attr("transform")
                .split(",")[1]);
            totalOffset =
                heightOfPreviousYear + offsetOfPreviousYear + interyearMargin;
        }
        return "translate(0," + totalOffset + ")";
    })
        .attr("id", d => "year-" + d[0].year); // just take first element's year, to determine year of group
    // Each day
    const bars = yearGroup
        .selectAll(".bar-groups")
        .data(d => d, (d) => `${d.year}-${d.yomTov}-${d.subYomTov}`);
    bars
        .enter()
        // .filter(d => {
        //   return !!!d.hide;
        // })
        .append("rect")
        .attr("class", "bar")
        .attr("day", (dayObj) => dayObj.day)
        .attr("row-number-wrt-year", (d, i, j) => {
        if (i === 0)
            return "0";
        var newIndex;
        const previousDay = j[i - 1].attributes.day.value;
        const currentDay = d.day;
        var previousBarRowIndex = parseInt(j[i - 1].attributes["row-number-wrt-year"].value);
        // Was there a Saturday in between this set and the last?
        // Skip for index = 0, since obviously we haven't hit a Saturday yet
        if (daysOfWeek.indexOf(currentDay) - daysOfWeek.indexOf(previousDay) <=
            0) {
            // We've crossed a Saturday
            newIndex = previousBarRowIndex + 1;
        }
        else {
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
        .attr("x", (dayObj) => {
        return daysOfWeek.indexOf(dayObj.day) * dayWidth;
    })
        .attr("y", (d, i, j) => {
        return j[i].attributes["row-number-wrt-year"].value * rowHeight;
    })
        // END ANIMATION
        .attr("width", i => dayWidth)
        .attr("height", 20)
        .style("fill", (dayObj) => colors[dayObj.yomTov] || "#222")
        // TOOLTIP START
        .on("mouseover", function (d) {
        let tooltipString = d.yomTov;
        if (d.subYomTov && d.subYomTov !== d.yomTov) {
            tooltipString = tooltipString + "/ " + d.subYomTov;
        }
        tooltipString = tooltipString + " " + d.year;
        div
            .transition()
            .duration(200)
            .style("opacity", 0.9);
        div
            .html(tooltipString)
            .style("left", d3.select(this).attr("x") + "px")
            .style("top", d3.event.pageY - 28 + "px");
    })
        .on("mouseout", function (d) {
        div
            .transition()
            .duration(500)
            .style("opacity", 0);
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
    yearGroup
        .append("text")
        .attr("x", "-40")
        .attr("y", d => {
        var numberOfRows = calculateNumberOfRows(d);
        return numberOfRows * rowHeight / 2;
    })
        /*.attr('transform', (d) => {
        var numberOfRows = calculateNumberOfRows(d);
        return `translate(-40, ${numberOfRows*rowHeight})`
      })*/
        .text(d => d[0].year);
}
draw();
