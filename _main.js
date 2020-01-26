//based on https://bl.ocks.org/mbostock/899711

// Create the Google Map…
var map = new google.maps.Map(d3.select("#map").node(), {
    zoom: 5,
    center: new google.maps.LatLng(30.5928, 114.3055),
    mapTypeId: google.maps.MapTypeId.TERRAIN
});

// Load the json data. When the data comes back, create an overlay.
d3.json("data/stations.json", function (error, data) {
    if (error) throw error;

    // from the data, had a distinct list of locations of diagnosis 
    var sumdata = data.sum;
    console.log(sumdata);


    var overlay = new google.maps.OverlayView();

    // Add the container for locations.
    overlay.onAdd = function () {

        var layer = d3.select(this.getPanes().overlayLayer).append("div")
            .attr("class", "locations")
            ;
        // console.log(layer)


        // Draw each marker as a separate SVG element.
        // We could use a single SVG, but what size would it have?
        overlay.draw = function () {
            var projection = this.getProjection(),
                padding = 0;
        // console.log(this)

            var marker = layer.selectAll("svg")
                .data(d3.entries(sumdata))
                .each(transform) // update existing markers
                .enter().append("svg")
                .each(transform)
                .attr("class", "marker");

            // Add a circle for total cases (confirmed + suspected).
            // marker.append("circle")
            //     .attr("class", "confsusp")
            //     .attr("r", d=>{
                    
            //         var r = (d.value[2]+ d.value[3])/250;
            //         console.log(r)
            //         if (r < 2 ) {r=2};
            //         return r;
            //     })
            //     .attr("cx", padding)
            //     .attr("cy", padding)
            //     ;
                  // Add a circle.
                marker.append("circle")
                .attr("r", 20)
                .attr("cx", padding)
                .attr("cy", padding);



            // Add a label.
            // marker.append("text")
            //     .attr("class", 'textlabel')
            //     // .attr("x", padding + 30)
            //     .attr("y", d=>{
            //         var r= d.value[4] / 100;
            //         if (r<10) {r=10}
            //         return (padding + 15 + r);
            //     })
            //     .attr("dy", ".31em")
            //     .text(function (d) { return d.key; })
            //     ;

            function transform(d) {
                d = new google.maps.LatLng(d.value[0], d.value[1]);
                d = projection.fromLatLngToDivPixel(d);
                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
            }
        };
    };

    // Bind our overlay to the map…
    overlay.setMap(map);

function notrun (){    
} //notrun
});