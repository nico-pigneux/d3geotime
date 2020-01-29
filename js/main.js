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
        timer = setInterval(step, 100);
        button.text("Pause");
    }
    // console.log("Slider moving: " + moving);
})

// listen to the slide events
slider.call(
    d3.drag()
        .on("start.interrupt", function () { slider.interrupt(); })
        .on("start drag", function () {
            currentValue = d3.event.x;
            sliderupdate(x.invert(currentValue));
        })
);



