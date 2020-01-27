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
map._initPathRoot() // for leaflet v0.7 and earlier

// the following are for leaflet v0.8+
// https://groups.google.com/forum/#!topic/leaflet-js/bzM9ssegitU
// var svgLayer = L.svg();
// svgLayer.addTo(map);

/* Add a big svg, and a big g element */
// for leaflet v .7 and earlier
var bigsvg = d3.select("#map").select("svg"),
    bigg = bigsvg.append("g");

// for leaflet v1.0+???
var bigsvg = d3.select("#map").select("svg");
    var bigg = d3.select("#map").select("svg").select('g');
    bigg.attr("class", "leaflet-zoom-hide");

