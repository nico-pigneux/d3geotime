// Create the Google Map…
var map = new google.maps.Map(d3.select("#map").node(), {
    zoom: 5,
    center: new google.maps.LatLng(30.5928, 114.3055),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });