var displayNodes = function (dataArray) {

    

    var recentdata= getRecent(dataArray);
    // console.log(recentdata)

    // get the recent confirmed
    var recentconfirmed = []
    recentdata.forEach(d=>{
        recentconfirmed.push(d.data[2])
    })

    var cutoff = getCutoff(recentconfirmed);
    // console.log(cutoff);

    function getCutoff(A){
        if (A.length > 5 ) { 
            return math.quantileSeq(A, [.5, .8, .95, .99])
        } else {
            return [999999,999999,999999,999999]
        }  
    }
    
    //update legend
    // console.log(cutoff)
    if (cutoff !== undefined && cutoff[0] !== 999999){
    var i = 1
    d3.selectAll('text.circlelegendtext').nodes().forEach(d=>{
        if (i === 1){
          var thestr = '0 < confirmed <' + cutoff[i-1].toFixed()  
        } else if (i=== cutoff.length + 1) {
            var thestr = "confirmed >= " + cutoff[i-2].toFixed()
        }  else {
            var thestr = cutoff[i-2].toFixed() + ' <= confirmed < ' + cutoff[i-1].toFixed()
        }
        
        d3.select(d).text(thestr)
        i = i+1
    })
}


      // delete existing g
    d3.selectAll('circle.confirmed').remove();
    d3.selectAll('g.nodeg').remove();

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
                r= cat_r(d.data[2], cutoff, rcats );
            }else {
                r= cat_r(d.data[2], cutoff, rcats );
            }
            return r;
        })
        ;

    // bind deceased cases of a location to circles
    // var deceasedcasenodes = nodegs.append('circle')
    //     .attr("class", 'deceased')
    //     .attr("r", d => {
    //         var r = cat_r(d.data[5]);
    //         return r;
    //     })
    //     ;

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
            currentValue = d3.event.x;
            sliderupdate(x.invert(currentValue));
        })
);
