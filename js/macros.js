function addgroup(datasum, denominator, minir) {

    var overlay = new google.maps.OverlayView();
    // Add the container when the overlay is added to the map.
    overlay.onAdd = function () {
        var layer = d3.select(this.getPanes().overlayLayer).append("div")
            .attr("class", "stations");

        // Draw each marker as a separate SVG element.
        // We could use a single SVG, but what size would it have?
        overlay.draw = function () {
            var projection = this.getProjection(),
                padding = 0;

            var marker = layer.selectAll("svg")
                .data(d3.entries(datasum))
                .each(transform) // update existing markers
                .enter().append("svg")
                .each(transform)
                .attr("class", "marker");

            // Add circles for total cases (confirmed + suspected).
            marker.append("circle")
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

    // Bind our overlay to the map…
    overlay.setMap(map);
}  // end addnodes