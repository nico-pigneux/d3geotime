// set the center point (Wuhan, China)
var anchorpointgps = [30.5928, 114.3055]
var defaultzoom=5

//create the map, set anchorpoint, and default zoom level
var map = L.map('map').setView(anchorpointgps, defaultzoom);

// link to the open map
var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

// obtain a png as the background map
L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
}).addTo(map);

/* Initialize the SVG layer */
map._initPathRoot()

/* Add a big svg, and a big g element */
var bigsvg = d3.select("#map").select("svg"),
    bigg = bigsvg.append("g");

// bigsvg
// .style('background-color', "white")
// .style('opacity', '0.6')