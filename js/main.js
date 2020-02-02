// read data from a json file
d3.text("data/nvdata.csv", function (text) {

    // the csv file doesnot have header, so import as text, and use csvParseRows to convert to an obj
    // https://stackoverflow.com/questions/13870265/read-csv-tsv-with-no-header-line-in-d3
    rawdata = d3.csvParseRows(text)
    // console.log(rawdata)

    // for some reason, when I started project, the columns were arranged in the following order.
    // now I have to follow such order...
    var collection={}
    collection['objects'] = [];
    rawdata.forEach(d => {
        var tmp = {};
        tmp['data'] = [parseFloat(d[7]), parseFloat(d[8]), parseInt(d[3]), parseInt(d[4]),
        parseInt(d[5]), parseInt(d[6]), d[0], d[1], d[2]];

        // do not push the empty/null rows
        if (d[7] !== undefined && d[8] !== undefined) {
            collection['objects'].push(tmp);
        }        
    })
    console.log(collection)

    // starting from this version, switch to loading .csv insead of runing the following getrealdata()
    //use the real data, instead of the novocorona.json (which is incomplete)
    // collection = getrealdata();
    // console.log(collection)

    // save it to a global variable dataset
    // why? the previous step actually does not use data loaded from notused.json
    // instead it used data read by getrealdata().
    // The above steps leave it flexible to read from a json, or from a loaded json file directly

    dataset = collection.objects;
    // console.log(dataset)

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

    // calculate the total confirmed and death cases

    var recentdata1 = getRecent(dataset);

    // get confirmed, and death cases by region and place (e.g., by country and province)
    var totalconfirmed = 0, totaldeath = 0;
    recentdata1.forEach(d => {

        totalconfirmed = totalconfirmed + d.data[2]
        // console.log(totalconfirmed)

        totaldeath = totaldeath + d.data[5]
    })

    //post the total numbers
    // console.log(totalconfirmed)
    d3.select('#totalconfirmed').text(totalconfirmed)
    d3.select('#totaldeath').text(totaldeath)

    //click the play button
    // console.log(playButton)
    // playButton.click()

    $('#play-button').click()
})








