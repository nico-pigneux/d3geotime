var displayNodes = function (dataArray) {

    // in the raw data (dataArray, data of a place is repeated for different time point)
    // the following part is to have the most recent data for each place, so that each place will
    // have a distinct set of data (e.g., # confirmed cases, etc), which will be used to determine the quantile categories
    var recentdata = getRecent(dataArray);
    // console.log(recentdata)

    // get the recent confirmed
    var recentconfirmed = []
    recentdata.forEach(d => {
        recentconfirmed.push(d.data[2])
    })

    var cutoff = getCutoff(recentconfirmed);
    // console.log(cutoff);

    function getCutoff(A) {
        if (A.length > 5) {
            return math.quantileSeq(A, [.5, .8, .95, .99])
        } else {
            return [999999, 999999, 999999, 999999]
        }
    }

    //update legend
    // console.log(cutoff)
    if (cutoff !== undefined && cutoff[0] !== 999999) {
        var i = 1
        d3.selectAll('text.circlelegendtext').nodes().forEach(d => {
            // console.log(i)
            if (i === 1) {
                var thestr = 'confirmed <' + cutoff[i - 1].toFixed()
            } else if (i === cutoff.length + 1) {
                var thestr = cutoff[i - 2].toFixed() + "+"
            } else {
                if (i > 1 && i < 5) {
                    var thestr = cutoff[i - 2].toFixed() + "-" + (cutoff[i - 1] - 1).toFixed()
                }
            }
            d3.select(d).text(thestr)
            i = i + 1
        })
    }


    // delete existing g. No need, excessive g components are removed by in the following exit() part
    // d3.selectAll('circle.confirmed').remove();
    // d3.selectAll('g.nodeg').remove();

    // //bind data to g elements
    var nodegs = bigg.selectAll("g")
        .data(dataArray)
        .enter().append("g")
        .attr("class", "nodeg")

    // bind confirmed cases of a location to circles
    var confirmedcasesnodes = nodegs.append('circle')
        .attr("class", 'confirmed')
        .attr("r", d => {
            if (d.data[6] === "Kathmandu") {
                // console.log(d);
                r = cat_r(d.data[2], cutoff, rcats);
            } else {
                r = cat_r(d.data[2], cutoff, rcats);
            }
            return r;
        })
        ;


    // get the recent deceased
    var recentdeceased = []
    recentdata.forEach(d => {
        recentdeceased.push(d.data[5])
    })

    var cutoffdeceased = getCutoff2(recentdeceased);
    // console.log(cutoffdeceased);

    function getCutoff2(A) {
        if (A.length > 5) {
            return math.quantileSeq(A, [.8, .95, .99])
        } else {
            return [999999, 999999, 999999]
        }
    }

    function cat_r3(ncases, cutoffv, rcatsv) {

        // console.log(ncases) // e.g., 1
        // console.log(cutoffv) // e.g., 0, 1, 55.6
        // console.log(rcatsv) // [2, 5 10]

        var r;
        // if (ncases===0){ r= 0 }
        // else if (ncases <= cutoffv[0]) {
        //     r = rcatsv[0]
        // } else if (ncases <= cutoffv[1]){
        //     r=rcatsv[1]
        // } else if (ncases <= cutoffv[2]){
        //     r=rcatsv[2]
        // }

        if (ncases === 0) { r = 0 }
        else if (ncases <= 1) {
            r = rcatsv[0]
        } else if (ncases <= 55) {
            r = rcatsv[1]
        } else {
            r = rcatsv[2]
        }


        // console.log(ncases)
        // console.log('returned rw' + r)
        return r;
    }

    // bind deceased cases of a location to 
    var deceasedcasenodes = nodegs.append('rect')
        .attr("class", 'deceased')
        .attr("width",
            d => {
                if (d.data[6] === "Shanghai") {
                    //  console.log(d.data);
                    var w = cat_r3(d.data[5], cutoffdeceased, scats);
                    //  console.log (w);
                } else {
                    var w = cat_r3(d.data[5], cutoffdeceased, scats);
                }
                return w;
            }
        )
        .attr("height", d => {
            var w = cat_r3(d.data[5], cutoffdeceased, scats);
            return w;
        })
        ;


    // update the position on  the map
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

    updatenodes();

    // on reset, update the map, for leaflet v 0.7 and earlier
    // map.on("viewreset", update);
    // update();

    // on zoomend, update the map, for leaflet v1.0 +
    //https://observablehq.com/@sfu-iat355/introduction-to-leaflet-and-d3
    map.on("zoomend", updatenodes);
    

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


// set actions when the playButton is clicked
playButton
    .on("click", function () {
        var button = d3.select(this);
        if (button.text() == "Pause") {
            moving = false;
            clearInterval(timer);
            // timer = 0;
            button.text("Play");
        } else {
            moving = true;
            timer = setInterval(step, speedInMSPerStep);
            button.text("Pause");
        }
        // console.log("Slider moving: " + moving);
    })

// set actions on slider events
slider.call(
    d3.drag()
        .on("start.interrupt", function () { slider.interrupt(); })
        .on("start drag", function () {
            currentValue = d3.event.x; // get the x poistion of the mouse
            sliderupdate(x.invert(currentValue));
        })
);
