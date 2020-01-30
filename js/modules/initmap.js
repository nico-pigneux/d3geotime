
// leaflet setting
// set the center point 
// var anchorpointgps = [30.5928, 114.3055] //(Wuhan, China)
var anchorpointgps = [39.6243, 19.9217] // world center, near Greek
var defaultzoom = 2;

//create the map, set anchorpoint, and default zoom level
// Note: need to careate a div with id='map' prior to this step
var map = L.map('map').setView(anchorpointgps, defaultzoom);

// link to the open map
var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';

// obtain a png as the background map // openstreet map
// L.tileLayer(
//     'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; ' + mapLink + ' Contributors',
//     maxZoom: 18,
// }).addTo(map);

//all available maps can be found at:
//http://leaflet-extras.github.io/leaflet-providers/preview/index.html
//https://github.com/leaflet-extras/leaflet-providers
// the Esri map
var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});
Esri_WorldStreetMap.addTo(map)


/* Initialize the SVG layer */
// map._initPathRoot() // for leaflet v0.7 and earlier

// the following are for leaflet v0.8+
// https://groups.google.com/forum/#!topic/leaflet-js/bzM9ssegitU
var svgLayer = L.svg();
svgLayer.addTo(map);

/* Add a big svg, and a big g element */
// for leaflet v .7 and earlier
// var bigsvg = d3.select("#map").select("svg"),
//     bigg = bigsvg.append("g");

// for leaflet v1.0+???
//https://observablehq.com/@sfu-iat355/introduction-to-leaflet-and-d3
const overlay = d3.select(map.getPanes().overlayPane)
const bigsvg = overlay.select('svg')
const bigg = d3.select("#map").select("svg").select('g');
bigg.attr("class", "leaflet-zoom-hide");

