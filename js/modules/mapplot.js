var displayNodes = function (dataArray) {

    // //bind data to g elements
    var nodegs = bigg.selectAll("g")
        .data(dataArray)
        .enter().append("g")

    // bind grouped data of all cases of a location to circles
    var allcasesnodes = nodegs.append('circle')
        .attr("class", 'allcases')
        .attr("r", d => {
            var r, allcases = d.data[2] + d.data[3];
            r = cat_r(allcases);
            return r;
        })
        ;

    // bind grouped data of confirmed cases of a location to circles
    var confirmedcasesnodes = nodegs.append('circle')
        .attr("class", 'confirmed')
        .attr("r", d => {
            var r = cat_r(d.data[2]);
            return r;
        })
        ;

    function updatenodes() {

        nodegs.attr("transform",
            function (d) {
                // console.log(map.latLngToLayerPoint(d.LatLng).x)
                // console.log(map.latLngToLayerPoint(d.LatLng).y)
                return "translate(" +
                    map.latLngToLayerPoint(d.LatLng).x + "," +
                    map.latLngToLayerPoint(d.LatLng).y + ")";
            }
        )
    }


    // on reset, update the map, for leaflet v 0.7 and earlier
    // map.on("viewreset", update);
    // update();

    // on zoomend, update the map, for leaflet v1.0 +
    //https://observablehq.com/@sfu-iat355/introduction-to-leaflet-and-d3
    map.on("zoomend", updatenodes);
    updatenodes();

    // get the binded nodes
    // Note: must be put here (after running updatenodes() )
    var nodes = bigg.selectAll("g")
        .data(dataArray, d => {
            return d.id;
        });

    // remove unbinded elements
    nodes.exit()
        .transition().duration(0)
        .attr("r", 1)
        .remove();

} // end function displayNodes

// filter data according to timeline, and display Nodes on map
function sliderupdate(h) {
    // update position and text of label according to slider scale
    handle.attr("cx", x(h));
    label
        .attr("x", x(h))
        .text(formatDateYMDH(h));

    // filter data set and redraw plot
    // var newData = dataset.filter(function (d) {
    var newData = dataset.filter(function (d) {
        // console.log(d)
        return d.time < h;
    })

    displayNodes(newData);

}

// set timeline progress
function step() {
    sliderupdate(x.invert(currentValue));
    // currentValue = currentValue + (targetValue / 151); 
    currentValue = currentValue + distancePerStep; // moving forward by adding distance per step
    if (currentValue > targetValue) {
      moving = false;
      currentValue = 0;
      clearInterval(timer);
      // timer = 0;
      playButton.text("Play");
    //   console.log("Slider moving: " + moving);
    }
  }
  