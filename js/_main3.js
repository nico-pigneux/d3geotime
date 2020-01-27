
// read data from a json file
//"data/novocorona.json"
d3.json("data/novocorona.json", function (collection) {

    //use the real data, instead of the novocorona.json (which is incomplete)
    collection = getrealdata();
    // console.log(collection)

    /* Add a LatLng object to each item in the dataset */
    var i=0;
    collection.objects.forEach(function (d) {
        //obtain the gps coordinators (latitue, and longitude)
        d.LatLng = new L.LatLng(d.data[0],
            d.data[1])
        d.time = moment(d.data[8], "YYYY-MM-DD HH:mm:ss").unix();
        i=i+1;
        d.id=i;
    })

    // console.log(collection)
    var nodes;
    var nodegs;
    var displayNodes = function (dataArray) {

        //bind data to g elements
        nodes = bigg.selectAll("g")
            .data(dataArray, d=>{
                return d.id;
            });
        nodegs = nodes
            .enter().append("g")
            ;

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

        update();

        nodes.exit()
            .transition().duration(0)
            .attr("r",1)
            .remove();

    } // end function displayNodes

    //define the slider
    var minDateUnix = moment('2020-01-21', "YYYY MM DD").unix();
    var maxDateUnix = moment('2020-01-26', "YYYY MM DD").unix();
    var interval = 60 * 24 /12;

    var newData;
    d3.select('#slider3').call(d3.slider()
        .axis(true).min(minDateUnix).max(maxDateUnix).step(interval)
        .on("slide", function(evt, value) {
            newData = collection.objects.filter( function(d) {
                // console.log(d.time)
                
                return d.time <= value;
            })
            // console.log("New set size ", newData.length);
            // console.log(collection.objects.length)
            // console.log(newData)
            displayNodes(newData);

            map.on("zoomend", zoomed);

        })
    );

    //run displayNodes()
    // displayNodes(collection)

    // on reset, update the map, for leaflet v 0.7 and earlier
    // map.on("viewreset", update);
    // update();

    // on zoomend, update the map, for leaflet v1.0 +
    //https://observablehq.com/@sfu-iat355/introduction-to-leaflet-and-d3
    // map.on("zoomend", zoomupdate);

    var zoom = d3.behavior.zoom()
    .scaleExtent([3, 77])
    .on("zoom", zoomed);

    bigsvg.call(zoom)
    .call(zoom.event);

    function zoomed() {
        bigsvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        //nodegs.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }
  
    
    function update() {
        // console.log("zoome changed")
        // console.log(nodegs)
        
        nodegs.attr("transform",
            function (d) {
                // console.log(map.latLngToLayerPoint(d.LatLng).x)
                // console.log(map.latLngToLayerPoint(d.LatLng).y)
                return "translate(" +
                    map.latLngToLayerPoint(d.LatLng).x + "," +
                    map.latLngToLayerPoint(d.LatLng).y + ")";
            }
        )
    } //end function update

})

