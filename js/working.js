function getRecent(dataArray) {
    // from the data array, and for each place, get the latest data

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
}

// determine the cat of confirmed cases
function cat_r(ncases, cutoff, rcatsv) {
    var r
    if (ncases === 0) { r = 0 }
    else if (ncases < cutoff[0]) {
        r = rcatsv[0]
    }
    else {
        var i = 1
        r = rcatsv[rcatsv.length - 1]
        cutoff.forEach(d => {
            if (ncases >= cutoff[i - 1] && ncases < cutoff[i]) {
                r = rcatsv[i]
            }
            i = i + 1
        })
    }
    // console.log(ncases)
    // console.log(r)
    return r;
}
