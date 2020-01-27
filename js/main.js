
// read data from a json file
//"data/novocorona.json"
d3.json("data/novocorona.json", function (collection) {

    collection=getrealdata();
    // console.log(collection)

    /* Add a LatLng object to each item in the dataset */
    collection.objects.forEach(function (d) {

        //obtain the gps coordinators (latitue, and longitude)
        d.LatLng = new L.LatLng(d.data[0],
            d.data[1])

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

    // on reset, update the map
    map.on("viewreset", update);
    update();

    function update() {
        nodegs.attr("transform",
            function (d) {
                return "translate(" +
                    map.latLngToLayerPoint(d.LatLng).x + "," +
                    map.latLngToLayerPoint(d.LatLng).y + ")";
            }
        )
    }
})

