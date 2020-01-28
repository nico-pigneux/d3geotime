
//js/d3.slider.js uses d3v3, but the 
// to work around as the following are in d3v3 not d3v4
d3.rebind = function(target, source) {
    var i = 1, n = arguments.length, method;
    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
    return target;
  };
  
  // Method is assumed to be a standard D3 getter-setter:
  // If passed with no arguments, gets the value.
  // If passed with arguments, sets the value and returns the target.
  function d3_rebind(target, source, method) {
    return function() {
      var value = method.apply(source, arguments);
      return value === source ? target : value;
    };
  }


// read data from a json file
//"data/novocorona.json"
d3.json("data/novocorona.json", function (collection) {

    //use the real data, instead of the novocorona.json (which is incomplete)
    collection = getrealdata();
    // console.log(collection)

    /* Add a LatLng object to each item in the dataset */
    var i = 0;
    collection.objects.forEach(function (d) {
        //obtain the gps coordinators (latitue, and longitude)
        d.LatLng = new L.LatLng(d.data[0],
            d.data[1])
        // d.time = moment(d.data[8], "YYYY-MM-DD HH:mm:ss").unix();
            d.time = moment(d.data[8], "YYYY-MM-DD HH:mm:ss");
        i = i + 1;
        d.id = i;
    })

    var nodes;
    var nodegs;
    var displayNodes = function (dataArray) {


        //bind data to g elements
        // nodes = bigg.selectAll("g")
        //     .data(dataArray, d => {
        //         return d.id;
        //     });
        // nodegs = nodes
        //     .enter().append("g")
        //     ;

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

        // get the binded nodes
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


    // displayNodes(collection.objects.slice(2,10))
    //define the slider
    // pretty dumb to use unix time (since 1970.1.1 0:0:0), why!
    // var minDateUnix = moment('2020-01-20', "YYYY MM DD").unix();
    // var maxDateUnix = moment('2020-01-28', "YYYY MM DD").unix();
    var minDateUnix = moment('2020-01-20', "YYYY MM DD");
    var maxDateUnix = moment('2020-01-28', "YYYY MM DD");
    var interval = 60 * 24 / 12;

    var newData;
    //tick format
    //http://sujeetsr.github.io/d3.slider/
    // var formatter = d3.format(",.2f");
    //     var tickFormatter = function(d) {
    //     return formatter(d) + " GB";
    //     }
    // var slider = d3.slider().min(minDateUnix).max(maxDateUnix).ticks(5).showRange(true)
    //     .tickFormat(tickFormatter);

    var theslider = d3.slider()
        .axis(true)
        .min(minDateUnix).max(maxDateUnix).step(interval);

    d3.select('#slider3')
        .call(
            theslider.on("slide", function (evt, value) {
                newData = collection.objects.filter(function (d) {
                    // console.log(d.time)
                    return d.time <= value;
                })
                // console.log("New set size ", newData.length);
                // console.log(collection.objects.length)
                // console.log(newData)
                displayNodes(newData);

            })
        );

    // format ticks
    const monthNames=['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    theticktextEles=d3.selectAll('g.tick').select('text')
    // console.log(theticks);
    theticktextEles.text(d=>{
        console.log(d)
        var thetimevalue = new Date(d);
        console.log(thetimevalue)
        var monthStr= monthNames[thetimevalue.getMonth()];
        var datestr =thetimevalue.getFullYear().toString() 
            + '-'  +   monthStr + '-'
            + thetimevalue.getDate().toString();    
        console.log(datestr)

        return datestr
    })
    // text(d=>{
    //     // var thetimevalue = new Date(d);
    //     // // var formateddv = formatDate(thetimevalue)
    //     // console.log(thetimevalue)
    //     return d
    // })

})

