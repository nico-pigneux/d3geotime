// read data from a json file
d3.json("data/notused.json", function (collection) {

    //use the real data, instead of the novocorona.json (which is incomplete)
    collection = getrealdata();
    // console.log(collection)

    // save it to a global variable dataset
    // why? the previous step actually does not use data loaded from notused.json
    // instead it used data read by getrealdata().
    // The above steps leave it flexible to read from a json, or from a loaded json file directly

    dataset = collection.objects;

    /* Add a LatLng object to each item in the dataset */
    var i = 0;
    dataset.forEach(function (d) {
        //obtain the gps coordinators (latitue, and longitude)
        d.LatLng = new L.LatLng(d.data[0],
            d.data[1])
        // d.time = moment(d.data[8], "YYYY-MM-DD HH:mm:ss").unix();
        d.time = moment(d.data[8], "YYYY-MM-DD HH:mm:ss");
        i = i + 1;
        d.id = i;
    })


})








