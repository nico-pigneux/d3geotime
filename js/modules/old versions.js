function mergenvsars_bk(sarsdata) {
    // get nv data
    var data = getrealdata().objects;
    // console.log(data)
    var sumconfirmed = {}
    var time = []
    data.forEach(d => {
        // console.log(d)
        if (!time.includes(d.data[8])) {
            time.push(d.data[8])
        }
        var thetime = d.data[8]

        if (sumconfirmed[thetime] === undefined) { sumconfirmed[thetime] = 0 }
        sumconfirmed[thetime] = sumconfirmed[thetime] + d.data[2]
    })
    // console.log(sumconfirmed)

    // rearrange the data
    var nvdata = []
    var excludetime = [
        "2020-01-24 16:00:00",
        "2020-01-29 14:30:00",
        "2020-01-31 17:00:00"
    ]

    time.forEach(d => {
        var tmp = {}
        tmp.time = moment(d, "YYYY-MM-DD HH:mm:ss")
        tmp.timestr = formatDateYMD(tmp.time)
        tmp.count = sumconfirmed[d]
        tmp.group = 'nv'
        if (!excludetime.includes(d)) {
            nvdata.push(tmp)
        }
    })
    // console.log(sarsdata)
    // console.log(nvdata)
    // merge
    var alldata = []
    nvdata.forEach(d => {
        alldata.push(d)
    })
    Array.prototype.push.apply(alldata, sarsdata);

    //sort by time, then by count 
    alldata.sort(function (a, b) {
        return a["timestr"] - b["timestr"] || a["count"] - b["count"];
    }).reverse();

    // for each day point, keep a unique record (of the highest count)
    var timepoints = []
    var newdata1 = []
    alldata.forEach(d => {
        if (!timepoints.includes(d.timestr)) {
            timepoints.push(d.timestr)
            newdata1.push(d)
        }
    })

    var i = 1
    newdata1.reverse().forEach(d => {
        d.time = new Date(d.timestr + 'T00:00Z')
        // d.time2 =moment(d.timestr + " 00:00:00", "YYYY-MM-DD HH:mm:ss") // moment obj are not compatible with taucharts
        d.id = i
        i = i + 1
    })

    console.log(newdata1)

    // make the chart
    lchart(newdata1, 'linetotal', lchart1a)
}



function getRecent_bk(dataArray) {
    // from the data array, and for each place, get the latest data

    console.log(dataArray)

    // get distinct places (by province name), and use the place names as indices to 
    // get data of the most recent reporting time (in d.time)
    var places = [];
    var Recent1 = {};
    dataArray.forEach(d => {
        // console.log(d.data)
        var theplace = d.data[6]
        // for new places, add the data into the array Recent1
        if (!places.includes(theplace)) {
            places.push(theplace)
            Recent1[theplace] = d
            // for existing place, update the data into the data piece of the corresponding place, if the data time (d.time) is newer
        } else {
            if (d.time > Recent1[theplace].time) {
                Recent1[theplace] = d
            }
        }
    })
    // console.log(Recent1)

    // there could be that the same place appears for multiple time (e.g., in Australia, NSW and Sydney
    // were both reported, actually referring to the same place, with the same gps coordinates )
    // the following is to check and remove the duplicated data pieces of the same gps coordinate.
    // here the gps coordinates (arrays like [33.xxx, 156.xxxx]) are used as indices
    var gps = [];
    var Recent2 = {};
    places.forEach(d => {
        // console.log(d.data)
        var thegps = Recent1[d].LatLng;
        // for the new gps coordinates, push the data into Recent2
        if (!gps.includes(thegps)) {
            gps.push(thegps)
            Recent2[thegps] = Recent1[d]
            // for existing gps coordinates, update the corrsponding data piece if the d.time is newer
        } else {
            if (Recent1[d].time > Recent2[thegps].time) {
                Recent2[thegps] = Recent1[d]
            }
        }
    })
    // console.log(Recent2)

    // after the above step, places like NSW and Sydney are still in Recent2. 
    // None is deleted, but the data piece is the same
    // the following is to remove data if having repeated contents 
    var recent = []
    // console.log(Recent2)
    gps.forEach(d => {
        if (!recent.includes(Recent2[d])) {
            recent.push(Recent2[d])
        }
    })
    // console.log(recent)
    return recent
} // end getrecent()


