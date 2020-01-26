//based on https://bl.ocks.org/mbostock/899711

// Load the station data. When the data comes back, create an overlay.
d3.json("data/novocorona2.json", function (error, data) {
  if (error) throw error;

  var datasum = data.sum;
  addgroup(datasum, 50, 5);

  var dataindiv=data.individaul;
  addindiv(dataindiv);

});