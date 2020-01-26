function addindiv(data) {

    var overlay2 = new google.maps.OverlayView();

    // Add the container when the overlay is added to the map.
    overlay2.onAdd = function () {
        var layer2 = d3.select(this.getPanes().overlayLayer).append("div")
            .attr("class", "stations");
            console.log('is it running')
        // Draw each marker as a separate SVG element.
        // We could use a single SVG, but what size would it have?
        overlay2.draw = function () {
            var projection = this.getProjection(),
                padding = 0;
console.log(projection)
function notrun() {
            var marker2 = layer2.selectAll("svg")
                .data(d3.entries(data))
                .each(transform) // update existing markers
                .enter().append("svg")
                .each(transform)
                .attr("class", "marker");

            // Add circles for total cases (confirmed + suspected).
            marker2.append("circle")
                .attr("class", "confsusp")
                .attr("r", d => {
                    var r = (d.value[2] + d.value[3]) / denominator;
                    if (r < minir) { r = minir };
                    return r;
                })
                .attr("cx", d => {
                    var r = (d.value[2] + d.value[3]) / denominator;
                    if (r < minir) { r = minir };
                    return r;
                })
                .attr("cy", d => {
                    var r = (d.value[2] + d.value[3]) / denominator;
                    if (r < minir) { r = minir };
                    return r;
                });

            // Add circles for confirmed cases.
            marker.append("circle")
                .attr("class", "confirmed")
                .attr("r", d => {
                    var r = (d.value[2]) / denominator;
                    return r;
                })
                .attr("cx", d => {
                    var r = (d.value[2] + d.value[3]) / denominator;
                    return r;
                })
                .attr("cy", d => {
                    var r = (d.value[2] + d.value[3]) / denominator;
                    return r;
                });

            function transform(d) {
                d = new google.maps.LatLng(d.value[1], d.value[0]);
                d = projection.fromLatLngToDivPixel(d);
                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
            }
        };
    };

    // Bind our overlay2 to the map…
    overlay2.setMap(map);
}
}  // end addindiv