var srcdata="data/circles2.csv"

// https://bl.ocks.org/zanarmstrong/ca0adb7e426c12c06a95
var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%b %Y");
var formatDateMD=d3.timeFormat("%b%d");
var formatDateYMD=d3.timeFormat("%Y-%m-%d");
var formatDateYMDH=d3.timeFormat("%Y-%m-%d %H:00");
var parseDate = d3.timeParse("%m/%d/%y");

var startDate = new Date("2020-01-21"),
    // endDate = new Date("2020-01-29");
    endDate=new Date(); // the current date and time when the page is loaded

var
    hoursPerInterval= 12; // number of hours to skip per step
    speedInMSPerStep = 500; // 1 second = 1000 ms

var margin = {top:0, right:50, bottom:0, left:10},
    width = 1000 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

// the global var for plot data
var dataset;
var newData;

// the global vars for nodes to be plotted on the map
var nodes;
var nodegs;

var rcats = [5,10,15,20,25]





