
// read data from a json file
//"data/novocorona.json"
d3.json("data/novocorona.json", function (collection) {

    //use the real data, instead of the novocorona.json (which is incomplete)
    collection=getrealdata();
    // console.log(collection)

    /* Add a LatLng object to each item in the dataset */
    collection.objects.forEach(function (d) {

        //obtain the gps coordinators (latitue, and longitude)
        d.LatLng = new L.LatLng(d.data[0],
            d.data[1])
        d.time =moment(d.data[2],"YYYY-MM-DD HH:mm:ss").unix() 
    })

    //bind data to g elements
    var nodegs = bigg.selectAll("g")
        .data(collection.objects)
        .enter().append("g")
    
    // bind grouped data of all cases of a location to circles
    var allcasesnodes= nodegs.append('circle')
        .attr("class", 'allcases')
        .attr("r", d=>{
           var r, allcases = d.data[2] + d.data[3];
           r = cat_r (allcases);
           return r; 
        })
        ;

    // bind grouped data of confirmed cases of a location to circles
    var confirmedcasesnodes= nodegs.append('circle')
        .attr("class", 'confirmed')
        .attr("r", d=>{
            var r = cat_r (d.data[2]);
            return r; 
        })
        ;

        function update() {
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
        map.on("zoomend", update);
        update();




})

