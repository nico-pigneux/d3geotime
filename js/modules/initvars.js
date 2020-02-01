var srcdata = "data/circles2.csv"

// https://bl.ocks.org/zanarmstrong/ca0adb7e426c12c06a95
var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%b %Y");
var formatDateMD = d3.timeFormat("%b%d");
var formatDateYMD = d3.timeFormat("%Y-%m-%d");
var formatDateYMDH = d3.timeFormat("%Y-%m-%d %H:00");
var parseDate = d3.timeParse("%m/%d/%y");

//date range for the slider
var startDate = new Date("2020-01-21"),
    // endDate = new Date("2020-01-29");
    endDate = new Date(); // the current date and time when the page is loaded

// play related
var
    hoursPerInterval = 6; // number of hours to skip per step
speedInMSPerStep = 20; // 1 second = 1000 ms

// size of the slider box
var margin = { top: 0, right: 10, bottom: 0, left: 10 },
    width = 900 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

// the global var for plot data
var dataset; // the loaded data (a JSON)
var newData; // filtered data, i.e., data before the time according to the slider

// the global vars for nodes to be plotted on the map
var nodes; // the d3 data and dom binded objects
var nodegs; // the g elements holding displayed circle and rect 

// circle of confirmed cases
var rcats = [5, 10, 15, 20, 25] // the size of the circles according to the # of cases
// rect of deceased cases
var scats = [2, 5, 10] // the size of the rects acccording to death cases





