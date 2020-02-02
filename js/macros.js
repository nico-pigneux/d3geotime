function hbar(defData, chartboxid, chartbox) {

    // remove the previously built box (when playing, this prevents creating many many div boxes...)
    chartbox.select('div.tau-chart__layout').remove();

    //https://api.taucharts.com/basic/guide.html
    var chart = new Taucharts.Chart({

        type: 'horizontal-stacked-bar',
        y: 'place',
        x: 'count',
        color: 'datacat',
        label: 'count',
        // size: 'ABS(count)',
        plugins: [
            Taucharts.api.plugins.get('tooltip')(),
            // Taucharts.api.plugins.get('legend')(), // this disables categories (places) on y axis
        ],
        data: defData
        // .map(function (row) {
        //     row['ABS(count)'] = Math.abs(100);
        //     return row;
        // })
        //.reverse()
        ,
        settings: {
            // https://api.taucharts.com/basic/settings.html#animationspeed
            // yDensityPadding:100,
            // xDensityPadding:100,
            asyncRendering: true,
            animationSpeed: 0,
            fitModel: 'normal' //minimal / entire-view / fit-width / fit-height / normal
            // // fit-width (all as 100% in length) 
        },
        guilde: {
            showGridLines: 'x', // show vertical grid line
            x: {
                // nice: false,
                padding: 0,
                // label:{text:''} //https://api.taucharts.com/basic/guide.html
                // label:'placex' 
            },
            xDensityPadding: 1,
            yDensityPadding: 1,
            y: {
                // nice: false,
                padding: 0,
                // label:{text:''}
                // label:'placey'
            },

            // size: 100,
            // color: {
            //     // https://api.taucharts.com/advanced/encoding.html
            //     brewer: {
            //         'confirmed': '#00', // black
            //         'death': 'rgb(0, 0, 255)' //blue
            //     }
            // },
            // padding: {b:0, l:0, t:0, r:0}
        }
    });
    chart.renderTo('#' + chartboxid);
    // d3.selectAll('text.i-role-label').style('font-size', '20px')
    // .attr("text-anchor", "right")
    d3.selectAll('text.label.label.inline').text('')
    d3.selectAll('tspan.label-token.label-token-0').text('')
    d3.selectAll('rect.i-role-element.i-role-datum.bar.tau-chart__bar.color20-1').style('fill', 'red')
    d3.selectAll('rect.i-role-element.i-role-datum.bar.tau-chart__bar.color20-2')
        .styles({ 'fill': 'black', 'margin-left': '30px', 'padding-left': '30px' })
    d3.selectAll('text.i-role-label').styles({ 'fill': 'white', 'font-weight': 'bold' })
        .text(d => {
            if (d.datacat === "confirmed") {
                return d.count
            } else {
                return '//' + d.count
            }
        })




}// end hbar()

function getRecent(dataArray) {
    // from the data array, and for each place, get the latest data

    // console.log(dataArray)

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
    // var maxtime = Math.max.apply(Math, recent.map(function(o) { return o.time; }))
    // console.log(maxtime)
    
    return recent

} // end getrecent()


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


function cat_r2(ncases) {
    if (ncases > 200) { r = 30 }
    else if (ncases > 50) { r = 15 }
    else if (ncases > 10) { r = 10 }
    else if (ncases > 0) { r = 5 }
    else { r = 0 }
    // console.log(r)
    return r;
}

// prepare data
function getrealdata() {
    var rawdata = [
        ["Shanghai","Mainland China","2020-01-21 00:00:00","9","10","0","0","31.2304","121.4737"],
        ["Yunnan","Mainland China","2020-01-21 00:00:00","1","0","0","0","24.8801","102.8329"],
        ["Beijing","Mainland China","2020-01-21 00:00:00","10","0","0","0","39.9042","116.4074"],
        ["Taiwan","Taiwan","2020-01-21 00:00:00","1","0","0","0","25.033","121.5654"],
        ["Jilin","Mainland China","2020-01-21 00:00:00","0","1","0","0","43.8171","125.3235"],
        ["Sichuan","Mainland China","2020-01-21 00:00:00","2","1","0","0","30.5728","104.0668"],
        ["Tianjin","Mainland China","2020-01-21 00:00:00","2","0","0","0","39.3434","117.3616"],
        ["Ningxia","Mainland China","2020-01-21 00:00:00","0","1","0","0","38.4872","106.2309"],
        ["Anhui","Mainland China","2020-01-21 00:00:00","0","3","0","0","31.8206","117.2272"],
        ["Shandong","Mainland China","2020-01-21 00:00:00","1","0","0","0","36.6512","117.1201"],
        ["Guangdong","Mainland China","2020-01-21 00:00:00","17","4","0","0","23.1291","113.2644"],
        ["Guangxi","Mainland China","2020-01-21 00:00:00","0","1","0","0","22.817","108.3665"],
        ["Jiangxi","Mainland China","2020-01-21 00:00:00","2","0","0","0","28.6829","115.8582"],
        ["Henan","Mainland China","2020-01-21 00:00:00","1","0","0","0","34.7466","113.6253"],
        ["Zhejiang","Mainland China","2020-01-21 00:00:00","5","16","0","0","30.2741","120.1551"],
        ["Hainan","Mainland China","2020-01-21 00:00:00","0","1","0","0","20.0444","110.1983"],
        ["Hubei","Mainland China","2020-01-21 00:00:00","270","11","0","0","30.5928","114.3055"],
        ["Hunan","Mainland China","2020-01-21 00:00:00","1","0","0","0","28.2282","112.9388"],
        ["Guizhou","Mainland China","2020-01-21 00:00:00","0","1","0","0","26.6477","106.6302"],
        ["Liaoning","Mainland China","2020-01-21 00:00:00","0","1","0","0","41.8057","123.4315"],
        ["Chongqing","Mainland China","2020-01-21 00:00:00","5","0","0","0","29.4316","106.9123"],
        ["Hong Kong","Hong Kong","2020-01-21 00:00:00","0","117","0","0","22.3193","114.1694"],
        ["Heilongjiang","Mainland China","2020-01-21 00:00:00","0","1","0","0","45.8038","126.535"],
        ["Tokyo","Japan","2020-01-21 00:00:00","1","0","0","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-21 00:00:00","2","0","0","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-21 00:00:00","1","0","0","0","37.5665","126.978"],
        ["Washington","US","2020-01-21 00:00:00","1","0","0","0","47.7511","-120.74"],
        ["Anhui","Mainland China","2020-01-22 12:00:00","1","4","0","0","31.8206","117.2272"],
        ["Beijing","Mainland China","2020-01-22 12:00:00","14","0","0","0","39.9042","116.4074"],
        ["Chongqing","Mainland China","2020-01-22 12:00:00","6","0","0","0","29.4316","106.9123"],
        ["Fujian","Mainland China","2020-01-22 12:00:00","1","0","0","0","26.0745","119.2965"],
        ["Gansu","Mainland China","2020-01-22 12:00:00","0","0","0","0","36.0611","103.8343"],
        ["Guangdong","Mainland China","2020-01-22 12:00:00","26","1","0","0","23.1291","113.2644"],
        ["Guangxi","Mainland China","2020-01-22 12:00:00","2","1","0","0","22.817","108.3665"],
        ["Guizhou","Mainland China","2020-01-22 12:00:00","1","0","0","0","26.6477","106.6302"],
        ["Hainan","Mainland China","2020-01-22 12:00:00","4","0","0","0","20.0444","110.1983"],
        ["Hebei","Mainland China","2020-01-22 12:00:00","1","0","0","0","38.0428","114.5149"],
        ["Heilongjiang","Mainland China","2020-01-22 12:00:00","0","1","0","0","45.8038","126.535"],
        ["Henan","Mainland China","2020-01-22 12:00:00","5","0","0","0","34.7466","113.6253"],
        ["Hong Kong","Hong Kong","2020-01-22 12:00:00","0","117","0","0","22.3193","114.1694"],
        ["Hubei","Mainland China","2020-01-22 12:00:00","444","0","0","0","30.5928","114.3055"],
        ["Hunan","Mainland China","2020-01-22 12:00:00","4","0","0","0","28.2282","112.9388"],
        ["Inner Mongolia","Mainland China","2020-01-22 12:00:00","0","0","0","0","40.8424","111.75"],
        ["Jiangsu","Mainland China","2020-01-22 12:00:00","1","0","0","0","32.0603","118.7969"],
        ["Jiangxi","Mainland China","2020-01-22 12:00:00","2","0","0","0","28.6829","115.8582"],
        ["Jilin","Mainland China","2020-01-22 12:00:00","0","1","0","0","43.8171","125.3235"],
        ["Liaoning","Mainland China","2020-01-22 12:00:00","2","0","0","0","41.8057","123.4315"],
        ["Macau","Macau","2020-01-22 12:00:00","1","0","0","0","22.1987","113.5439"],
        ["Ningxia","Mainland China","2020-01-22 12:00:00","1","0","0","0","38.4872","106.2309"],
        ["Qinghai","Mainland China","2020-01-22 12:00:00","0","0","0","0","36.6171","101.7782"],
        ["Shaanxi","Mainland China","2020-01-22 12:00:00","0","0","0","0","34.3416","108.9398"],
        ["Shandong","Mainland China","2020-01-22 12:00:00","2","0","0","0","36.6512","117.1201"],
        ["Shanghai","Mainland China","2020-01-22 12:00:00","9","10","0","0","31.2304","121.4737"],
        ["Shanxi","Mainland China","2020-01-22 12:00:00","1","0","0","0","37.8706","112.5489"],
        ["Sichuan","Mainland China","2020-01-22 12:00:00","5","2","0","0","30.5728","104.0668"],
        ["Taiwan","Taiwan","2020-01-22 12:00:00","1","0","0","0","25.033","121.5654"],
        ["Tianjin","Mainland China","2020-01-22 12:00:00","4","0","0","0","39.3434","117.3616"],
        ["Tibet","Mainland China","2020-01-22 12:00:00","0","0","0","0","29.6548","91.1406"],
        ["Washington","US","2020-01-22 12:00:00","1","0","0","0","47.7511","-120.74"],
        ["Xinjiang","Mainland China","2020-01-22 12:00:00","0","0","0","0","43.8256","87.6168"],
        ["Yunnan","Mainland China","2020-01-22 12:00:00","1","0","0","0","24.8801","102.8329"],
        ["Zhejiang","Mainland China","2020-01-22 12:00:00","10","0","0","0","30.2741","120.1551"],
        ["Tokyo","Japan","2020-01-22 12:00:00","2","0","0","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-22 12:00:00","2","0","0","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-22 12:00:00","1","0","0","0","37.5665","126.978"],
        ["Anhui","Mainland China","2020-01-23 12:00:00","9","4","0","0","31.8206","117.2272"],
        ["Beijing","Mainland China","2020-01-23 12:00:00","22","0","0","0","39.9042","116.4074"],
        ["Chongqing","Mainland China","2020-01-23 12:00:00","9","0","0","0","29.4316","106.9123"],
        ["Fujian","Mainland China","2020-01-23 12:00:00","5","2","0","0","26.0745","119.2965"],
        ["Gansu","Mainland China","2020-01-23 12:00:00","2","0","0","0","36.0611","103.8343"],
        ["Guangdong","Mainland China","2020-01-23 12:00:00","32","1","2","0","23.1291","113.2644"],
        ["Guangxi","Mainland China","2020-01-23 12:00:00","5","0","0","0","22.817","108.3665"],
        ["Guizhou","Mainland China","2020-01-23 12:00:00","3","0","0","0","26.6477","106.6302"],
        ["Hainan","Mainland China","2020-01-23 12:00:00","5","32","0","0","20.0444","110.1983"],
        ["Hebei","Mainland China","2020-01-23 12:00:00","1","0","0","1","38.0428","114.5149"],
        ["Heilongjiang","Mainland China","2020-01-23 12:00:00","2","0","0","0","45.8038","126.535"],
        ["Henan","Mainland China","2020-01-23 12:00:00","5","0","0","0","34.7466","113.6253"],
        ["Hong Kong","Hong Kong","2020-01-23 12:00:00","2","65","0","0","22.3193","114.1694"],
        ["Hubei","Mainland China","2020-01-23 12:00:00","444","0","28","17","30.5928","114.3055"],
        ["Hunan","Mainland China","2020-01-23 12:00:00","9","0","0","0","28.2282","112.9388"],
        ["Inner Mongolia","Mainland China","2020-01-23 12:00:00","0","1","0","0","40.8424","111.75"],
        ["Jiangsu","Mainland China","2020-01-23 12:00:00","5","0","0","0","32.0603","118.7969"],
        ["Jiangxi","Mainland China","2020-01-23 12:00:00","7","0","0","0","28.6829","115.8582"],
        ["Jilin","Mainland China","2020-01-23 12:00:00","1","0","0","0","43.8171","125.3235"],
        ["Liaoning","Mainland China","2020-01-23 12:00:00","3","0","0","0","41.8057","123.4315"],
        ["Macau","Macau","2020-01-23 12:00:00","2","0","0","0","22.1987","113.5439"],
        ["Ningxia","Mainland China","2020-01-23 12:00:00","1","0","0","0","38.4872","106.2309"],
        ["Qinghai","Mainland China","2020-01-23 12:00:00","0","0","0","0","36.6171","101.7782"],
        ["Shaanxi","Mainland China","2020-01-23 12:00:00","3","1","0","0","34.3416","108.9398"],
        ["Shandong","Mainland China","2020-01-23 12:00:00","6","2","0","0","36.6512","117.1201"],
        ["Shanghai","Mainland China","2020-01-23 12:00:00","16","22","0","0","31.2304","121.4737"],
        ["Shanxi","Mainland China","2020-01-23 12:00:00","1","0","0","0","37.8706","112.5489"],
        ["Sichuan","Mainland China","2020-01-23 12:00:00","8","2","0","0","30.5728","104.0668"],
        ["Taiwan","Taiwan","2020-01-23 12:00:00","1","0","0","0","25.033","121.5654"],
        ["Tianjin","Mainland China","2020-01-23 12:00:00","4","0","0","0","39.3434","117.3616"],
        ["Tibet","Mainland China","2020-01-23 12:00:00","0","0","0","0","29.6548","91.1406"],
        ["Washington","US","2020-01-23 12:00:00","1","0","0","0","47.7511","-120.74"],
        ["Xinjiang","Mainland China","2020-01-23 12:00:00","2","0","0","0","43.8256","87.6168"],
        ["Yunnan","Mainland China","2020-01-23 12:00:00","2","0","0","0","24.8801","102.8329"],
        ["Zhejiang","Mainland China","2020-01-23 12:00:00","27","0","0","0","30.2741","120.1551"],
        ["Tokyo","Japan","2020-01-23 12:00:00","1","0","0","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-23 12:00:00","3","0","0","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-23 12:00:00","1","0","0","0","37.5665","126.978"],
        ["Singapore","Singapore","2020-01-23 12:00:00","1","0","0","0","1.3521","103.8198"],
        ["Manila","Philippines","2020-01-23 12:00:00","0","4","0","0","14.5995","120.9842"],
        ["Kuala Lumpur","Malaysia","2020-01-23 12:00:00","0","4","0","0","3.139","101.6869"],
        ["Hanoi","Vietnam","2020-01-23 12:00:00","2","0","0","0","21.0278","105.8342"],
        ["Melbourne","Australia","2020-01-23 12:00:00","0","1","0","0","-37.8136","144.9631"],
        ["Mexico City","Mexico","2020-01-23 12:00:00","0","1","0","0","19.4326","-99.1332"],
        ["Brasilia","Brazil","2020-01-23 12:00:00","0","1","0","0","-15.8267","-47.9218"],
        ["Bogota","Colombia","2020-01-23 12:00:00","0","1","0","0","4.711","-74.0721"],
        ["Hubei","Mainland China","2020-01-24 00:00:00","549","0","31","24","30.5928","114.3055"],
        ["Guangdong","Mainland China","2020-01-24 00:00:00","53","0","2","0","23.1291","113.2644"],
        ["Zhejiang","Mainland China","2020-01-24 00:00:00","43","0","1","0","30.2741","120.1551"],
        ["Beijing","Mainland China","2020-01-24 00:00:00","26","22","0","0","39.9042","116.4074"],
        ["Shanghai","Mainland China","2020-01-24 00:00:00","20","0","0","0","31.2304","121.4737"],
        ["Hunan","Mainland China","2020-01-24 00:00:00","24","0","0","0","28.2282","112.9388"],
        ["Anhui","Mainland China","2020-01-24 00:00:00","15","4","0","0","31.8206","117.2272"],
        ["Chongqing","Mainland China","2020-01-24 00:00:00","27","13","0","0","29.4316","106.9123"],
        ["Sichuan","Mainland China","2020-01-24 00:00:00","15","4","0","0","30.5728","104.0668"],
        ["Shandong","Mainland China","2020-01-24 00:00:00","9","0","0","0","36.6512","117.1201"],
        ["Guangxi","Mainland China","2020-01-24 00:00:00","13","0","0","0","22.817","108.3665"],
        ["Fujian","Mainland China","2020-01-24 00:00:00","5","2","0","0","26.0745","119.2965"],
        ["Jiangsu","Mainland China","2020-01-24 00:00:00","9","0","0","0","32.0603","118.7969"],
        ["Henan","Mainland China","2020-01-24 00:00:00","9","0","0","0","34.7466","113.6253"],
        ["Hainan","Mainland China","2020-01-24 00:00:00","8","32","0","0","20.0444","110.1983"],
        ["Tianjin","Mainland China","2020-01-24 00:00:00","5","0","0","0","39.3434","117.3616"],
        ["Jiangxi","Mainland China","2020-01-24 00:00:00","7","0","0","0","28.6829","115.8582"],
        ["Shaanxi","Mainland China","2020-01-24 00:00:00","3","0","0","0","34.3416","108.9398"],
        ["Guizhou","Mainland China","2020-01-24 00:00:00","3","0","0","0","26.6477","106.6302"],
        ["Liaoning","Mainland China","2020-01-24 00:00:00","4","0","0","0","41.8057","123.4315"],
        ["Hong Kong","Hong Kong","2020-01-24 00:00:00","2","36","0","0","22.3193","114.1694"],
        ["Heilongjiang","Mainland China","2020-01-24 00:00:00","4","0","0","1","45.8038","126.535"],
        ["Macau","Macau","2020-01-24 00:00:00","2","0","0","0","22.1987","113.5439"],
        ["Xinjiang","Mainland China","2020-01-24 00:00:00","2","0","0","0","43.8256","87.6168"],
        ["Gansu","Mainland China","2020-01-24 00:00:00","2","0","0","0","36.0611","103.8343"],
        ["Yunnan","Mainland China","2020-01-24 00:00:00","2","0","0","0","24.8801","102.8329"],
        ["Taiwan","Taiwan","2020-01-24 00:00:00","1","0","0","0","25.033","121.5654"],
        ["Shanxi","Mainland China","2020-01-24 00:00:00","1","0","0","0","37.8706","112.5489"],
        ["Jilin","Mainland China","2020-01-24 00:00:00","3","0","0","0","43.8171","125.3235"],
        ["Hebei","Mainland China","2020-01-24 00:00:00","2","0","0","1","38.0428","114.5149"],
        ["Ningxia","Mainland China","2020-01-24 00:00:00","1","0","0","0","38.4872","106.2309"],
        ["Inner Mongolia","Mainland China","2020-01-24 00:00:00","1","2","0","0","40.8424","111.75"],
        ["Washington","US","2020-01-24 00:00:00","1","0","0","0","47.7511","-120.74"],
        ["Tokyo","Japan","2020-01-24 00:00:00","2","0","0","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-24 00:00:00","4","0","0","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-24 00:00:00","1","0","0","0","37.5665","126.978"],
        ["Singapore","Singapore","2020-01-24 00:00:00","1","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-24 00:00:00","2","0","0","0","21.0278","105.8342"],
        ["Hubei","Mainland China","2020-01-24 12:00:00","549","0","31","24","30.5928","114.3055"],
        ["Guangdong","Mainland China","2020-01-24 12:00:00","53","0","2","0","23.1291","113.2644"],
        ["Zhejiang","Mainland China","2020-01-24 12:00:00","43","0","1","0","30.2741","120.1551"],
        ["Beijing","Mainland China","2020-01-24 12:00:00","36","0","1","0","39.9042","116.4074"],
        ["Chongqing","Mainland China","2020-01-24 12:00:00","27","13","0","0","29.4316","106.9123"],
        ["Hunan","Mainland China","2020-01-24 12:00:00","24","0","0","0","28.2282","112.9388"],
        ["Guangxi","Mainland China","2020-01-24 12:00:00","23","0","0","0","22.817","108.3665"],
        ["Shanghai","Mainland China","2020-01-24 12:00:00","20","22","1","0","31.2304","121.4737"],
        ["Jiangxi","Mainland China","2020-01-24 12:00:00","18","0","0","0","28.6829","115.8582"],
        ["Sichuan","Mainland China","2020-01-24 12:00:00","15","4","0","0","30.5728","104.0668"],
        ["Shandong","Mainland China","2020-01-24 12:00:00","15","0","0","0","36.6512","117.1201"],
        ["Anhui","Mainland China","2020-01-24 12:00:00","15","4","0","0","31.8206","117.2272"],
        ["Fujian","Mainland China","2020-01-24 12:00:00","10","2","0","0","26.0745","119.2965"],
        ["Henan","Mainland China","2020-01-24 12:00:00","9","42","0","0","34.7466","113.6253"],
        ["Jiangsu","Mainland China","2020-01-24 12:00:00","9","0","0","0","32.0603","118.7969"],
        ["Hainan","Mainland China","2020-01-24 12:00:00","8","32","0","0","20.0444","110.1983"],
        ["Tianjin","Mainland China","2020-01-24 12:00:00","8","0","0","0","39.3434","117.3616"],
        ["Yunnan","Mainland China","2020-01-24 12:00:00","5","0","0","0","24.8801","102.8329"],
        ["Shaanxi","Mainland China","2020-01-24 12:00:00","5","0","0","0","34.3416","108.9398"],
        ["Heilongjiang","Mainland China","2020-01-24 12:00:00","4","0","0","1","45.8038","126.535"],
        ["Liaoning","Mainland China","2020-01-24 12:00:00","4","0","0","0","41.8057","123.4315"],
        ["Guizhou","Mainland China","2020-01-24 12:00:00","3","0","0","0","26.6477","106.6302"],
        ["Jilin","Mainland China","2020-01-24 12:00:00","3","0","0","0","43.8171","125.3235"],
        ["Taiwan","Taiwan","2020-01-24 12:00:00","3","0","0","0","25.033","121.5654"],
        ["Ningxia","Mainland China","2020-01-24 12:00:00","2","1","0","0","38.4872","106.2309"],
        ["Hong Kong","Hong Kong","2020-01-24 12:00:00","2","36","0","0","22.3193","114.1694"],
        ["Macau","Macau","2020-01-24 12:00:00","2","0","0","0","22.1987","113.5439"],
        ["Hebei","Mainland China","2020-01-24 12:00:00","2","0","0","1","38.0428","114.5149"],
        ["Gansu","Mainland China","2020-01-24 12:00:00","2","0","0","0","36.0611","103.8343"],
        ["Xinjiang","Mainland China","2020-01-24 12:00:00","2","0","0","0","43.8256","87.6168"],
        ["Shanxi","Mainland China","2020-01-24 12:00:00","1","0","0","0","37.8706","112.5489"],
        ["Inner Mongolia","Mainland China","2020-01-24 12:00:00","1","2","0","0","40.8424","111.75"],
        ["Qinghai","Mainland China","2020-01-24 12:00:00","0","1","0","0","36.6171","101.7782"],
        ["Washington","US","2020-01-24 12:00:00","1","0","0","0","47.7511","-120.74"],
        ["Illinois","US","2020-01-24 12:00:00","1","0","0","0","40.6331","-89.3985"],
        ["Tokyo","Japan","2020-01-24 12:00:00","2","0","0","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-24 12:00:00","5","0","0","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-24 12:00:00","2","0","0","0","37.5665","126.978"],
        ["Singapore","Singapore","2020-01-24 12:00:00","3","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-24 12:00:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-24 16:00:00","2","0","0","0","48.8566","2.3522"],
        ["Hubei","Mainland China","2020-01-25 00:00:00","729","0","32","39","30.5928","114.3055"],
        ["Guangdong","Mainland China","2020-01-25 00:00:00","78","0","2","0","23.1291","113.2644"],
        ["Zhejiang","Mainland China","2020-01-25 00:00:00","62","0","1","0","30.2741","120.1551"],
        ["Chongqing","Mainland China","2020-01-25 00:00:00","57","0","0","0","29.4316","106.9123"],
        ["Hunan","Mainland China","2020-01-25 00:00:00","43","0","0","0","28.2282","112.9388"],
        ["Anhui","Mainland China","2020-01-25 00:00:00","39","4","0","0","31.8206","117.2272"],
        ["Beijing","Mainland China","2020-01-25 00:00:00","36","0","1","0","39.9042","116.4074"],
        ["Shanghai","Mainland China","2020-01-25 00:00:00","33","22","1","0","31.2304","121.4737"],
        ["Henan","Mainland China","2020-01-25 00:00:00","32","1","0","0","34.7466","113.6253"],
        ["Sichuan","Mainland China","2020-01-25 00:00:00","28","4","0","0","30.5728","104.0668"],
        ["Guangxi","Mainland China","2020-01-25 00:00:00","23","0","0","0","22.817","108.3665"],
        ["Shandong","Mainland China","2020-01-25 00:00:00","21","0","0","0","36.6512","117.1201"],
        ["Jiangxi","Mainland China","2020-01-25 00:00:00","18","0","0","0","28.6829","115.8582"],
        ["Jiangsu","Mainland China","2020-01-25 00:00:00","18","0","1","0","32.0603","118.7969"],
        ["Hainan","Mainland China","2020-01-25 00:00:00","17","0","0","0","20.0444","110.1983"],
        ["Liaoning","Mainland China","2020-01-25 00:00:00","15","0","0","0","41.8057","123.4315"],
        ["Fujian","Mainland China","2020-01-25 00:00:00","10","4","0","0","26.0745","119.2965"],
        ["Heilongjiang","Mainland China","2020-01-25 00:00:00","9","0","0","1","45.8038","126.535"],
        ["Tianjin","Mainland China","2020-01-25 00:00:00","8","0","0","0","39.3434","117.3616"],
        ["Hebei","Mainland China","2020-01-25 00:00:00","8","0","0","1","38.0428","114.5149"],
        ["Shanxi","Mainland China","2020-01-25 00:00:00","6","0","0","0","37.8706","112.5489"],
        ["Yunnan","Mainland China","2020-01-25 00:00:00","5","0","0","0","24.8801","102.8329"],
        ["Hong Kong","Hong Kong","2020-01-25 00:00:00","5","36","0","0","22.3193","114.1694"],
        ["Shaanxi","Mainland China","2020-01-25 00:00:00","5","0","0","0","34.3416","108.9398"],
        ["Guizhou","Mainland China","2020-01-25 00:00:00","4","0","0","0","26.6477","106.6302"],
        ["Jilin","Mainland China","2020-01-25 00:00:00","4","0","0","0","43.8171","125.3235"],
        ["Gansu","Mainland China","2020-01-25 00:00:00","4","0","0","0","36.0611","103.8343"],
        ["Ningxia","Mainland China","2020-01-25 00:00:00","3","1","0","0","38.4872","106.2309"],
        ["Taiwan","Taiwan","2020-01-25 00:00:00","3","0","0","0","25.033","121.5654"],
        ["Xinjiang","Mainland China","2020-01-25 00:00:00","3","0","0","0","43.8256","87.6168"],
        ["Macau","Macau","2020-01-25 00:00:00","2","0","0","0","22.1987","113.5439"],
        ["Inner Mongolia","Mainland China","2020-01-25 00:00:00","2","0","0","0","40.8424","111.75"],
        ["Qinghai","Mainland China","2020-01-25 00:00:00","0","1","0","0","36.6171","101.7782"],
        ["Washington","US","2020-01-25 00:00:00","1","0","0","0","47.7511","-120.74"],
        ["Illinois","US","2020-01-25 00:00:00","1","0","0","0","40.6331","-89.3985"],
        ["Tokyo","Japan","2020-01-25 00:00:00","2","0","0","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-25 00:00:00","5","0","0","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-25 00:00:00","2","0","0","0","37.5665","126.978"],
        ["Singapore","Singapore","2020-01-25 00:00:00","3","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-25 00:00:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-25 00:00:00","3","0","0","0","48.8566","2.3522"],
        ["Melbourne","Australia","2020-01-25 00:00:00","1","0","0","0","-37.8136","144.9631"],
        ["Kathmandu","Nepal","2020-01-25 00:00:00","1","0","0","0","27.7172","85.324"],
        ["Kuala Lumpur","Malaysia","2020-01-25 00:00:00","3","0","0","0","3.139","101.6869"],
        ["Hubei","Mainland China","2020-01-25 12:00:00","761","0","32","40","30.5928","114.3055"],
        ["Guangdong","Mainland China","2020-01-25 12:00:00","78","0","2","0","23.1291","113.2644"],
        ["Zhejiang","Mainland China","2020-01-25 12:00:00","62","0","1","0","30.2741","120.1551"],
        ["Chongqing","Mainland China","2020-01-25 12:00:00","57","0","0","0","29.4316","106.9123"],
        ["Hunan","Mainland China","2020-01-25 12:00:00","43","0","0","0","28.2282","112.9388"],
        ["Beijing","Mainland China","2020-01-25 12:00:00","41","0","2","0","39.9042","116.4074"],
        ["Anhui","Mainland China","2020-01-25 12:00:00","39","4","0","0","31.8206","117.2272"],
        ["Shanghai","Mainland China","2020-01-25 12:00:00","33","72","1","0","31.2304","121.4737"],
        ["Henan","Mainland China","2020-01-25 12:00:00","32","1","0","0","34.7466","113.6253"],
        ["Sichuan","Mainland China","2020-01-25 12:00:00","28","4","0","0","30.5728","104.0668"],
        ["Shandong","Mainland China","2020-01-25 12:00:00","27","0","0","0","36.6512","117.1201"],
        ["Guangxi","Mainland China","2020-01-25 12:00:00","23","0","0","0","22.817","108.3665"],
        ["Hainan","Mainland China","2020-01-25 12:00:00","19","0","0","0","20.0444","110.1983"],
        ["Jiangxi","Mainland China","2020-01-25 12:00:00","18","0","0","0","28.6829","115.8582"],
        ["Fujian","Mainland China","2020-01-25 12:00:00","18","20","0","0","26.0745","119.2965"],
        ["Jiangsu","Mainland China","2020-01-25 12:00:00","18","0","1","0","32.0603","118.7969"],
        ["Liaoning","Mainland China","2020-01-25 12:00:00","17","0","0","0","41.8057","123.4315"],
        ["Shaanxi","Mainland China","2020-01-25 12:00:00","15","0","0","0","34.3416","108.9398"],
        ["Yunnan","Mainland China","2020-01-25 12:00:00","11","58","0","0","24.8801","102.8329"],
        ["Tianjin","Mainland China","2020-01-25 12:00:00","10","0","0","0","39.3434","117.3616"],
        ["Heilongjiang","Mainland China","2020-01-25 12:00:00","9","0","0","1","45.8038","126.535"],
        ["Hebei","Mainland China","2020-01-25 12:00:00","8","0","0","1","38.0428","114.5149"],
        ["Inner Mongolia","Mainland China","2020-01-25 12:00:00","7","0","0","0","40.8424","111.75"],
        ["Shanxi","Mainland China","2020-01-25 12:00:00","6","0","0","0","37.8706","112.5489"],
        ["Hong Kong","Hong Kong","2020-01-25 12:00:00","5","244","0","0","22.3193","114.1694"],
        ["Guizhou","Mainland China","2020-01-25 12:00:00","4","0","0","0","26.6477","106.6302"],
        ["Jilin","Mainland China","2020-01-25 12:00:00","4","0","0","0","43.8171","125.3235"],
        ["Gansu","Mainland China","2020-01-25 12:00:00","4","0","0","0","36.0611","103.8343"],
        ["Ningxia","Mainland China","2020-01-25 12:00:00","3","1","0","0","38.4872","106.2309"],
        ["Taiwan","Taiwan","2020-01-25 12:00:00","3","0","0","0","25.033","121.5654"],
        ["Xinjiang","Mainland China","2020-01-25 12:00:00","3","0","0","0","43.8256","87.6168"],
        ["Macau","Macau","2020-01-25 12:00:00","2","0","0","0","22.1987","113.5439"],
        ["Qinghai","Mainland China","2020-01-25 12:00:00","1","0","0","0","36.6171","101.7782"],
        ["Washington","US","2020-01-25 12:00:00","1","0","0","0","47.7511","-120.74"],
        ["Illinois","US","2020-01-25 12:00:00","1","0","0","0","40.6331","-89.3985"],
        ["Tokyo","Japan","2020-01-25 12:00:00","2","0","0","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-25 12:00:00","7","0","0","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-25 12:00:00","2","0","0","0","37.5665","126.978"],
        ["Singapore","Singapore","2020-01-25 12:00:00","3","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-25 12:00:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-25 12:00:00","3","0","0","0","48.8566","2.3522"],
        ["Melbourne","Australia","2020-01-25 12:00:00","4","0","0","0","-37.8136","144.9631"],
        ["Kathmandu","Nepal","2020-01-25 12:00:00","1","0","0","0","27.7172","85.324"],
        ["Kuala Lumpur","Malaysia","2020-01-25 12:00:00","3","0","0","0","3.139","101.6869"],
        ["Hubei","Mainland China","2020-01-25 22:00:00","1052","0","42","52","30.5928","114.3055"],
        ["Zhejiang","Mainland China","2020-01-25 22:00:00","104","0","1","0","30.2741","120.1551"],
        ["Guangdong","Mainland China","2020-01-25 12:00:00","98","0","2","0","23.1291","113.2644"],
        ["Henan","Mainland China","2020-01-25 12:00:00","83","3","0","1","34.7466","113.6253"],
        ["Chongqing","Mainland China","2020-01-25 12:00:00","75","0","0","0","29.4316","106.9123"],
        ["Hunan","Mainland China","2020-01-25 12:00:00","69","0","0","0","28.2282","112.9388"],
        ["Anhui","Mainland China","2020-01-25 12:00:00","60","4","0","0","31.8206","117.2272"],
        ["Beijing","Mainland China","2020-01-25 12:00:00","51","0","2","0","39.9042","116.4074"],
        ["Sichuan","Mainland China","2020-01-25 12:00:00","44","4","0","0","30.5728","104.0668"],
        ["Shanghai","Mainland China","2020-01-25 12:00:00","40","72","1","1","31.2304","121.4737"],
        ["Shandong","Mainland China","2020-01-25 12:00:00","39","0","0","0","36.6512","117.1201"],
        ["Jiangxi","Mainland China","2020-01-25 12:00:00","36","0","0","0","28.6829","115.8582"],
        ["Guangxi","Mainland China","2020-01-25 12:00:00","33","0","0","0","22.817","108.3665"],
        ["Jiangsu","Mainland China","2020-01-25 12:00:00","31","0","1","0","32.0603","118.7969"],
        ["Hainan","Mainland China","2020-01-25 12:00:00","19","0","0","0","20.0444","110.1983"],
        ["Liaoning","Mainland China","2020-01-25 12:00:00","19","0","0","0","41.8057","123.4315"],
        ["Fujian","Mainland China","2020-01-25 12:00:00","18","20","0","1","26.0745","119.2965"],
        ["Heilongjiang","Mainland China","2020-01-25 12:00:00","15","0","0","0","45.8038","126.535"],
        ["Shaanxi","Mainland China","2020-01-25 12:00:00","15","0","0","0","34.3416","108.9398"],
        ["Tianjin","Mainland China","2020-01-25 12:00:00","13","0","0","0","39.3434","117.3616"],
        ["Hebei","Mainland China","2020-01-25 12:00:00","13","0","0","1","38.0428","114.5149"],
        ["Yunnan","Mainland China","2020-01-25 12:00:00","11","58","0","0","24.8801","102.8329"],
        ["Shanxi","Mainland China","2020-01-25 12:00:00","9","0","0","0","37.8706","112.5489"],
        ["Inner Mongolia","Mainland China","2020-01-25 12:00:00","7","0","0","0","40.8424","111.75"],
        ["Gansu","Mainland China","2020-01-25 12:00:00","7","0","0","0","36.0611","103.8343"],
        ["Guizhou","Mainland China","2020-01-25 12:00:00","5","0","0","0","26.6477","106.6302"],
        ["Hong Kong","Hong Kong","2020-01-25 12:00:00","5","244","0","0","22.3193","114.1694"],
        ["Ningxia","Mainland China","2020-01-25 12:00:00","4","1","0","0","38.4872","106.2309"],
        ["Jilin","Mainland China","2020-01-25 12:00:00","4","0","0","0","43.8171","125.3235"],
        ["Xinjiang","Mainland China","2020-01-25 12:00:00","4","0","0","0","43.8256","87.6168"],
        ["Taiwan","Taiwan","2020-01-25 12:00:00","3","0","0","0","25.033","121.5654"],
        ["Macau","Macau","2020-01-25 12:00:00","2","0","0","0","22.1987","113.5439"],
        ["Qinghai","Mainland China","2020-01-25 12:00:00","1","0","0","0","36.6171","101.7782"],
        ["Washington","US","2020-01-25 12:00:00","1","0","0","0","47.7511","-120.74"],
        ["Illinois","US","2020-01-25 12:00:00","1","0","0","0","40.6331","-89.3985"],
        ["Tokyo","Japan","2020-01-25 12:00:00","2","0","0","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-25 12:00:00","7","0","0","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-25 12:00:00","3","0","0","0","37.5665","126.978"],
        ["Singapore","Singapore","2020-01-25 12:00:00","3","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-25 12:00:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-25 12:00:00","3","0","0","0","48.8566","2.3522"],
        ["Melbourne","Australia","2020-01-25 12:00:00","4","0","0","0","-37.8136","144.9631"],
        ["Kathmandu","Nepal","2020-01-25 12:00:00","1","0","0","0","27.7172","85.324"],
        ["Kuala Lumpur","Malaysia","2020-01-25 12:00:00","3","0","0","0","3.139","101.6869"],
        ["Hubei","Mainland China","2020-01-26 11:00:00","1058","0","42","52","30.5928","114.3055"],
        ["Guangdong","Mainland China","2020-01-26 11:00:00","111","0","2","0","23.1291","113.2644"],
        ["Zhejiang","Mainland China","2020-01-26 11:00:00","104","0","1","0","30.2741","120.1551"],
        ["Henan","Mainland China","2020-01-26 11:00:00","83","3","0","1","34.7466","113.6253"],
        ["Chongqing","Mainland China","2020-01-26 11:00:00","75","0","0","0","29.4316","106.9123"],
        ["Hunan","Mainland China","2020-01-26 11:00:00","69","0","0","0","28.2282","112.9388"],
        ["Beijing","Mainland China","2020-01-26 11:00:00","68","0","2","0","39.9042","116.4074"],
        ["Anhui","Mainland China","2020-01-26 11:00:00","60","4","0","0","31.8206","117.2272"],
        ["Shandong","Mainland China","2020-01-26 11:00:00","46","0","0","0","36.6512","117.1201"],
        ["Sichuan","Mainland China","2020-01-26 11:00:00","44","4","0","0","30.5728","104.0668"],
        ["Shanghai","Mainland China","2020-01-26 11:00:00","40","72","1","1","31.2304","121.4737"],
        ["Guangxi","Mainland China","2020-01-26 11:00:00","36","0","0","0","22.817","108.3665"],
        ["Jiangxi","Mainland China","2020-01-26 11:00:00","36","0","0","0","28.6829","115.8582"],
        ["Fujian","Mainland China","2020-01-26 11:00:00","35","20","0","0","26.0745","119.2965"],
        ["Jiangsu","Mainland China","2020-01-26 11:00:00","33","0","1","0","32.0603","118.7969"],
        ["Hainan","Mainland China","2020-01-26 11:00:00","22","0","0","0","20.0444","110.1983"],
        ["Shaanxi","Mainland China","2020-01-26 11:00:00","22","0","0","0","34.3416","108.9398"],
        ["Liaoning","Mainland China","2020-01-26 11:00:00","21","0","0","0","41.8057","123.4315"],
        ["Yunnan","Mainland China","2020-01-26 11:00:00","16","36","0","0","24.8801","102.8329"],
        ["Heilongjiang","Mainland China","2020-01-26 11:00:00","15","0","0","1","45.8038","126.535"],
        ["Tianjin","Mainland China","2020-01-26 11:00:00","14","0","0","0","39.3434","117.3616"],
        ["Hebei","Mainland China","2020-01-26 11:00:00","13","0","0","1","38.0428","114.5149"],
        ["Shanxi","Mainland China","2020-01-26 11:00:00","9","0","0","0","37.8706","112.5489"],
        ["Hong Kong","Hong Kong","2020-01-26 11:00:00","8","244","0","0","22.3193","114.1694"],
        ["Inner Mongolia","Mainland China","2020-01-26 11:00:00","7","0","0","0","40.8424","111.7500"],
        ["Gansu","Mainland China","2020-01-26 11:00:00","7","0","0","0","36.0611","103.8343"],
        ["Guizhou","Mainland China","2020-01-26 11:00:00","5","0","0","0","26.6477","106.6302"],
        ["Macau","Macau","2020-01-26 11:00:00","5","0","0","0","22.1987","113.5439"],
        ["Ningxia","Mainland China","2020-01-26 11:00:00","4","0","0","0","38.4872","106.2309"],
        ["Jilin","Mainland China","2020-01-26 11:00:00","4","0","0","0","43.8171","125.3235"],
        ["Taiwan","Taiwan","2020-01-26 11:00:00","4","0","0","0","25.0330","121.5654"],
        ["Xinjiang","Mainland China","2020-01-26 11:00:00","4","0","0","0","43.8256","87.6168"],
        ["Qinghai","Mainland China","2020-01-26 11:00:00","1","0","0","0","36.6171","101.7782"],
        ["Washington","US","2020-01-26 11:00:00","1","0","0","0","47.7511","-120.7400"],
        ["Illinois","US","2020-01-26 11:00:00","1","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-01-26 11:00:00","1","0","0","0","36.7783","-119.4170"],
        ["Tokyo","Japan","2020-01-26 11:00:00","4","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-26 11:00:00","8","0","2","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-26 11:00:00","3","0","0","0","37.5665","126.9780"],
        ["Singapore","Singapore","2020-01-26 11:00:00","4","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-26 11:00:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-26 11:00:00","3","0","0","0","48.8566","2.3522"],
        ["Melbourne","Australia","2020-01-26 11:00:00","4","0","0","0","-37.8136","144.9631"],
        ["Kathmandu","Nepal","2020-01-26 11:00:00","1","0","0","0","27.7172","85.3240"],
        ["Kuala Lumpur","Malaysia","2020-01-26 11:00:00","4","0","0","0","3.1390","101.6869"],
        ["Ontario","Canada","2020-01-26 11:00:00","1","0","0","0","43.6532","-79.3832"],
        ["Hubei","Mainland China","2020-01-26 23:00:00","1423","0","44","76","30.5928","114.3055"],
        ["Guangdong","Mainland China","2020-01-26 23:00:00","146","0","2","0","23.1291","113.2644"],
        ["Zhejiang","Mainland China","2020-01-26 23:00:00","128","0","1","0","30.2741","120.1551"],
        ["Henan","Mainland China","2020-01-26 23:00:00","128","0","0","1","34.7466","113.6253"],
        ["Chongqing","Mainland China","2020-01-26 23:00:00","110","0","0","0","29.4316","106.9123"],
        ["Hunan","Mainland China","2020-01-26 23:00:00","100","0","0","0","28.2282","112.9388"],
        ["Anhui","Mainland China","2020-01-26 23:00:00","70","0","0","0","31.8206","117.2272"],
        ["Sichuan","Mainland China","2020-01-26 23:00:00","69","0","0","0","30.5728","104.0668"],
        ["Beijing","Mainland China","2020-01-26 23:00:00","68","0","2","0","39.9042","116.4074"],
        ["Shandong","Mainland China","2020-01-26 23:00:00","63","0","0","0","36.6512","117.1201"],
        ["Shanghai","Mainland China","2020-01-26 23:00:00","53","0","1","1","31.2304","121.4737"],
        ["Jiangxi","Mainland China","2020-01-26 23:00:00","48","0","0","0","28.6829","115.8582"],
        ["Jiangsu","Mainland China","2020-01-26 23:00:00","47","0","1","0","32.0603","118.7969"],
        ["Guangxi","Mainland China","2020-01-26 23:00:00","46","0","0","0","22.8170","108.3665"],
        ["Fujian","Mainland China","2020-01-26 23:00:00","35","0","0","0","26.0745","119.2965"],
        ["Liaoning","Mainland China","2020-01-26 23:00:00","23","0","0","0","41.8057","123.4315"],
        ["Hainan","Mainland China","2020-01-26 23:00:00","22","0","0","0","20.0444","110.1983"],
        ["Shaanxi","Mainland China","2020-01-26 23:00:00","22","0","0","0","34.3416","108.9398"],
        ["Heilongjiang","Mainland China","2020-01-26 23:00:00","21","0","0","1","45.8038","126.5350"],
        ["Yunnan","Mainland China","2020-01-26 23:00:00","19","0","0","0","24.8801","102.8329"],
        ["Hebei","Mainland China","2020-01-26 23:00:00","18","0","0","1","38.0428","114.5149"],
        ["Tianjin","Mainland China","2020-01-26 23:00:00","14","0","0","0","39.3434","117.3616"],
        ["Gansu","Mainland China","2020-01-26 23:00:00","14","0","0","0","36.0611","103.8343"],
        ["Shanxi","Mainland China","2020-01-26 23:00:00","13","0","0","0","37.8706","112.5489"],
        ["Inner Mongolia","Mainland China","2020-01-26 23:00:00","11","0","0","0","40.8424","111.7500"],
        ["Hong Kong","Hong Kong","2020-01-26 23:00:00","8","0","0","0","22.3193","114.1694"],
        ["Guizhou","Mainland China","2020-01-26 23:00:00","7","0","0","0","26.6477","106.6302"],
        ["Jilin","Mainland China","2020-01-26 23:00:00","6","0","0","0","43.8171","125.3235"],
        ["Macau","Macau","2020-01-26 23:00:00","6","0","0","0","22.1987","113.5439"],
        ["Xinjiang","Mainland China","2020-01-26 23:00:00","5","0","0","0","43.8256","87.6168"],
        ["Ningxia","Mainland China","2020-01-26 23:00:00","4","0","0","0","38.4872","106.2309"],
        ["Taiwan","Taiwan","2020-01-26 23:00:00","4","0","0","0","25.0330","121.5654"],
        ["Qinghai","Mainland China","2020-01-26 23:00:00","4","0","0","0","36.6171","101.7782"],
        ["Washington","US","2020-01-26 23:00:00","1","0","0","0","47.7511","-120.7400"],
        ["Illinois","US","2020-01-26 23:00:00","1","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-01-26 23:00:00","2","0","0","0","36.7783","-119.4170"],
        ["Arizona","US","2020-01-26 23:00:00","1","0","0","0","34.0489","-111.0937"],
        ["Tokyo","Japan","2020-01-26 23:00:00","4","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-26 23:00:00","8","0","2","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-26 23:00:00","3","0","0","0","37.5665","126.9780"],
        ["Singapore","Singapore","2020-01-26 23:00:00","4","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-26 23:00:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-26 23:00:00","3","0","0","0","48.8566","2.3522"],
        ["Melbourne","Australia","2020-01-26 23:00:00","4","0","0","0","-37.8136","144.9631"],
        ["Kathmandu","Nepal","2020-01-26 23:00:00","1","0","0","0","27.7172","85.3240"],
        ["Kuala Lumpur","Malaysia","2020-01-26 23:00:00","4","0","0","0","3.1390","101.6869"],
        ["Ontario","Canada","2020-01-26 23:00:00","1","0","0","0","43.6532","-79.3832"],
        ["Hubei","Mainland China","2020-01-27 09:00:00","1423","0","45","76","30.5928","114.3055"],
        ["Guangdong","Mainland China","2020-01-27 09:00:00","151","0","3","0","23.1291","113.2644"],
        ["Zhejiang","Mainland China","2020-01-27 09:00:00","128","0","1","0","30.2741","120.1551"],
        ["Henan","Mainland China","2020-01-27 09:00:00","128","0","0","0","34.7466","113.6253"],
        ["Chongqing","Mainland China","2020-01-27 09:00:00","110","0","0","1","29.4316","106.9123"],
        ["Hunan","Mainland China","2020-01-27 09:00:00","100","0","0","0","28.2282","112.9388"],
        ["Shandong","Mainland China","2020-01-27 09:00:00","75","0","0","0","36.6512","117.1201"],
        ["Beijing","Mainland China","2020-01-27 09:00:00","72","0","2","0","39.9042","116.4074"],
        ["Anhui","Mainland China","2020-01-27 09:00:00","70","0","0","0","31.8206","117.2272"],
        ["Sichuan","Mainland China","2020-01-27 09:00:00","69","0","0","0","30.5728","104.0668"],
        ["Fujian","Mainland China","2020-01-27 09:00:00","56","0","0","0","26.0745","119.2965"],
        ["Shanghai","Mainland China","2020-01-27 09:00:00","53","0","3","1","31.2304","121.4737"],
        ["Jiangxi","Mainland China","2020-01-27 09:00:00","48","0","1","0","28.6829","115.8582"],
        ["Jiangsu","Mainland China","2020-01-27 09:00:00","47","0","1","0","32.0603","118.7969"],
        ["Guangxi","Mainland China","2020-01-27 09:00:00","46","0","0","0","22.8170","108.3665"],
        ["Shaanxi","Mainland China","2020-01-27 09:00:00","35","0","0","0","34.3416","108.9398"],
        ["Hainan","Mainland China","2020-01-27 09:00:00","33","0","0","1","20.0444","110.1983"],
        ["Liaoning","Mainland China","2020-01-27 09:00:00","27","0","0","0","41.8057","123.4315"],
        ["Yunnan","Mainland China","2020-01-27 09:00:00","26","0","0","0","24.8801","102.8329"],
        ["Tianjin","Mainland China","2020-01-27 09:00:00","22","0","0","0","39.3434","117.3616"],
        ["Heilongjiang","Mainland China","2020-01-27 09:00:00","21","0","0","1","45.8038","126.5350"],
        ["Hebei","Mainland China","2020-01-27 09:00:00","18","0","0","1","38.0428","114.5149"],
        ["Gansu","Mainland China","2020-01-27 09:00:00","14","0","0","0","36.0611","103.8343"],
        ["Shanxi","Mainland China","2020-01-27 09:00:00","13","0","0","0","37.8706","112.5489"],
        ["Inner Mongolia","Mainland China","2020-01-27 09:00:00","11","0","0","0","40.8424","111.7500"],
        ["Hong Kong","Hong Kong","2020-01-27 09:00:00","8","0","0","0","22.3193","114.1694"],
        ["Guizhou","Mainland China","2020-01-27 09:00:00","7","0","0","0","26.6477","106.6302"],
        ["Ningxia","Mainland China","2020-01-27 09:00:00","7","0","0","0","38.4872","106.2309"],
        ["Jilin","Mainland China","2020-01-27 09:00:00","6","0","0","0","43.8171","125.3235"],
        ["Macau","Macau","2020-01-27 09:00:00","6","0","0","0","22.1987","113.5439"],
        ["Taiwan","Taiwan","2020-01-27 09:00:00","5","0","0","0","25.0330","121.5654"],
        ["Xinjiang","Mainland China","2020-01-27 09:00:00","5","0","0","0","43.8256","87.6168"],
        ["Qinghai","Mainland China","2020-01-27 09:00:00","4","0","0","0","36.6171","101.7782"],
        ["Washington","US","2020-01-27 09:00:00","1","0","0","0","47.7511","-120.7400"],
        ["Illinois","US","2020-01-27 09:00:00","1","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-01-27 09:00:00","2","0","0","0","36.7783","-119.4170"],
        ["Arizona","US","2020-01-27 09:00:00","1","0","0","0","34.0489","-111.0937"],
        ["Tokyo","Japan","2020-01-27 09:00:00","4","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-27 09:00:00","8","0","2","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-27 09:00:00","4","0","0","0","37.5665","126.9780"],
        ["Singapore","Singapore","2020-01-27 09:00:00","4","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-27 09:00:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-27 09:00:00","3","0","0","0","48.8566","2.3522"],
        ["Melbourne","Australia","2020-01-27 09:00:00","4","0","0","0","-37.8136","144.9631"],
        ["Kathmandu","Nepal","2020-01-27 09:00:00","1","0","0","0","27.7172","85.3240"],
        ["Kuala Lumpur","Malaysia","2020-01-27 09:00:00","4","0","0","0","3.1390","101.6869"],
        ["Ontario","Canada","2020-01-27 09:00:00","1","0","0","0","43.6532","-79.3832"],
        ["Phnom Penh","Cambodia","2020-01-27 09:00:00","1","0","0","0","11.5564","104.9282"],
        ["Sydney","Australia","2020-01-27 09:00:00","1","0","0","0","-33.8688","151.2093"],
        ["Hubei","Mainland China","2020-01-27 19:00:00","1423","0","45","76","30.5928","114.3055"],
        ["Guangdong","Mainland China","2020-01-27 19:00:00","151","0","4","0","23.1291","113.2644"],
        ["Zhejiang","Mainland China","2020-01-27 19:00:00","128","0","1","0","30.2741","120.1551"],
        ["Henan","Mainland China","2020-01-27 19:00:00","128","0","0","1","34.7466","113.6253"],
        ["Chongqing","Mainland China","2020-01-27 19:00:00","110","0","0","0","29.4316","106.9123"],
        ["Hunan","Mainland China","2020-01-27 19:00:00","100","0","0","0","28.2282","112.9388"],
        ["Beijing","Mainland China","2020-01-27 19:00:00","80","0","2","1","39.9042","116.4074"],
        ["Shandong","Mainland China","2020-01-27 19:00:00","75","0","0","0","36.6512","117.1201"],
        ["Jiangxi","Mainland China","2020-01-27 19:00:00","72","0","2","0","28.6829","115.8582"],
        ["Anhui","Mainland China","2020-01-27 19:00:00","70","0","0","0","31.8206","117.2272"],
        ["Sichuan","Mainland China","2020-01-27 19:00:00","69","0","0","0","30.5728","104.0668"],
        ["Fujian","Mainland China","2020-01-27 19:00:00","59","0","0","0","26.0745","119.2965"],
        ["Shanghai","Mainland China","2020-01-27 19:00:00","53","0","3","1","31.2304","121.4737"],
        ["Jiangsu","Mainland China","2020-01-27 19:00:00","47","0","1","0","32.0603","118.7969"],
        ["Guangxi","Mainland China","2020-01-27 19:00:00","46","0","0","0","22.8170","108.3665"],
        ["Shaanxi","Mainland China","2020-01-27 19:00:00","35","0","0","0","34.3416","108.9398"],
        ["Hainan","Mainland China","2020-01-27 19:00:00","33","0","0","1","20.0444","110.1983"],
        ["Liaoning","Mainland China","2020-01-27 19:00:00","27","0","0","0","41.8057","123.4315"],
        ["Yunnan","Mainland China","2020-01-27 19:00:00","26","0","0","0","24.8801","102.8329"],
        ["Tianjin","Mainland China","2020-01-27 19:00:00","23","0","0","0","39.3434","117.3616"],
        ["Heilongjiang","Mainland China","2020-01-27 19:00:00","21","0","0","1","45.8038","126.5350"],
        ["Hebei","Mainland China","2020-01-27 19:00:00","18","0","0","1","38.0428","114.5149"],
        ["Gansu","Mainland China","2020-01-27 19:00:00","14","0","0","0","36.0611","103.8343"],
        ["Shanxi","Mainland China","2020-01-27 19:00:00","13","0","0","0","37.8706","112.5489"],
        ["Inner Mongolia","Mainland China","2020-01-27 19:00:00","11","0","0","0","40.8424","111.7500"],
        ["Hong Kong","Hong Kong","2020-01-27 19:00:00","8","0","0","0","22.3193","114.1694"],
        ["Guizhou","Mainland China","2020-01-27 19:00:00","7","0","0","0","26.6477","106.6302"],
        ["Ningxia","Mainland China","2020-01-27 19:00:00","7","0","0","0","38.4872","106.2309"],
        ["Jilin","Mainland China","2020-01-27 19:00:00","6","0","0","0","43.8171","125.3235"],
        ["Macau","Macau","2020-01-27 19:00:00","6","0","0","0","22.1987","113.5439"],
        ["Qinghai","Mainland China","2020-01-27 19:00:00","6","0","0","0","36.6171","101.7782"],
        ["Taiwan","Taiwan","2020-01-27 19:00:00","5","0","0","0","25.0330","121.5654"],
        ["Xinjiang","Mainland China","2020-01-27 19:00:00","5","0","0","0","43.8256","87.6168"],
        ["Washington","US","2020-01-27 19:00:00","1","0","0","0","47.7511","-120.7400"],
        ["Illinois","US","2020-01-27 19:00:00","1","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-01-27 19:00:00","2","0","0","0","36.7783","-119.4170"],
        ["Arizona","US","2020-01-27 19:00:00","1","0","0","0","34.0489","-111.0937"],
        ["Tokyo","Japan","2020-01-27 19:00:00","4","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-27 19:00:00","8","0","2","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-27 19:00:00","4","0","0","0","37.5665","126.9780"],
        ["Singapore","Singapore","2020-01-27 19:00:00","5","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-27 19:00:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-27 19:00:00","3","0","0","0","48.8566","2.3522"],
        ["Kathmandu","Nepal","2020-01-27 19:00:00","1","0","0","0","27.7172","85.3240"],
        ["Kuala Lumpur","Malaysia","2020-01-27 19:00:00","4","0","0","0","3.1390","101.6869"],
        ["Ontario","Canada","2020-01-27 19:00:00","1","0","0","0","43.6532","-79.3832"],
        ["Phnom Penh","Cambodia","2020-01-27 19:00:00","1","0","0","0","11.5564","104.9282"],
        ["Colombo","Sri Lanka","2020-01-27 19:00:00","1","0","0","0","6.9271","79.8612"],
        ["Yamoussoukro","Ivory Coast","2020-01-27 19:00:00","1","0","0","0","6.8276","-5.2893"],
        ["New South Wales","Australia","2020-01-27 19:00:00","4","0","0","0","-33.8688","151.2093"],
        ["Victoria","Australia","2020-01-27 19:00:00","1","0","0","0","-37.8136","144.9631"],
        ["Hubei","Mainland China","2020-01-27 20:30:00","2714","0","47","100","30.5928","114.3055"],
        ["Zhejiang","Mainland China","2020-01-27 20:30:00","173","0","1","0","30.2741","120.1551"],
        ["Henan","Mainland China","2020-01-27 20:30:00","168","0","0","1","34.7466","113.6253"],
        ["Guangdong","Mainland China","2020-01-27 20:30:00","151","0","4","0","23.1291","113.2644"],
        ["Chongqing","Mainland China","2020-01-27 20:30:00","132","0","0","0","29.4316","106.9123"],
        ["Anhui","Mainland China","2020-01-27 20:30:00","106","0","0","0","31.8206","117.2272"],
        ["Hunan","Mainland China","2020-01-27 20:30:00","100","0","0","0","28.2282","112.9388"],
        ["Sichuan","Mainland China","2020-01-27 20:30:00","90","0","0","0","30.5728","104.0668"],
        ["Shandong","Mainland China","2020-01-27 20:30:00","87","0","0","1","36.6512","117.1201"],
        ["Beijing","Mainland China","2020-01-27 20:30:00","80","0","2","1","39.9042","116.4074"],
        ["Jiangxi","Mainland China","2020-01-27 20:30:00","72","0","2","0","28.6829","115.8582"],
        ["Jiangsu","Mainland China","2020-01-27 20:30:00","70","0","1","0","32.0603","118.7969"],
        ["Shanghai","Mainland China","2020-01-27 20:30:00","66","0","3","1","31.2304","121.4737"],
        ["Fujian","Mainland China","2020-01-27 20:30:00","59","0","0","0","26.0745","119.2965"],
        ["Guangxi","Mainland China","2020-01-27 20:30:00","51","0","0","0","22.8170","108.3665"],
        ["Shaanxi","Mainland China","2020-01-27 20:30:00","35","0","0","0","34.3416","108.9398"],
        ["Hainan","Mainland China","2020-01-27 20:30:00","33","0","0","1","20.0444","110.1983"],
        ["Hebei","Mainland China","2020-01-27 20:30:00","33","0","0","1","38.0428","114.5149"],
        ["Heilongjiang","Mainland China","2020-01-27 20:30:00","30","0","0","1","45.8038","126.5350"],
        ["Liaoning","Mainland China","2020-01-27 20:30:00","27","0","0","0","41.8057","123.4315"],
        ["Yunnan","Mainland China","2020-01-27 20:30:00","26","0","0","0","24.8801","102.8329"],
        ["Tianjin","Mainland China","2020-01-27 20:30:00","23","0","0","0","39.3434","117.3616"],
        ["Shanxi","Mainland China","2020-01-27 20:30:00","20","0","0","0","37.8706","112.5489"],
        ["Gansu","Mainland China","2020-01-27 20:30:00","19","0","0","0","36.0611","103.8343"],
        ["Inner Mongolia","Mainland China","2020-01-27 20:30:00","11","0","0","0","40.8424","111.7500"],
        ["Guizhou","Mainland China","2020-01-27 20:30:00","9","0","0","0","26.6477","106.6302"],
        ["Hong Kong","Hong Kong","2020-01-27 20:30:00","8","0","0","0","22.3193","114.1694"],
        ["Ningxia","Mainland China","2020-01-27 20:30:00","7","0","0","0","38.4872","106.2309"],
        ["Jilin","Mainland China","2020-01-27 20:30:00","6","0","0","0","43.8171","125.3235"],
        ["Macau","Macau","2020-01-27 20:30:00","6","0","0","0","22.1987","113.5439"],
        ["Qinghai","Mainland China","2020-01-27 20:30:00","6","0","0","0","36.6171","101.7782"],
        ["Taiwan","Taiwan","2020-01-27 20:30:00","5","0","0","0","25.0330","121.5654"],
        ["Xinjiang","Mainland China","2020-01-27 20:30:00","5","0","0","0","43.8256","87.6168"],
        ["Washington","US","2020-01-27 20:30:00","1","0","0","0","47.7511","-120.7400"],
        ["Illinois","US","2020-01-27 20:30:00","1","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-01-27 20:30:00","2","0","0","0","36.7783","-119.4170"],
        ["Arizona","US","2020-01-27 20:30:00","1","0","0","0","34.0489","-111.0937"],
        ["Tokyo","Japan","2020-01-27 20:30:00","4","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-27 20:30:00","8","0","2","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-27 20:30:00","4","0","0","0","37.5665","126.9780"],
        ["Singapore","Singapore","2020-01-27 20:30:00","5","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-27 20:30:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-27 20:30:00","3","0","0","0","48.8566","2.3522"],
        ["Kathmandu","Nepal","2020-01-27 20:30:00","1","0","0","0","27.7172","85.3240"],
        ["Kuala Lumpur","Malaysia","2020-01-27 20:30:00","4","0","0","0","3.1390","101.6869"],
        ["Ontario","Canada","2020-01-27 20:30:00","1","0","0","0","43.6532","-79.3832"],
        ["Phnom Penh","Cambodia","2020-01-27 20:30:00","1","0","0","0","11.5564","104.9282"],
        ["Colombo","Sri Lanka","2020-01-27 20:30:00","1","0","0","0","6.9271","79.8612"],
        ["Yamoussoukro","Ivory Coast","2020-01-27 20:30:00","0","0","0","0","6.8276","-5.2893"],
        ["New South Wales","Australia","2020-01-27 20:30:00","4","0","0","0","-33.8688","151.2093"],
        ["Victoria","Australia","2020-01-27 20:30:00","1","0","0","0","-37.8136","144.9631"],
        ["Bavaria","Germany","2020-01-27 20:30:00","1","0","0","0","48.1351","11.5820"],
        ["Hubei","Mainland China","2020-01-28 13:00:00","2714","0","52","100","30.5928","114.3055"],
        ["Guangdong","Mainland China","2020-01-28 13:00:00","207","0","4","0","23.1291","113.2644"],
        ["Zhejiang","Mainland China","2020-01-28 13:00:00","173","0","3","0","30.2741","120.1551"],
        ["Henan","Mainland China","2020-01-28 13:00:00","168","0","0","1","34.7466","113.6253"],
        ["Hunan","Mainland China","2020-01-28 13:00:00","143","0","0","0","28.2282","112.9388"],
        ["Chongqing","Mainland China","2020-01-28 13:00:00","132","0","0","0","29.4316","106.9123"],
        ["Anhui","Mainland China","2020-01-28 13:00:00","106","0","0","0","31.8206","117.2272"],
        ["Shandong","Mainland China","2020-01-28 13:00:00","95","0","0","0","36.6512","117.1201"],
        ["Beijing","Mainland China","2020-01-28 13:00:00","91","0","4","1","39.9042","116.4074"],
        ["Sichuan","Mainland China","2020-01-28 13:00:00","90","0","0","0","30.5728","104.0668"],
        ["Fujian","Mainland China","2020-01-28 13:00:00","80","0","0","0","26.0745","119.2965"],
        ["Jiangxi","Mainland China","2020-01-28 13:00:00","72","0","3","0","28.6829","115.8582"],
        ["Jiangsu","Mainland China","2020-01-28 13:00:00","70","0","1","0","32.0603","118.7969"],
        ["Shanghai","Mainland China","2020-01-28 13:00:00","66","0","4","1","31.2304","121.4737"],
        ["Guangxi","Mainland China","2020-01-28 13:00:00","51","0","2","0","22.8170","108.3665"],
        ["Shaanxi","Mainland China","2020-01-28 13:00:00","46","0","0","0","34.3416","108.9398"],
        ["Yunnan","Mainland China","2020-01-28 13:00:00","44","0","0","0","24.8801","102.8329"],
        ["Hainan","Mainland China","2020-01-28 13:00:00","40","0","0","1","20.0444","110.1983"],
        ["Liaoning","Mainland China","2020-01-28 13:00:00","34","0","0","0","41.8057","123.4315"],
        ["Heilongjiang","Mainland China","2020-01-28 13:00:00","33","0","0","1","45.8038","126.5350"],
        ["Hebei","Mainland China","2020-01-28 13:00:00","33","0","0","1","38.0428","114.5149"],
        ["Tianjin","Mainland China","2020-01-28 13:00:00","24","0","0","0","39.3434","117.3616"],
        ["Shanxi","Mainland China","2020-01-28 13:00:00","20","0","0","0","37.8706","112.5489"],
        ["Gansu","Mainland China","2020-01-28 13:00:00","19","0","0","0","36.0611","103.8343"],
        ["Inner Mongolia","Mainland China","2020-01-28 13:00:00","15","0","0","0","40.8424","111.7500"],
        ["Ningxia","Mainland China","2020-01-28 13:00:00","11","0","0","0","38.4872","106.2309"],
        ["Xinjiang","Mainland China","2020-01-28 13:00:00","10","0","0","0","43.8256","87.6168"],
        ["Guizhou","Mainland China","2020-01-28 13:00:00","9","0","0","0","26.6477","106.6302"],
        ["Jilin","Mainland China","2020-01-28 13:00:00","8","0","0","0","43.8171","125.3235"],
        ["Taiwan","Taiwan","2020-01-28 13:00:00","8","0","0","0","25.0330","121.5654"],
        ["Hong Kong","Hong Kong","2020-01-28 13:00:00","8","0","0","0","22.3193","114.1694"],
        ["Macau","Macau","2020-01-28 13:00:00","7","0","0","0","22.1987","113.5439"],
        ["Qinghai","Mainland China","2020-01-28 13:00:00","6","0","0","0","36.6171","101.7782"],
        ["Washington","US","2020-01-28 13:00:00","1","0","0","0","47.7511","-120.7400"],
        ["Illinois","US","2020-01-28 13:00:00","1","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-01-28 13:00:00","2","0","0","0","36.7783","-119.4170"],
        ["Arizona","US","2020-01-28 13:00:00","1","0","0","0","34.0489","-111.0937"],
        ["Tokyo","Japan","2020-01-28 13:00:00","7","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-28 13:00:00","14","0","5","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-28 13:00:00","4","0","0","0","37.5665","126.9780"],
        ["Singapore","Singapore","2020-01-28 13:00:00","7","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-28 13:00:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-28 13:00:00","3","0","0","0","48.8566","2.3522"],
        ["Kathmandu","Nepal","2020-01-28 13:00:00","1","0","0","0","27.7172","85.3240"],
        ["Kuala Lumpur","Malaysia","2020-01-28 13:00:00","4","0","0","0","3.1390","101.6869"],
        ["Ontario","Canada","2020-01-28 13:00:00","2","0","0","0","43.6532","-79.3832"],
        ["Phnom Penh","Cambodia","2020-01-28 13:00:00","1","0","0","0","11.5564","104.9282"],
        ["Colombo","Sri Lanka","2020-01-28 13:00:00","1","0","0","0","6.9271","79.8612"],
        ["New South Wales","Australia","2020-01-28 13:00:00","4","0","0","0","-33.8688","151.2093"],
        ["Victoria","Australia","2020-01-28 13:00:00","1","0","0","0","-37.8136","144.9631"],
        ["Bavaria","Germany","2020-01-28 13:00:00","1","0","0","0","48.1351","11.5820"],
        ["Hubei","Mainland China","2020-01-28 18:00:00","3554","0","80","125","30.5928","114.3055"],
        ["Guangdong","Mainland China","2020-01-28 18:00:00","207","0","4","0","23.1291","113.2644"],
        ["Zhejiang","Mainland China","2020-01-28 18:00:00","173","0","3","0","30.2741","120.1551"],
        ["Henan","Mainland China","2020-01-28 18:00:00","168","0","0","1","34.7466","113.6253"],
        ["Hunan","Mainland China","2020-01-28 18:00:00","143","0","0","0","28.2282","112.9388"],
        ["Chongqing","Mainland China","2020-01-28 18:00:00","132","0","0","0","29.4316","106.9123"],
        ["Jiangxi","Mainland China","2020-01-28 18:00:00","109","0","3","0","28.6829","115.8582"],
        ["Anhui","Mainland China","2020-01-28 18:00:00","106","0","0","0","31.8206","117.2272"],
        ["Shandong","Mainland China","2020-01-28 18:00:00","95","0","0","0","36.6512","117.1201"],
        ["Beijing","Mainland China","2020-01-28 18:00:00","91","0","4","1","39.9042","116.4074"],
        ["Sichuan","Mainland China","2020-01-28 18:00:00","90","0","0","0","30.5728","104.0668"],
        ["Fujian","Mainland China","2020-01-28 18:00:00","80","0","0","0","26.0745","119.2965"],
        ["Jiangsu","Mainland China","2020-01-28 18:00:00","70","0","1","0","32.0603","118.7969"],
        ["Shanghai","Mainland China","2020-01-28 18:00:00","66","0","4","1","31.2304","121.4737"],
        ["Guangxi","Mainland China","2020-01-28 18:00:00","51","0","2","0","22.8170","108.3665"],
        ["Shaanxi","Mainland China","2020-01-28 18:00:00","46","0","0","0","34.3416","108.9398"],
        ["Yunnan","Mainland China","2020-01-28 18:00:00","44","0","0","0","24.8801","102.8329"],
        ["Hainan","Mainland China","2020-01-28 18:00:00","40","0","0","1","20.0444","110.1983"],
        ["Liaoning","Mainland China","2020-01-28 18:00:00","34","0","0","0","41.8057","123.4315"],
        ["Hebei","Mainland China","2020-01-28 18:00:00","33","0","0","1","38.0428","114.5149"],
        ["Heilongjiang","Mainland China","2020-01-28 18:00:00","33","0","0","1","45.8038","126.5350"],
        ["Shanxi","Mainland China","2020-01-28 18:00:00","27","0","0","0","37.8706","112.5489"],
        ["Tianjin","Mainland China","2020-01-28 18:00:00","24","0","0","0","39.3434","117.3616"],
        ["Gansu","Mainland China","2020-01-28 18:00:00","19","0","0","0","36.0611","103.8343"],
        ["Inner Mongolia","Mainland China","2020-01-28 18:00:00","15","0","0","0","40.8424","111.7500"],
        ["Ningxia","Mainland China","2020-01-28 18:00:00","11","0","0","0","38.4872","106.2309"],
        ["Xinjiang","Mainland China","2020-01-28 18:00:00","10","0","0","0","43.8256","87.6168"],
        ["Guizhou","Mainland China","2020-01-28 18:00:00","9","0","0","0","26.6477","106.6302"],
        ["Jilin","Mainland China","2020-01-28 18:00:00","8","0","0","0","43.8171","125.3235"],
        ["Taiwan","Taiwan","2020-01-28 18:00:00","8","0","0","0","25.0330","121.5654"],
        ["Hong Kong","Hong Kong","2020-01-28 18:00:00","8","0","0","0","22.3193","114.1694"],
        ["Macau","Macau","2020-01-28 18:00:00","7","0","0","0","22.1987","113.5439"],
        ["Qinghai","Mainland China","2020-01-28 18:00:00","6","0","0","0","36.6171","101.7782"],
        ["Washington","US","2020-01-28 18:00:00","1","0","0","0","47.7511","-120.7400"],
        ["Illinois","US","2020-01-28 18:00:00","1","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-01-28 18:00:00","2","0","0","0","36.7783","-119.4170"],
        ["Arizona","US","2020-01-28 18:00:00","1","0","0","0","34.0489","-111.0937"],
        ["Tokyo","Japan","2020-01-28 18:00:00","7","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-28 18:00:00","14","0","5","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-28 18:00:00","4","0","0","0","37.5665","126.9780"],
        ["Singapore","Singapore","2020-01-28 18:00:00","7","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-28 18:00:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-28 18:00:00","4","0","0","0","48.8566","2.3522"],
        ["Kathmandu","Nepal","2020-01-28 18:00:00","1","0","0","0","27.7172","85.3240"],
        ["Kuala Lumpur","Malaysia","2020-01-28 18:00:00","4","0","0","0","3.1390","101.6869"],
        ["Ontario","Canada","2020-01-28 18:00:00","1","0","0","0","43.6532","-79.3832"],
        ["British Columbia","Canada","2020-01-28 18:00:00","1","0","0","0","49.2827","-123.1207"],
        ["Phnom Penh","Cambodia","2020-01-28 18:00:00","1","0","0","0","11.5564","104.9282"],
        ["Colombo","Sri Lanka","2020-01-28 18:00:00","1","0","0","0","6.9271","79.8612"],
        ["New South Wales","Australia","2020-01-28 18:00:00","4","0","0","0","-33.8688","151.2093"],
        ["Victoria","Australia","2020-01-28 18:00:00","1","0","0","0","-37.8136","144.9631"],
        ["Bavaria","Germany","2020-01-28 18:00:00","4","0","0","0","48.1351","11.5820"],
        ["Hubei","Mainland China","2020-01-28 23:00:00","3554","0","80","125","30.5928","114.3055"],
        ["Zhejiang","Mainland China","2020-01-28 23:00:00","296","0","3","0","30.2741","120.1551"],
        ["Guangdong","Mainland China","2020-01-28 23:00:00","241","0","5","0","23.1291","113.2644"],
        ["Hunan","Mainland China","2020-01-28 23:00:00","221","0","0","0","28.2282","112.9388"],
        ["Henan","Mainland China","2020-01-28 23:00:00","206","0","1","2","34.7466","113.6253"],
        ["Anhui","Mainland China","2020-01-28 23:00:00","152","0","0","0","31.8206","117.2272"],
        ["Chongqing","Mainland China","2020-01-28 23:00:00","147","0","1","0","29.4316","106.9123"],
        ["Shandong","Mainland China","2020-01-28 23:00:00","121","0","0","0","36.6512","117.1201"],
        ["Jiangxi","Mainland China","2020-01-28 23:00:00","109","0","3","0","28.6829","115.8582"],
        ["Sichuan","Mainland China","2020-01-28 23:00:00","108","0","0","0","30.5728","104.0668"],
        ["Jiangsu","Mainland China","2020-01-28 23:00:00","99","0","1","0","32.0603","118.7969"],
        ["Beijing","Mainland China","2020-01-28 23:00:00","91","0","4","1","39.9042","116.4074"],
        ["Fujian","Mainland China","2020-01-28 23:00:00","82","0","0","0","26.0745","119.2965"],
        ["Shanghai","Mainland China","2020-01-28 23:00:00","80","0","4","1","31.2304","121.4737"],
        ["Guangxi","Mainland China","2020-01-28 23:00:00","58","0","2","0","22.8170","108.3665"],
        ["Shaanxi","Mainland China","2020-01-28 23:00:00","56","0","0","0","34.3416","108.9398"],
        ["Hebei","Mainland China","2020-01-28 23:00:00","48","0","0","1","38.0428","114.5149"],
        ["Yunnan","Mainland China","2020-01-28 23:00:00","44","0","0","0","24.8801","102.8329"],
        ["Hainan","Mainland China","2020-01-28 23:00:00","43","0","0","1","20.0444","110.1983"],
        ["Heilongjiang","Mainland China","2020-01-28 23:00:00","37","0","0","1","45.8038","126.5350"],
        ["Liaoning","Mainland China","2020-01-28 23:00:00","36","0","0","0","41.8057","123.4315"],
        ["Shanxi","Mainland China","2020-01-28 23:00:00","27","0","0","0","37.8706","112.5489"],
        ["Tianjin","Mainland China","2020-01-28 23:00:00","25","0","0","0","39.3434","117.3616"],
        ["Gansu","Mainland China","2020-01-28 23:00:00","24","0","0","0","36.0611","103.8343"],
        ["Inner Mongolia","Mainland China","2020-01-28 23:00:00","16","0","0","0","40.8424","111.7500"],
        ["Xinjiang","Mainland China","2020-01-28 23:00:00","13","0","0","0","43.8256","87.6168"],
        ["Ningxia","Mainland China","2020-01-28 23:00:00","12","0","0","0","38.4872","106.2309"],
        ["Guizhou","Mainland China","2020-01-28 23:00:00","9","0","0","0","26.6477","106.6302"],
        ["Jilin","Mainland China","2020-01-28 23:00:00","9","0","0","0","43.8171","125.3235"],
        ["Hong Kong","Hong Kong","2020-01-28 23:00:00","8","0","0","0","22.3193","114.1694"],
        ["Taiwan","Taiwan","2020-01-28 23:00:00","8","0","0","0","25.0330","121.5654"],
        ["Macau","Macau","2020-01-28 23:00:00","7","0","0","0","22.1987","113.5439"],
        ["Qinghai","Mainland China","2020-01-28 23:00:00","6","0","0","0","36.6171","101.7782"],
        ["Washington","US","2020-01-28 18:00:00","1","0","0","0","47.7511","-120.7400"],
        ["Illinois","US","2020-01-28 23:00:00","1","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-01-28 23:00:00","2","0","0","0","36.7783","-119.4170"],
        ["Arizona","US","2020-01-28 23:00:00","1","0","0","0","34.0489","-111.0937"],
        ["Tokyo","Japan","2020-01-28 23:00:00","7","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-28 23:00:00","14","0","5","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-28 23:00:00","4","0","0","0","37.5665","126.9780"],
        ["Singapore","Singapore","2020-01-28 23:00:00","7","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-28 23:00:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-28 23:00:00","4","0","0","0","48.8566","2.3522"],
        ["Kathmandu","Nepal","2020-01-28 23:00:00","1","0","0","0","27.7172","85.3240"],
        ["Kuala Lumpur","Malaysia","2020-01-28 23:00:00","7","0","0","0","3.1390","101.6869"],
        ["Ontario","Canada","2020-01-28 23:00:00","1","0","0","0","43.6532","-79.3832"],
        ["British Columbia","Canada","2020-01-28 23:00:00","1","0","0","0","49.2827","-123.1207"],
        ["Phnom Penh","Cambodia","2020-01-28 23:00:00","1","0","0","0","11.5564","104.9282"],
        ["Colombo","Sri Lanka","2020-01-28 23:00:00","1","0","0","0","6.9271","79.8612"],
        ["New South Wales","Australia","2020-01-28 23:00:00","4","0","0","0","-33.8688","151.2093"],
        ["Victoria","Australia","2020-01-28 23:00:00","1","0","0","0","-37.8136","144.9631"],
        ["Bavaria","Germany","2020-01-28 23:00:00","4","0","0","0","48.1351","11.5820"],
        ["Hubei","Mainland China","2020-01-29 13:30:00","3554","0","80","125","30.5928","114.3055"],
        ["Guangdong","Mainland China","2020-01-29 13:30:00","277","0","4","0","23.1291","113.2644"],
        ["Zhejiang","Mainland China","2020-01-29 13:30:00","296","0","3","0","30.2741","120.1551"],
        ["Henan","Mainland China","2020-01-29 13:30:00","206","0","1","2","34.7466","113.6253"],
        ["Chongqing","Mainland China","2020-01-29 13:30:00","147","0","0","0","29.4316","106.9123"],
        ["Hunan","Mainland China","2020-01-29 13:30:00","221","0","0","0","28.2282","112.9388"],
        ["Shandong","Mainland China","2020-01-29 13:30:00","130","0","1","0","36.6512","117.1201"],
        ["Beijing","Mainland China","2020-01-29 13:30:00","111","0","4","1","39.9042","116.4074"],
        ["Anhui","Mainland China","2020-01-29 13:30:00","152","0","2","0","31.8206","117.2272"],
        ["Sichuan","Mainland China","2020-01-29 13:30:00","108","0","0","0","30.5728","104.0668"],
        ["Fujian","Mainland China","2020-01-29 13:30:00","84","0","0","0","26.0745","119.2965"],
        ["Shanghai","Mainland China","2020-01-29 13:30:00","96","0","4","1","31.2304","121.4737"],
        ["Jiangxi","Mainland China","2020-01-29 13:30:00","109","0","3","0","28.6829","115.8582"],
        ["Jiangsu","Mainland China","2020-01-29 13:30:00","99","0","1","0","32.0603","118.7969"],
        ["Guangxi","Mainland China","2020-01-29 13:30:00","58","0","2","0","22.8170","108.3665"],
        ["Shaanxi","Mainland China","2020-01-29 13:30:00","56","0","0","0","34.3416","108.9398"],
        ["Hainan","Mainland China","2020-01-29 13:30:00","43","0","1","1","20.0444","110.1983"],
        ["Liaoning","Mainland China","2020-01-29 13:30:00","39","0","0","0","41.8057","123.4315"],
        ["Yunnan","Mainland China","2020-01-29 13:30:00","55","0","0","0","24.8801","102.8329"],
        ["Tianjin","Mainland China","2020-01-29 13:30:00","27","0","0","0","39.3434","117.3616"],
        ["Heilongjiang","Mainland China","2020-01-29 13:30:00","38","0","0","1","45.8038","126.5350"],
        ["Hebei","Mainland China","2020-01-29 13:30:00","48","0","0","1","38.0428","114.5149"],
        ["Gansu","Mainland China","2020-01-29 13:30:00","24","0","0","0","36.0611","103.8343"],
        ["Shanxi","Mainland China","2020-01-29 13:30:00","27","0","0","0","37.8706","112.5489"],
        ["Inner Mongolia","Mainland China","2020-01-29 13:30:00","16","0","0","0","40.8424","111.7500"],
        ["Hong Kong","Hong Kong","2020-01-29 13:30:00","10","0","0","0","22.3193","114.1694"],
        ["Guizhou","Mainland China","2020-01-29 13:30:00","9","0","0","0","26.6477","106.6302"],
        ["Ningxia","Mainland China","2020-01-29 13:30:00","12","0","0","0","38.4872","106.2309"],
        ["Jilin","Mainland China","2020-01-29 13:30:00","9","0","0","0","43.8171","125.3235"],
        ["Macau","Macau","2020-01-29 13:30:00","7","0","0","0","22.1987","113.5439"],
        ["Taiwan","Taiwan","2020-01-29 13:30:00","8","0","0","0","25.0330","121.5654"],
        ["Xinjiang","Mainland China","2020-01-29 13:30:00","13","0","0","0","43.8256","87.6168"],
        ["Qinghai","Mainland China","2020-01-29 13:30:00","6","0","0","0","36.6171","101.7782"],
        ["Washington","US","2020-01-29 13:30:00","1","0","0","0","47.7511","-120.7400"],
        ["Illinois","US","2020-01-29 13:30:00","1","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-01-29 13:30:00","2","0","0","0","36.7783","-119.4170"],
        ["Arizona","US","2020-01-29 13:30:00","1","0","0","0","34.0489","-111.0937"],
        ["Ontario","Canada","2020-01-29 13:30:00","3","0","0","0","43.6532","-79.3832"],
        ["Tokyo","Japan","2020-01-29 13:30:00","7","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-29 13:30:00","14","0","5","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-29 13:30:00","4","0","0","0","37.5665","126.9780"],
        ["Singapore","Singapore","2020-01-29 13:30:00","7","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-29 13:30:00","2","0","0","0","21.0278","105.8342"],
        ["Kathmandu","Nepal","2020-01-29 13:30:00","1","0","0","0","27.7172","85.3240"],
        ["Kuala Lumpur","Malaysia","2020-01-29 13:30:00","7","0","0","0","3.1390","101.6869"],
        ["Phnom Penh","Cambodia","2020-01-29 13:30:00","1","0","0","0","11.5564","104.9282"],
        ["Colombo","Sri Lanka","2020-01-29 13:30:00","1","0","0","0","6.9271","79.8612"],
        ["New South Wales","Australia","2020-01-29 13:30:00","4","0","0","0","-33.8688","151.2093"],
        ["Victoria","Australia","2020-01-29 13:30:00","1","0","0","0","-37.8136","144.9631"],
        ["Abu Dhabi","United Arab Emirates","2020-01-29 13:30:00","4","0","0","0","24.4539","54.3773"],
        ["Paris","France","2020-01-29 13:30:00","4","0","0","0","48.8566","2.3522"],
        ["Bavaria","Germany","2020-01-29 13:30:00","4","0","0","0","48.1351","11.5820"],
        ["Hubei","Mainland China","2020-01-29 14:30:00","3554","0","88","125","30.5928","114.3055"],
        ["Zhejiang","Mainland China","2020-01-29 14:30:00","296","0","3","0","30.2741","120.1551"],
        ["Guangdong","Mainland China","2020-01-29 14:30:00","277","0","5","0","23.1291","113.2644"],
        ["Hunan","Mainland China","2020-01-29 14:30:00","221","0","0","0","28.2282","112.9388"],
        ["Henan","Mainland China","2020-01-29 14:30:00","206","0","1","2","34.7466","113.6253"],
        ["Anhui","Mainland China","2020-01-29 14:30:00","152","0","2","0","31.8206","117.2272"],
        ["Chongqing","Mainland China","2020-01-29 14:30:00","147","0","1","0","29.4316","106.9123"],
        ["Shandong","Mainland China","2020-01-29 14:30:00","130","0","1","0","36.6512","117.1201"],
        ["Beijing","Mainland China","2020-01-29 14:30:00","111","0","4","1","39.9042","116.4074"],
        ["Jiangxi","Mainland China","2020-01-29 14:30:00","109","0","3","0","28.6829","115.8582"],
        ["Sichuan","Mainland China","2020-01-29 14:30:00","108","0","1","1","30.5728","104.0668"],
        ["Jiangsu","Mainland China","2020-01-29 14:30:00","99","0","1","0","32.0603","118.7969"],
        ["Shanghai","Mainland China","2020-01-29 14:30:00","96","0","5","1","31.2304","121.4737"],
        ["Fujian","Mainland China","2020-01-29 14:30:00","84","0","0","0","26.0745","119.2965"],
        ["Guangxi","Mainland China","2020-01-29 14:30:00","58","0","2","0","22.8170","108.3665"],
        ["Shaanxi","Mainland China","2020-01-29 14:30:00","56","0","0","0","34.3416","108.9398"],
        ["Yunnan","Mainland China","2020-01-29 14:30:00","55","0","0","0","24.8801","102.8329"],
        ["Hebei","Mainland China","2020-01-29 14:30:00","48","0","0","1","38.0428","114.5149"],
        ["Hainan","Mainland China","2020-01-29 14:30:00","43","0","0","1","20.0444","110.1983"],
        ["Liaoning","Mainland China","2020-01-29 14:30:00","39","0","1","0","41.8057","123.4315"],
        ["Heilongjiang","Mainland China","2020-01-29 14:30:00","38","0","0","1","45.8038","126.5350"],
        ["Tianjin","Mainland China","2020-01-29 14:30:00","27","0","0","0","39.3434","117.3616"],
        ["Shanxi","Mainland China","2020-01-29 14:30:00","27","0","1","0","37.8706","112.5489"],
        ["Gansu","Mainland China","2020-01-29 14:30:00","24","0","0","0","36.0611","103.8343"],
        ["Inner Mongolia","Mainland China","2020-01-29 14:30:00","16","0","0","0","40.8424","111.7500"],
        ["Xinjiang","Mainland China","2020-01-29 14:30:00","13","0","0","0","43.8256","87.6168"],
        ["Ningxia","Mainland China","2020-01-29 14:30:00","12","0","0","0","38.4872","106.2309"],
        ["Hong Kong","Hong Kong","2020-01-29 14:30:00","10","0","0","0","22.3193","114.1694"],
        ["Guizhou","Mainland China","2020-01-29 14:30:00","9","0","1","0","26.6477","106.6302"],
        ["Jilin","Mainland China","2020-01-29 14:30:00","9","0","0","0","43.8171","125.3235"],
        ["Taiwan","Taiwan","2020-01-29 14:30:00","8","0","0","0","25.0330","121.5654"],
        ["Macau","Macau","2020-01-29 14:30:00","7","0","0","0","22.1987","113.5439"],
        ["Qinghai","Mainland China","2020-01-29 14:30:00","6","0","0","0","36.6171","101.7782"],
        ["Washington","US","2020-01-29 14:30:00","1","0","0","0","47.7511","-120.7400"],
        ["Illinois","US","2020-01-29 14:30:00","1","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-01-29 14:30:00","2","0","0","0","36.7783","-119.4170"],
        ["Arizona","US","2020-01-29 14:30:00","1","0","0","0","34.0489","-111.0937"],
        ["Tokyo","Japan","2020-01-29 14:30:00","7","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-29 14:30:00","14","0","5","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-29 14:30:00","4","0","0","0","37.5665","126.9780"],
        ["Singapore","Singapore","2020-01-29 14:30:00","7","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-29 14:30:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-29 14:30:00","5","0","0","0","48.8566","2.3522"],
        ["Kathmandu","Nepal","2020-01-29 14:30:00","1","0","0","0","27.7172","85.3240"],
        ["Kuala Lumpur","Malaysia","2020-01-29 14:30:00","7","0","0","0","3.1390","101.6869"],
        ["Ontario","Canada","2020-01-29 14:30:00","1","0","0","0","43.6532","-79.3832"],
        ["British Columbia","Canada","2020-01-29 14:30:00","1","0","0","0","49.2827","-123.1207"],
        ["Phnom Penh","Cambodia","2020-01-29 14:30:00","1","0","0","0","11.5564","104.9282"],
        ["Colombo","Sri Lanka","2020-01-29 14:30:00","1","0","0","0","6.9271","79.8612"],
        ["New South Wales","Australia","2020-01-29 14:30:00","4","0","0","0","-33.8688","151.2093"],
        ["Victoria","Australia","2020-01-29 14:30:00","1","0","0","0","-37.8136","144.9631"],
        ["Bavaria","Germany","2020-01-29 14:30:00","4","0","0","0","48.1351","11.5820"],
        ["Helsinki","Finland","2020-01-29 14:30:00","1","0","0","0","60.1699","24.9384"],
        ["Abu Dhabi","United Arab Emirates","2020-01-29 14:30:00","4","0","0","0","24.4539","54.3773"],
        ["Hubei","Mainland China","2020-01-29 14:30:00","3554","0","88","125","30.5928","114.3055"],
        ["Zhejiang","Mainland China","2020-01-29 14:30:00","296","0","3","0","30.2741","120.1551"],
        ["Guangdong","Mainland China","2020-01-29 14:30:00","277","0","5","0","23.1291","113.2644"],
        ["Hunan","Mainland China","2020-01-29 14:30:00","221","0","0","0","28.2282","112.9388"],
        ["Henan","Mainland China","2020-01-29 14:30:00","206","0","1","2","34.7466","113.6253"],
        ["Anhui","Mainland China","2020-01-29 14:30:00","152","0","2","0","31.8206","117.2272"],
        ["Chongqing","Mainland China","2020-01-29 14:30:00","147","0","1","0","29.4316","106.9123"],
        ["Shandong","Mainland China","2020-01-29 14:30:00","130","0","1","0","36.6512","117.1201"],
        ["Beijing","Mainland China","2020-01-29 14:30:00","111","0","4","1","39.9042","116.4074"],
        ["Jiangxi","Mainland China","2020-01-29 14:30:00","109","0","3","0","28.6829","115.8582"],
        ["Sichuan","Mainland China","2020-01-29 14:30:00","108","0","1","1","30.5728","104.0668"],
        ["Jiangsu","Mainland China","2020-01-29 14:30:00","99","0","1","0","32.0603","118.7969"],
        ["Shanghai","Mainland China","2020-01-29 14:30:00","96","0","5","1","31.2304","121.4737"],
        ["Fujian","Mainland China","2020-01-29 14:30:00","84","0","0","0","26.0745","119.2965"],
        ["Guangxi","Mainland China","2020-01-29 14:30:00","58","0","2","0","22.8170","108.3665"],
        ["Shaanxi","Mainland China","2020-01-29 14:30:00","56","0","0","0","34.3416","108.9398"],
        ["Yunnan","Mainland China","2020-01-29 14:30:00","55","0","0","0","24.8801","102.8329"],
        ["Hebei","Mainland China","2020-01-29 14:30:00","48","0","0","1","38.0428","114.5149"],
        ["Hainan","Mainland China","2020-01-29 14:30:00","43","0","0","1","20.0444","110.1983"],
        ["Liaoning","Mainland China","2020-01-29 14:30:00","39","0","1","0","41.8057","123.4315"],
        ["Heilongjiang","Mainland China","2020-01-29 14:30:00","38","0","0","1","45.8038","126.5350"],
        ["Tianjin","Mainland China","2020-01-29 14:30:00","27","0","0","0","39.3434","117.3616"],
        ["Shanxi","Mainland China","2020-01-29 14:30:00","27","0","1","0","37.8706","112.5489"],
        ["Gansu","Mainland China","2020-01-29 14:30:00","24","0","0","0","36.0611","103.8343"],
        ["Inner Mongolia","Mainland China","2020-01-29 14:30:00","16","0","0","0","40.8424","111.7500"],
        ["Xinjiang","Mainland China","2020-01-29 14:30:00","13","0","0","0","43.8256","87.6168"],
        ["Ningxia","Mainland China","2020-01-29 14:30:00","12","0","0","0","38.4872","106.2309"],
        ["Hong Kong","Hong Kong","2020-01-29 14:30:00","10","0","0","0","22.3193","114.1694"],
        ["Guizhou","Mainland China","2020-01-29 14:30:00","9","0","1","0","26.6477","106.6302"],
        ["Jilin","Mainland China","2020-01-29 14:30:00","9","0","0","0","43.8171","125.3235"],
        ["Taiwan","Taiwan","2020-01-29 14:30:00","8","0","0","0","25.0330","121.5654"],
        ["Macau","Macau","2020-01-29 14:30:00","7","0","0","0","22.1987","113.5439"],
        ["Qinghai","Mainland China","2020-01-29 14:30:00","6","0","0","0","36.6171","101.7782"],
        ["Washington","US","2020-01-29 14:30:00","1","0","0","0","47.7511","-120.7400"],
        ["Illinois","US","2020-01-29 14:30:00","1","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-01-29 14:30:00","2","0","0","0","36.7783","-119.4170"],
        ["Arizona","US","2020-01-29 14:30:00","1","0","0","0","34.0489","-111.0937"],
        ["Tokyo","Japan","2020-01-29 14:30:00","7","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-29 14:30:00","14","0","5","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-29 14:30:00","4","0","0","0","37.5665","126.9780"],
        ["Singapore","Singapore","2020-01-29 14:30:00","7","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-29 14:30:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-29 14:30:00","5","0","0","0","48.8566","2.3522"],
        ["Kathmandu","Nepal","2020-01-29 14:30:00","1","0","0","0","27.7172","85.3240"],
        ["Kuala Lumpur","Malaysia","2020-01-29 14:30:00","7","0","0","0","3.1390","101.6869"],
        ["Ontario","Canada","2020-01-29 14:30:00","1","0","0","0","43.6532","-79.3832"],
        ["British Columbia","Canada","2020-01-29 14:30:00","1","0","0","0","49.2827","-123.1207"],
        ["Phnom Penh","Cambodia","2020-01-29 14:30:00","1","0","0","0","11.5564","104.9282"],
        ["Colombo","Sri Lanka","2020-01-29 14:30:00","1","0","0","0","6.9271","79.8612"],
        ["New South Wales","Australia","2020-01-29 14:30:00","4","0","0","0","-33.8688","151.2093"],
        ["Victoria","Australia","2020-01-29 14:30:00","1","0","0","0","-37.8136","144.9631"],
        ["Bavaria","Germany","2020-01-29 14:30:00","4","0","0","0","48.1351","11.5820"],
        ["Helsinki","Finland","2020-01-29 14:30:00","1","0","0","0","60.1699","24.9384"],
        ["Abu Dhabi","United Arab Emirates","2020-01-29 14:30:00","4","0","0","0","24.4539","54.3773"],
        ["Hubei","Mainland China","2020-01-30 11:00:00","4903","0","90","162","30.5928","114.3055"],
        ["Zhejiang","Mainland China","2020-01-30 11:00:00","428","0","4","0","30.2741","120.1551"],
        ["Guangdong","Mainland China","2020-01-30 11:00:00","354","0","10","0","23.1291","113.2644"],
        ["Henan","Mainland China","2020-01-30 11:00:00","278","0","2","2","34.7466","113.6253"],
        ["Hunan","Mainland China","2020-01-30 11:00:00","277","0","2","0","28.2282","112.9388"],
        ["Anhui","Mainland China","2020-01-30 11:00:00","200","0","2","0","31.8206","117.2272"],
        ["Chongqing","Mainland China","2020-01-30 11:00:00","182","0","1","0","29.4316","106.9123"],
        ["Jiangxi","Mainland China","2020-01-30 11:00:00","162","0","5","0","28.6829","115.8582"],
        ["Shandong","Mainland China","2020-01-30 11:00:00","158","0","1","0","36.6512","117.1201"],
        ["Sichuan","Mainland China","2020-01-30 11:00:00","142","0","1","1","30.5728","104.0668"],
        ["Jiangsu","Mainland China","2020-01-30 11:00:00","129","0","1","0","32.0603","118.7969"],
        ["Beijing","Mainland China","2020-01-30 11:00:00","114","0","4","1","39.9042","116.4074"],
        ["Shanghai","Mainland China","2020-01-30 11:00:00","112","0","5","1","31.2304","121.4737"],
        ["Fujian","Mainland China","2020-01-30 11:00:00","101","0","0","0","26.0745","119.2965"],
        ["Guangxi","Mainland China","2020-01-30 11:00:00","78","0","2","0","22.8170","108.3665"],
        ["Yunnan","Mainland China","2020-01-30 11:00:00","70","0","0","0","24.8801","102.8329"],
        ["Hebei","Mainland China","2020-01-30 11:00:00","65","0","0","1","38.0428","114.5149"],
        ["Shaanxi","Mainland China","2020-01-30 11:00:00","63","0","0","0","34.3416","108.9398"],
        ["Hainan","Mainland China","2020-01-30 11:00:00","46","0","1","1","20.0444","110.1983"],
        ["Heilongjiang","Mainland China","2020-01-30 11:00:00","44","0","0","2","45.8038","126.5350"],
        ["Liaoning","Mainland China","2020-01-30 11:00:00","41","0","1","0","41.8057","123.4315"],
        ["Shanxi","Mainland China","2020-01-30 11:00:00","35","0","1","0","37.8706","112.5489"],
        ["Tianjin","Mainland China","2020-01-30 11:00:00","31","0","0","0","39.3434","117.3616"],
        ["Gansu","Mainland China","2020-01-30 11:00:00","26","0","0","0","36.0611","103.8343"],
        ["Inner Mongolia","Mainland China","2020-01-30 11:00:00","19","0","0","0","40.8424","111.7500"],
        ["Ningxia","Mainland China","2020-01-30 11:00:00","17","0","0","0","38.4872","106.2309"],
        ["Jilin","Mainland China","2020-01-30 11:00:00","14","0","1","0","43.8171","125.3235"],
        ["Xinjiang","Mainland China","2020-01-30 11:00:00","14","0","0","0","43.8256","87.6168"],
        ["Guizhou","Mainland China","2020-01-30 11:00:00","12","0","1","0","26.6477","106.6302"],
        ["Hong Kong","Hong Kong","2020-01-30 11:00:00","10","0","0","0","22.3193","114.1694"],
        ["Taiwan","Taiwan","2020-01-30 11:00:00","9","0","0","0","25.0330","121.5654"],
        ["Qinghai","Mainland China","2020-01-30 11:00:00","8","0","0","0","36.6171","101.7782"],
        ["Macau","Macau","2020-01-30 11:00:00","7","0","0","0","22.1987","113.5439"],
        ["Tibet","Mainland China","2020-01-30 11:00:00","1","0","0","0","29.6548","91.1406"],
        ["Washington","US","2020-01-30 11:00:00","1","0","0","0","47.7511","-120.7400"],
        ["Illinois","US","2020-01-30 11:00:00","1","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-01-30 11:00:00","2","0","0","0","36.7783","-119.4170"],
        ["Arizona","US","2020-01-30 11:00:00","1","0","0","0","34.0489","-111.0937"],
        ["Tokyo","Japan","2020-01-30 11:00:00","11","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-30 11:00:00","14","0","5","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-30 11:00:00","4","0","0","0","37.5665","126.9780"],
        ["Singapore","Singapore","2020-01-30 11:00:00","10","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-30 11:00:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-30 11:00:00","5","0","0","0","48.8566","2.3522"],
        ["Kathmandu","Nepal","2020-01-30 11:00:00","1","0","0","0","27.7172","85.3240"],
        ["Kuala Lumpur","Malaysia","2020-01-30 11:00:00","8","0","0","0","3.1390","101.6869"],
        ["Ontario","Canada","2020-01-30 11:00:00","2","0","0","0","43.6532","-79.3832"],
        ["British Columbia","Canada","2020-01-30 11:00:00","1","0","0","0","49.2827","-123.1207"],
        ["Phnom Penh","Cambodia","2020-01-30 11:00:00","1","0","0","0","11.5564","104.9282"],
        ["Colombo","Sri Lanka","2020-01-30 11:00:00","1","0","0","0","6.9271","79.8612"],
        ["New South Wales","Australia","2020-01-30 11:00:00","4","0","2","0","-33.8688","151.2093"],
        ["Victoria","Australia","2020-01-30 11:00:00","2","0","0","0","-37.8136","144.9631"],
        ["Queensland","Australia","2020-01-30 11:00:00","3","0","0","0","27.4698","153.0251"],
        ["Bavaria","Germany","2020-01-30 11:00:00","4","0","0","0","48.1351","11.5820"],
        ["Helsinki","Finland","2020-01-30 11:00:00","1","0","0","0","60.1699","24.9384"],
        ["Abu Dhabi","United Arab Emirates","2020-01-30 11:00:00","4","0","0","0","24.4539","54.3773"],
        ["Manila","Philippines","2020-01-30 11:00:00","1","0","0","0","14.5995","120.9842"],
        ["New Delhi","India","2020-01-30 11:00:00","1","0","0","0","28.6139","77.2090"],
        ["Hubei","Mainland China","2020-01-30 21:30:00","5806","0","116","204","30.5928","114.3055"],
        ["Zhejiang","Mainland China","2020-01-30 21:30:00","537","0","9","0","30.2741","120.1551"],
        ["Guangdong","Mainland China","2020-01-30 21:30:00","393","0","11","0","23.1291","113.2644"],
        ["Henan","Mainland China","2020-01-30 21:30:00","352","0","3","2","34.7466","113.6253"],
        ["Hunan","Mainland China","2020-01-30 21:30:00","332","0","2","0","28.2282","112.9388"],
        ["Jiangxi","Mainland China","2020-01-30 21:30:00","240","0","7","0","28.6829","115.8582"],
        ["Anhui","Mainland China","2020-01-30 21:30:00","237","0","3","0","31.8206","117.2272"],
        ["Chongqing","Mainland China","2020-01-30 21:30:00","206","0","1","0","29.4316","106.9123"],
        ["Shandong","Mainland China","2020-01-30 21:30:00","178","0","2","0","36.6512","117.1201"],
        ["Sichuan","Mainland China","2020-01-30 21:30:00","177","0","1","1","30.5728","104.0668"],
        ["Jiangsu","Mainland China","2020-01-30 21:30:00","168","0","2","0","32.0603","118.7969"],
        ["Shanghai","Mainland China","2020-01-30 21:30:00","128","0","9","1","31.2304","121.4737"],
        ["Beijing","Mainland China","2020-01-30 21:30:00","121","0","5","1","39.9042","116.4074"],
        ["Fujian","Mainland China","2020-01-30 21:30:00","101","0","0","0","26.0745","119.2965"],
        ["Guangxi","Mainland China","2020-01-30 21:30:00","87","0","2","0","22.8170","108.3665"],
        ["Hebei","Mainland China","2020-01-30 21:30:00","82","0","0","1","38.0428","114.5149"],
        ["Yunnan","Mainland China","2020-01-30 21:30:00","76","0","0","0","24.8801","102.8329"],
        ["Shaanxi","Mainland China","2020-01-30 21:30:00","87","0","0","0","34.3416","108.9398"],
        ["Heilongjiang","Mainland China","2020-01-30 21:30:00","59","0","0","2","45.8038","126.5350"],
        ["Hainan","Mainland China","2020-01-30 21:30:00","50","0","1","1","20.0444","110.1983"],
        ["Liaoning","Mainland China","2020-01-30 21:30:00","45","0","1","0","41.8057","123.4315"],
        ["Shanxi","Mainland China","2020-01-30 21:30:00","39","0","1","0","37.8706","112.5489"],
        ["Tianjin","Mainland China","2020-01-30 21:30:00","32","0","0","0","39.3434","117.3616"],
        ["Gansu","Mainland China","2020-01-30 21:30:00","29","0","0","0","36.0611","103.8343"],
        ["Ningxia","Mainland China","2020-01-30 21:30:00","21","0","1","0","38.4872","106.2309"],
        ["Inner Mongolia","Mainland China","2020-01-30 21:30:00","20","0","0","0","40.8424","111.7500"],
        ["Xinjiang","Mainland China","2020-01-30 21:30:00","17","0","0","0","43.8256","87.6168"],
        ["Guizhou","Mainland China","2020-01-30 21:30:00","15","0","1","0","26.6477","106.6302"],
        ["Jilin","Mainland China","2020-01-30 21:30:00","14","0","1","0","43.8171","125.3235"],
        ["Hong Kong","Hong Kong","2020-01-30 21:30:00","12","0","0","0","22.3193","114.1694"],
        ["Taiwan","Taiwan","2020-01-30 21:30:00","9","0","0","0","25.0330","121.5654"],
        ["Qinghai","Mainland China","2020-01-30 21:30:00","8","0","0","0","36.6171","101.7782"],
        ["Macau","Macau","2020-01-30 21:30:00","7","0","0","0","22.1987","113.5439"],
        ["Tibet","Mainland China","2020-01-30 21:30:00","1","0","0","0","29.6548","91.1406"],
        ["Washington","US","2020-01-30 21:30:00","1","0","0","0","47.7511","-120.7400"],
        ["Illinois","US","2020-01-30 21:30:00","2","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-01-30 21:30:00","2","0","0","0","36.7783","-119.4170"],
        ["Arizona","US","2020-01-30 21:30:00","1","0","0","0","34.0489","-111.0937"],
        ["Tokyo","Japan","2020-01-30 21:30:00","11","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-30 21:30:00","14","0","5","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-30 21:30:00","6","0","0","0","37.5665","126.9780"],
        ["Singapore","Singapore","2020-01-30 21:30:00","10","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-30 21:30:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-30 21:30:00","5","0","0","0","48.8566","2.3522"],
        ["Kathmandu","Nepal","2020-01-30 21:30:00","1","0","0","0","27.7172","85.3240"],
        ["Kuala Lumpur","Malaysia","2020-01-30 21:30:00","8","0","0","0","3.1390","101.6869"],
        ["Ontario","Canada","2020-01-30 21:30:00","2","0","0","0","43.6532","-79.3832"],
        ["British Columbia","Canada","2020-01-30 21:30:00","1","0","0","0","49.2827","-123.1207"],
        ["Phnom Penh","Cambodia","2020-01-30 21:30:00","1","0","0","0","11.5564","104.9282"],
        ["Colombo","Sri Lanka","2020-01-30 21:30:00","1","0","0","0","6.9271","79.8612"],
        ["New South Wales","Australia","2020-01-30 21:30:00","4","0","2","0","-33.8688","151.2093"],
        ["Victoria","Australia","2020-01-30 21:30:00","2","0","0","0","-37.8136","144.9631"],
        ["Queensland","Australia","2020-01-30 21:30:00","3","0","0","0","27.4698","153.0251"],
        ["Bavaria","Germany","2020-01-30 21:30:00","4","0","0","0","48.1351","11.5820"],
        ["Helsinki","Finland","2020-01-30 21:30:00","1","0","0","0","60.1699","24.9384"],
        ["Abu Dhabi","United Arab Emirates","2020-01-30 21:30:00","4","0","0","0","24.4539","54.3773"],
        ["Manila","Philippines","2020-01-30 21:30:00","1","0","0","0","14.5995","120.9842"],
        ["New Delhi","India","2020-01-30 21:30:00","1","0","0","0","28.6139","77.2090"],
        ["Rome","Italy","2020-01-30 21:30:00","2","0","0","0","41.9028","12.4964"],
        ["Hubei","Mainland China","2020-01-31 14:00:00","5806","0","141","204","30.5928","114.3055"],
        ["Zhejiang","Mainland China","2020-01-31 14:00:00","538","0","14","0","30.2741","120.1551"],
        ["Guangdong","Mainland China","2020-01-31 14:00:00","436","0","11","0","23.1291","113.2644"],
        ["Henan","Mainland China","2020-01-31 14:00:00","352","0","3","2","34.7466","113.6253"],
        ["Hunan","Mainland China","2020-01-31 14:00:00","332","0","2","0","28.2282","112.9388"],
        ["Jiangxi","Mainland China","2020-01-31 14:00:00","240","0","7","0","28.6829","115.8582"],
        ["Anhui","Mainland China","2020-01-31 14:00:00","237","0","3","0","31.8206","117.2272"],
        ["Chongqing","Mainland China","2020-01-31 14:00:00","211","0","1","0","29.4316","106.9123"],
        ["Shandong","Mainland China","2020-01-31 14:00:00","184","0","2","0","36.6512","117.1201"],
        ["Sichuan","Mainland China","2020-01-31 14:00:00","177","0","1","1","30.5728","104.0668"],
        ["Jiangsu","Mainland China","2020-01-31 14:00:00","168","0","5","0","32.0603","118.7969"],
        ["Beijing","Mainland China","2020-01-31 14:00:00","139","0","5","1","39.9042","116.4074"],
        ["Shanghai","Mainland China","2020-01-31 14:00:00","135","0","9","1","31.2304","121.4737"],
        ["Fujian","Mainland China","2020-01-31 14:00:00","120","0","0","0","26.0745","119.2965"],
        ["Guangxi","Mainland China","2020-01-31 14:00:00","87","0","2","0","22.8170","108.3665"],
        ["Shaanxi","Mainland China","2020-01-31 14:00:00","87","0","0","0","34.3416","108.9398"],
        ["Yunnan","Mainland China","2020-01-31 14:00:00","83","0","1","0","24.8801","102.8329"],
        ["Hebei","Mainland China","2020-01-31 14:00:00","82","0","0","1","38.0428","114.5149"],
        ["Heilongjiang","Mainland China","2020-01-31 14:00:00","59","0","0","2","45.8038","126.5350"],
        ["Hainan","Mainland China","2020-01-31 14:00:00","52","0","1","1","20.0444","110.1983"],
        ["Liaoning","Mainland China","2020-01-31 14:00:00","48","0","1","0","41.8057","123.4315"],
        ["Shanxi","Mainland China","2020-01-31 14:00:00","39","0","1","0","37.8706","112.5489"],
        ["Tianjin","Mainland China","2020-01-31 14:00:00","32","0","0","0","39.3434","117.3616"],
        ["Guizhou","Mainland China","2020-01-31 14:00:00","29","0","2","0","26.6477","106.6302"],
        ["Gansu","Mainland China","2020-01-31 14:00:00","29","0","0","0","36.0611","103.8343"],
        ["Ningxia","Mainland China","2020-01-31 14:00:00","21","0","0","0","38.4872","106.2309"],
        ["Inner Mongolia","Mainland China","2020-01-31 14:00:00","20","0","1","0","40.8424","111.7500"],
        ["Xinjiang","Mainland China","2020-01-31 14:00:00","17","0","0","0","43.8256","87.6168"],
        ["Jilin","Mainland China","2020-01-31 14:00:00","14","0","1","0","43.8171","125.3235"],
        ["Hong Kong","Hong Kong","2020-01-31 14:00:00","12","0","0","0","22.3193","114.1694"],
        ["Taiwan","Taiwan","2020-01-31 14:00:00","10","0","0","0","25.0330","121.5654"],
        ["Qinghai","Mainland China","2020-01-31 14:00:00","8","0","0","0","36.6171","101.7782"],
        ["Macau","Macau","2020-01-31 14:00:00","7","0","0","0","22.1987","113.5439"],
        ["Tibet","Mainland China","2020-01-31 14:00:00","1","0","0","0","29.6548","91.1406"],
        ["Bankok","Thailand","2020-01-31 14:00:00","19","0","5","0","13.7563","100.5018"],
        ["Tokyo","Japan","2020-01-31 14:00:00","15","0","1","0","35.6762","139.6503"],
        ["Singapore","Singapore","2020-01-31 14:00:00","13","0","0","0","1.3521","103.8198"],
        ["Seoul","South Korea","2020-01-31 14:00:00","11","0","0","0","37.5665","126.9780"],
        ["Kuala Lumpur","Malaysia","2020-01-31 14:00:00","8","0","0","0","3.1390","101.6869"],
        ["Paris","France","2020-01-31 14:00:00","5","0","0","0","48.8566","2.3522"],
        ["Bavaria","Germany","2020-01-31 14:00:00","5","0","0","0","48.1351","11.5820"],
        ["New South Wales","Australia","2020-01-31 14:00:00","4","0","2","0","-33.8688","151.2093"],
        ["Abu Dhabi","United Arab Emirates","2020-01-31 14:00:00","4","0","0","0","24.4539","54.3773"],
        ["Victoria","Australia","2020-01-31 14:00:00","3","0","0","0","-37.8136","144.9631"],
        ["Illinois","US","2020-01-31 14:00:00","2","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-01-31 17:00:00","3","0","0","0","36.7783","-119.4170"],
        ["Hanoi","Vietnam","2020-01-31 14:00:00","2","0","0","0","21.0278","105.8342"],
        ["Ontario","Canada","2020-01-31 14:00:00","2","0","0","0","43.6532","-79.3832"],
        ["Queensland","Australia","2020-01-31 14:00:00","2","0","0","0","27.4698","153.0251"],
        ["Rome","Italy","2020-01-31 14:00:00","2","0","0","0","41.9028","12.4964"],
        ["Oxfordshire","UK","2020-01-31 14:00:00","2","0","0","0","51.7612","-1.2465"],
        ["Zabaikalsky ","Russia","2020-01-31 14:00:00","1","0","0","0","53.0929","116.9677"],
        ["Washington","US","2020-01-31 14:00:00","1","0","0","0","47.7511","-120.7400"],
        ["Arizona","US","2020-01-31 14:00:00","1","0","0","0","34.0489","-111.0937"],
        ["Kathmandu","Nepal","2020-01-31 14:00:00","1","0","0","0","27.7172","85.3240"],
        ["British Columbia","Canada","2020-01-31 14:00:00","1","0","0","0","49.2827","-123.1207"],
        ["Phnom Penh","Cambodia","2020-01-31 14:00:00","1","0","0","0","11.5564","104.9282"],
        ["Colombo","Sri Lanka","2020-01-31 14:00:00","1","0","0","0","6.9271","79.8612"],
        ["Helsinki","Finland","2020-01-31 14:00:00","1","0","0","0","60.1699","24.9384"],
        ["Manila","Philippines","2020-01-31 14:00:00","1","0","0","0","14.5995","120.9842"],
        ["New Delhi","India","2020-01-31 14:00:00","1","0","0","0","28.6139","77.2090"],
        ["Jönköping","Sweden","2020-01-31 14:00:00","1","0","0","0","57.7826","14.1618"],
        ["Tyumen","Russia","2020-01-31 14:00:00","1","0","0","0","57.1613","65.5250"],
        ["Hubei","Mainland China","2020-01-31 19:00:00","7153","0","169","249","30.5928","114.3055"],
        ["Zhejiang","Mainland China","2020-01-31 19:00:00","537","0","14","0","30.2741","120.1551"],
        ["Guangdong","Mainland China","2020-01-31 19:00:00","436","0","10","0","23.1291","113.2644"],
        ["Henan","Mainland China","2020-01-31 19:00:00","352","0","3","2","34.7466","113.6253"],
        ["Hunan","Mainland China","2020-01-31 19:00:00","332","0","3","0","28.2282","112.9388"],
        ["Jiangxi","Mainland China","2020-01-31 19:00:00","240","0","7","0","28.6829","115.8582"],
        ["Chongqing","Mainland China","2020-01-31 19:00:00","238","0","1","1","29.4316","106.9123"],
        ["Anhui","Mainland China","2020-01-31 19:00:00","237","0","3","0","31.8206","117.2272"],
        ["Shandong","Mainland China","2020-01-31 19:00:00","184","0","2","0","36.6512","117.1201"],
        ["Sichuan","Mainland China","2020-01-31 19:00:00","177","0","1","1","30.5728","104.0668"],
        ["Jiangsu","Mainland China","2020-01-31 19:00:00","168","0","5","0","32.0603","118.7969"],
        ["Shanghai","Mainland China","2020-01-31 19:00:00","153","0","9","1","31.2304","121.4737"],
        ["Beijing","Mainland China","2020-01-31 19:00:00","139","0","5","1","39.9042","116.4074"],
        ["Fujian","Mainland China","2020-01-31 19:00:00","120","0","0","0","26.0745","119.2965"],
        ["Hebei","Mainland China","2020-01-31 19:00:00","96","0","0","1","38.0428","114.5149"],
        ["Guangxi","Mainland China","2020-01-31 19:00:00","88","0","2","0","22.8170","108.3665"],
        ["Shaanxi","Mainland China","2020-01-31 19:00:00","87","0","0","0","34.3416","108.9398"],
        ["Yunnan","Mainland China","2020-01-31 19:00:00","83","0","1","0","24.8801","102.8329"],
        ["Liaoning","Mainland China","2020-01-31 19:00:00","60","0","1","0","41.8057","123.4315"],
        ["Heilongjiang","Mainland China","2020-01-31 19:00:00","59","0","0","2","45.8038","126.5350"],
        ["Hainan","Mainland China","2020-01-31 19:00:00","58","0","1","1","20.0444","110.1983"],
        ["Shanxi","Mainland China","2020-01-31 19:00:00","47","0","1","0","37.8706","112.5489"],
        ["Gansu","Mainland China","2020-01-31 19:00:00","35","0","0","0","36.0611","103.8343"],
        ["Tianjin","Mainland China","2020-01-31 19:00:00","32","0","0","0","39.3434","117.3616"],
        ["Guizhou","Mainland China","2020-01-31 19:00:00","29","0","2","0","26.6477","106.6302"],
        ["Ningxia","Mainland China","2020-01-31 19:00:00","21","0","1","0","38.4872","106.2309"],
        ["Inner Mongolia","Mainland China","2020-01-31 19:00:00","20","0","0","0","40.8424","111.7500"],
        ["Xinjiang","Mainland China","2020-01-31 19:00:00","17","0","0","0","43.8256","87.6168"],
        ["Jilin","Mainland China","2020-01-31 19:00:00","14","0","1","0","43.8171","125.3235"],
        ["Hong Kong","Hong Kong","2020-01-31 19:00:00","13","0","0","0","22.3193","114.1694"],
        ["Taiwan","Taiwan","2020-01-31 19:00:00","10","0","0","0","25.0330","121.5654"],
        ["Qinghai","Mainland China","2020-01-31 19:00:00","8","0","0","0","36.6171","101.7782"],
        ["Macau","Macau","2020-01-31 19:00:00","7","0","0","0","22.1987","113.5439"],
        ["Tibet","Mainland China","2020-01-31 19:00:00","1","0","0","0","29.6548","91.1406"],
        ["Washington","US","2020-01-31 19:00:00","1","0","0","0","47.7511","-120.7400"],
        ["Illinois","US","2020-01-31 19:00:00","2","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-01-31 19:00:00","3","0","0","0","36.7783","-119.4170"],
        ["Arizona","US","2020-01-31 19:00:00","1","0","0","0","34.0489","-111.0937"],
        ["Tokyo","Japan","2020-01-31 19:00:00","17","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-31 19:00:00","19","0","7","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-01-31 19:00:00","11","0","0","0","37.5665","126.9780"],
        ["Singapore","Singapore","2020-01-31 19:00:00","16","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-01-31 19:00:00","2","0","0","0","21.0278","105.8342"],
        ["Paris","France","2020-01-31 19:00:00","6","0","0","0","48.8566","2.3522"],
        ["Kathmandu","Nepal","2020-01-31 19:00:00","1","0","0","0","27.7172","85.3240"],
        ["Kuala Lumpur","Malaysia","2020-01-31 19:00:00","8","0","0","0","3.1390","101.6869"],
        ["Ontario","Canada","2020-01-31 19:00:00","2","0","0","0","43.6532","-79.3832"],
        ["British Columbia","Canada","2020-01-31 19:00:00","1","0","0","0","49.2827","-123.1207"],
        ["Phnom Penh","Cambodia","2020-01-31 19:00:00","1","0","0","0","11.5564","104.9282"],
        ["Colombo","Sri Lanka","2020-01-31 19:00:00","1","0","0","0","6.9271","79.8612"],
        ["New South Wales","Australia","2020-01-31 19:00:00","4","0","2","0","-33.8688","151.2093"],
        ["Victoria","Australia","2020-01-31 19:00:00","2","0","0","0","-37.8136","144.9631"],
        ["Queensland","Australia","2020-01-31 19:00:00","3","0","0","0","27.4698","153.0251"],
        ["Bavaria","Germany","2020-01-31 19:00:00","7","0","0","0","48.1351","11.5820"],
        ["Helsinki","Finland","2020-01-31 19:00:00","1","0","0","0","60.1699","24.9384"],
        ["Abu Dhabi","United Arab Emirates","2020-01-31 19:00:00","4","0","0","0","24.4539","54.3773"],
        ["Manila","Philippines","2020-01-31 19:00:00","1","0","0","0","14.5995","120.9842"],
        ["New Delhi","India","2020-01-31 19:00:00","1","0","0","0","28.6139","77.2090"],
        ["Rome","Italy","2020-01-31 19:00:00","2","0","0","0","41.9028","12.4964"],
        ["Jönköping","Sweden","2020-01-31 19:00:00","1","0","0","0","57.7826","14.1618"],
        ["Zabaikalsky ","Russia","2020-01-31 19:00:00","1","0","0","0","53.0929","116.9677"],
        ["Madrid","Spain","2020-01-31 19:00:00","1","0","0","0","40.4168","-3.7038"],
        ["Oxfordshire","UK","2020-01-31 19:00:00","2","0","0","0","51.7612","-1.2465"],
        ["Tyumen","Russia","2020-01-31 19:00:00","1","0","0","0","57.1613","65.5250"],
        ["Hubei","Mainland China","2020-02-01 10:00:00","7153","0","168","249","30.5928","114.3055"],
        ["Zhejiang","Mainland China","2020-02-01 10:00:00","599","0","21","0","30.2741","120.1551"],
        ["Guangdong","Mainland China","2020-02-01 10:00:00","535","0","14","0","23.1291","113.2644"],
        ["Henan","Mainland China","2020-02-01 10:00:00","422","0","3","2","34.7466","113.6253"],
        ["Hunan","Mainland China","2020-02-01 10:00:00","389","0","8","0","28.2282","112.9388"],
        ["Anhui","Mainland China","2020-02-01 10:00:00","297","0","5","0","31.8206","117.2272"],
        ["Jiangxi","Mainland China","2020-02-01 10:00:00","286","0","9","0","28.6829","115.8582"],
        ["Chongqing","Mainland China","2020-02-01 10:00:00","247","0","3","1","29.4316","106.9123"],
        ["Sichuan","Mainland China","2020-02-01 10:00:00","207","0","3","1","30.5728","104.0668"],
        ["Shandong","Mainland China","2020-02-01 10:00:00","206","0","3","0","36.6512","117.1201"],
        ["Jiangsu","Mainland China","2020-02-01 10:00:00","202","0","6","0","32.0603","118.7969"],
        ["Shanghai","Mainland China","2020-02-01 10:00:00","169","0","10","1","31.2304","121.4737"],
        ["Beijing","Mainland China","2020-02-01 10:00:00","168","0","9","1","39.9042","116.4074"],
        ["Fujian","Mainland China","2020-02-01 10:00:00","144","0","0","0","26.0745","119.2965"],
        ["Shaanxi","Mainland China","2020-02-01 10:00:00","101","0","0","0","34.3416","108.9398"],
        ["Guangxi","Mainland China","2020-02-01 10:00:00","100","0","2","0","22.8170","108.3665"],
        ["Hebei","Mainland China","2020-02-01 10:00:00","96","0","0","1","38.0428","114.5149"],
        ["Yunnan","Mainland China","2020-02-01 10:00:00","91","0","2","0","24.8801","102.8329"],
        ["Heilongjiang","Mainland China","2020-02-01 10:00:00","80","0","2","2","45.8038","126.5350"],
        ["Liaoning","Mainland China","2020-02-01 10:00:00","63","0","1","0","41.8057","123.4315"],
        ["Hainan","Mainland China","2020-02-01 10:00:00","62","0","1","1","20.0444","110.1983"],
        ["Shanxi","Mainland China","2020-02-01 10:00:00","47","0","1","0","37.8706","112.5489"],
        ["Tianjin","Mainland China","2020-02-01 10:00:00","38","0","0","0","39.3434","117.3616"],
        ["Gansu","Mainland China","2020-02-01 10:00:00","35","0","0","0","36.0611","103.8343"],
        ["Guizhou","Mainland China","2020-02-01 10:00:00","29","0","2","0","26.6477","106.6302"],
        ["Ningxia","Mainland China","2020-02-01 10:00:00","26","0","0","0","38.4872","106.2309"],
        ["Inner Mongolia","Mainland China","2020-02-01 10:00:00","23","0","1","0","40.8424","111.7500"],
        ["Xinjiang","Mainland China","2020-02-01 10:00:00","18","0","0","0","43.8256","87.6168"],
        ["Jilin","Mainland China","2020-02-01 10:00:00","17","0","1","0","43.8171","125.3235"],
        ["Hong Kong","Hong Kong","2020-02-01 10:00:00","13","0","0","0","22.3193","114.1694"],
        ["Taiwan","Taiwan","2020-02-01 10:00:00","10","0","0","0","25.0330","121.5654"],
        ["Qinghai","Mainland China","2020-02-01 10:00:00","9","0","0","0","36.6171","101.7782"],
        ["Macau","Macau","2020-02-01 10:00:00","7","0","0","0","22.1987","113.5439"],
        ["Tibet","Mainland China","2020-02-01 10:00:00","1","0","0","0","29.6548","91.1406"],
        ["Washington","US","2020-02-01 10:00:00","1","0","0","0","47.7511","-120.7400"],
        ["Illinois","US","2020-02-01 10:00:00","2","0","0","0","40.6331","-89.3985"],
        ["California","US","2020-02-01 10:00:00","3","0","0","0","36.7783","-119.4170"],
        ["Arizona","US","2020-02-01 10:00:00","1","0","0","0","34.0489","-111.0937"],
        ["Tokyo","Japan","2020-02-01 10:00:00","17","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-02-01 10:00:00","19","0","7","0","13.7563","100.5018"],
        ["Seoul","South Korea","2020-02-01 10:00:00","12","0","0","0","37.5665","126.9780"],
        ["Singapore","Singapore","2020-02-01 10:00:00","18","0","0","0","1.3521","103.8198"],
        ["Hanoi","Vietnam","2020-02-01 10:00:00","6","0","1","0","21.0278","105.8342"],
        ["Paris","France","2020-02-01 10:00:00","6","0","0","0","48.8566","2.3522"],
        ["Kathmandu","Nepal","2020-02-01 10:00:00","1","0","0","0","27.7172","85.3240"],
        ["Kuala Lumpur","Malaysia","2020-02-01 10:00:00","8","0","0","0","3.1390","101.6869"],
        ["Ontario","Canada","2020-02-01 10:00:00","3","0","0","0","43.6532","-79.3832"],
        ["British Columbia","Canada","2020-02-01 10:00:00","1","0","0","0","49.2827","-123.1207"],
        ["Phnom Penh","Cambodia","2020-02-01 10:00:00","1","0","0","0","11.5564","104.9282"],
        ["Colombo","Sri Lanka","2020-02-01 10:00:00","1","0","1","0","6.9271","79.8612"],
        ["New South Wales","Australia","2020-02-01 10:00:00","4","0","2","0","-33.8688","151.2093"],
        ["Victoria","Australia","2020-02-01 10:00:00","4","0","0","0","-37.8136","144.9631"],
        ["Queensland","Australia","2020-02-01 10:00:00","3","0","0","0","27.4698","153.0251"],
        ["South Australia","Australia","2020-02-01 10:00:00","1","0","0","0","-34.9285","138.6007"],
        ["Bavaria","Germany","2020-02-01 10:00:00","7","0","0","0","48.1351","11.5820"],
        ["Helsinki","Finland","2020-02-01 10:00:00","1","0","0","0","60.1699","24.9384"],
        ["Abu Dhabi","United Arab Emirates","2020-02-01 10:00:00","4","0","0","0","24.4539","54.3773"],
        ["Manila","Philippines","2020-02-01 10:00:00","1","0","0","0","14.5995","120.9842"],
        ["New Delhi","India","2020-02-01 10:00:00","1","0","0","0","28.6139","77.2090"],
        ["Rome","Italy","2020-02-01 10:00:00","2","0","0","0","41.9028","12.4964"],
        ["Jönköping","Sweden","2020-02-01 10:00:00","1","0","0","0","57.7826","14.1618"],
        ["Zabaikalsky ","Russia","2020-02-01 10:00:00","1","0","0","0","53.0929","116.9677"],
        ["Madrid","Spain","2020-02-01 10:00:00","1","0","0","0","40.4168","-3.7038"],
        ["Oxfordshire","UK","2020-02-01 10:00:00","2","0","0","0","51.7612","-1.2465"],
        ["Tyumen","Russia","2020-01-31 19:00:00","1","0","0","0","57.1613","65.5250"],
        ["Hubei","Mainland China","2020-02-01 11:53:00","7153","0","168","249","30.5928","114.3055"],
        ["Zhejiang","Mainland China","2020-02-01 10:53:00","599","0","21","0","30.2741","120.1551"],
        ["Guangdong","Mainland China","2020-02-01 14:23:00","535","0","14","0","23.1291","113.2644"],
        ["Henan","Mainland China","2020-02-01 01:52:00","422","0","3","2","34.7466","113.6253"],
        ["Hunan","Mainland China","2020-02-01 11:03:00","389","0","8","0","28.2282","112.9388"],
        ["Anhui","Mainland China","2020-02-01 13:33:00","297","0","5","0","31.8206","117.2272"],
        ["Jiangxi","Mainland China","2020-02-01 01:52:00","286","0","9","0","28.6829","115.8582"],
        ["Chongqing","Mainland China","2020-02-01 08:43:00","247","0","3","1","29.4316","106.9123"],
        ["Sichuan","Mainland China","2020-02-01 01:52:00","207","0","3","1","30.5728","104.0668"],
        ["Shandong","Mainland China","2020-02-01 07:51:00","206","0","3","0","36.6512","117.1201"],
        ["Jiangsu","Mainland China","2020-02-01 14:03:00","202","0","6","0","32.0603","118.7969"],
        ["Shanghai","Mainland China","2020-02-01 06:05:00","169","0","10","1","31.2304","121.4737"],
        ["Beijing","Mainland China","2020-02-01 09:17:00","168","0","9","1","39.9042","116.4074"],
        ["Fujian","Mainland China","2020-02-01 05:37:00","144","0","0","0","26.0745","119.2965"],
        ["Shaanxi","Mainland China","2020-02-01 05:37:00","101","0","0","0","34.3416","108.9398"],
        ["Guangxi","Mainland China","2020-02-01 01:52:00","100","0","2","0","22.8170","108.3665"],
        ["Hebei","Mainland China","2020-02-01 01:52:00","96","0","0","1","38.0428","114.5149"],
        ["Yunnan","Mainland China","2020-02-01 15:53:00","93","0","2","0","24.8801","102.8329"],
        ["Heilongjiang","Mainland China","2020-02-01 10:33:00","80","0","2","2","45.8038","126.5350"],
        ["Liaoning","Mainland China","2020-02-01 15:23:00","64","0","1","0","41.8057","123.4315"],
        ["Hainan","Mainland China","2020-02-01 08:43:00","62","0","1","1","20.0444","110.1983"],
        ["Shanxi","Mainland China","2020-02-01 01:52:00","47","0","1","0","37.8706","112.5489"],
        ["Tianjin","Mainland China","2020-02-01 15:43:00","41","0","0","0","39.3434","117.3616"],
        ["Gansu","Mainland China","2020-02-01 15:43:00","40","0","0","0","36.0611","103.8343"],
        ["Guizhou","Mainland China","2020-01-31 15:20:00","29","0","2","0","26.6477","106.6302"],
        ["Ningxia","Mainland China","2020-02-01 02:13:00","26","0","0","0","38.4872","106.2309"],
        ["Inner Mongolia","Mainland China","2020-02-01 05:37:00","23","0","1","0","40.8424","111.7500"],
        ["Tokyo","Japan","2020-02-01 18:53:00","20","0","1","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-31 10:37:00","19","0","5","0","13.7563","100.5018"],
        ["Xinjiang","Mainland China","2020-02-01 05:37:00","18","0","0","0","43.8256","87.6168"],
        ["Jilin","Mainland China","2020-02-01 01:52:00","17","0","1","0","43.8171","125.3235"],
        ["Singapore","Singapore","2020-02-01 05:37:00","16","0","0","0","1.3521","103.8198"],
        ["Hong Kong","Hong Kong","2020-02-01 05:37:00","13","0","0","0","22.3193","114.1694"],
        ["Seoul","South Korea","2020-02-01 10:43:00","12","0","0","0","37.5665","126.9780"],
        ["Taiwan","Taiwan","2020-01-31 15:20:00","10","0","0","0","25.0330","121.5654"],
        ["Qinghai","Mainland China","2020-02-01 05:37:00","9","0","0","0","36.6171","101.7782"],
        ["Kuala Lumpur","Malaysia","2020-01-31 08:15:00","8","0","0","0","3.1390","101.6869"],
        ["Bavaria","Germany","2020-02-01 18:33:00","8","0","0","0","48.1351","11.5820"],
        ["Macau","Macau","2020-01-31 08:15:00","7","0","0","0","22.1987","113.5439"],
        ["Paris","France","2020-02-01 01:52:00","6","0","0","0","48.8566","2.3522"],
        ["Hanoi","Vietnam","2020-02-01 07:38:00","6","0","1","0","21.0278","105.8342"],
        ["New South Wales","Australia","2020-02-01 18:12:00","4","0","2","0","-33.8688","151.2093"],
        ["Victoria","Australia","2020-02-01 18:12:00","4","0","0","0","-37.8136","144.9631"],
        ["Abu Dhabi","United Arab Emirates","2020-01-31 08:15:00","4","0","0","0","24.4539","54.3773"],
        ["Queensland","Australia","2020-02-01 18:12:00","3","0","0","0","27.4698","153.0251"],
        ["Ontario","Canada","2020-02-01 18:12:00","3","0","0","0","43.6532","-79.3832"],
        ["Rome","Italy","2020-01-31 08:15:00","2","0","0","0","41.9028","12.4964"],
        ["Zabaikalsky ","Russia","2020-01-31 16:13:00","2","0","0","0","53.0929","116.9677"],
        ["Oxfordshire","UK","2020-02-01 01:52:00","2","0","0","0","51.7612","-1.2465"],
        ["Chicago, IL","US","2020-02-01 19:43:00","2","0","0","0","40.6331","-89.3985"],
        ["South Australia","Australia","2020-02-01 18:12:00","1","0","0","0","-34.9285","138.6007"],
        ["Phnom Penh","Cambodia","2020-01-31 08:15:00","1","0","0","0","11.5564","104.9282"],
        ["British Columbia","Canada","2020-02-01 18:12:00","1","0","0","0","49.2827","-123.1207"],
        ["Helsinki","Finland","2020-01-31 08:15:00","1","0","0","0","60.1699","24.9384"],
        ["New Delhi","India","2020-01-31 08:15:00","1","0","0","0","28.6139","77.2090"],
        ["Tibet","Mainland China","2020-02-01 01:52:00","1","0","0","0","29.6548","91.1406"],
        ["Kathmandu","Nepal","2020-01-31 08:15:00","1","0","0","0","27.7172","85.3240"],
        ["Manila","Philippines","2020-02-01 17:43:00","1","0","0","0","14.5995","120.9842"],
        ["Madrid","Spain","2020-02-01 02:13:00","1","0","0","0","40.4168","-3.7038"],
        ["Colombo","Sri Lanka","2020-01-31 08:15:00","1","0","0","0","6.9271","79.8612"],
        ["Jönköping","Sweden","2020-02-01 02:13:00","1","0","0","0","57.7826","14.1618"],
        ["Boston, MA","US","2020-02-01 19:43:00","1","0","0","0","42.3601","-71.0589"],
        ["Los Angeles, CA","US","2020-02-01 19:53:00","1","0","0","0","34.0522","-118.2437"],
        ["Orange, CA","US","2020-02-01 19:53:00","1","0","0","0","33.7879","-117.8531"],
        ["Santa Clara, CA","US","2020-02-01 19:53:00","1","0","0","0","37.3541","-121.9552"],
        ["Seattle, WA","US","2020-02-01 19:43:00","1","0","0","0","47.7511","-120.7400"],
        ["Tempe, AZ","US","2020-02-01 19:43:00","1","0","0","0","33.4255","-111.9400"],
        ["Hubei","Mainland China","2020-02-01 11:33:00 PM","9074","0","0","294","30.5928","114.3055"],
        ["Zhejiang","Mainland China","2020-02-02 2:13:00 AM","661","0","0","0","30.2741","120.1551"],
        ["Guangdong","Mainland China","2020-02-02 1:23:00 AM","604","0","0","0","23.1291","113.2644"],
        ["Henan","Mainland China","2020-02-02 12:53:00 AM","493","0","0","2","34.7466","113.6253"],
        ["Hunan","Mainland China","2020-02-02 1:53:00 AM","463","0","0","0","28.2282","112.9388"],
        ["Anhui","Mainland China","2020-02-02 1:33:00 AM","340","0","0","0","31.8206","117.2272"],
        ["Jiangxi","Mainland China","2020-02-02 1:23:00 AM","333","0","0","0","28.6829","115.8582"],
        ["Chongqing","Mainland China","2020-02-01 11:43:00 PM","262","0","0","1","29.4316","106.9123"],
        ["Jiangsu","Mainland China","2020-02-02 1:13:00 AM","236","0","0","0","32.0603","118.7969"],
        ["Sichuan","Mainland China","2020-02-02 1:03:00 AM","231","0","0","1","30.5728","104.0668"],
        ["Shandong","Mainland China","2020-02-02 1:03:00 AM","225","0","0","0","36.6512","117.1201"],
        ["Beijing","Mainland China","2020-02-02 3:05:00 AM","183","0","0","1","39.9042","116.4074"],
        ["Shanghai","Mainland China","2020-02-02 12:23:00 AM","177","0","0","1","31.2304","121.4737"],
        ["Fujian","Mainland China","2020-02-02 3:43:00 AM","159","0","0","0","26.0745","119.2965"],
        ["Shaanxi","Mainland China","2020-02-02 3:23:00 AM","116","0","0","0","34.3416","108.9398"],
        ["Guangxi","Mainland China","2020-02-02 12:23:00 AM","111","0","0","0","22.817","108.3665"],
        ["Hebei","Mainland China","2020-02-02 2:53:00 AM","104","0","0","1","38.0428","114.5149"],
        ["Heilongjiang","Mainland China","2020-02-02 3:23:00 AM","95","0","0","2","45.8038","126.535"],
        ["Yunnan","Mainland China","2020-02-01 3:53:00 PM","93","0","0","0","24.8801","102.8329"],
        ["Liaoning","Mainland China","2020-02-01 3:23:00 PM","64","0","0","0","41.8057","123.4315"],
        ["Hainan","Mainland China","2020-02-02 1:03:00 AM","63","0","0","1","20.0444","110.1983"],
        ["Shanxi","Mainland China","2020-02-01 11:33:00 PM","56","0","0","0","37.8706","112.5489"],
        ["Tianjin","Mainland China","2020-02-02 2:03:00 AM","45","0","0","0","39.3434","117.3616"],
        ["Gansu","Mainland China","2020-02-01 3:43:00 PM","40","0","0","0","36.0611","103.8343"],
        ["Guizhou","Mainland China","2020-02-02 1:03:00 AM","38","0","0","0","26.6477","106.6302"],
        ["Ningxia","Mainland China","2020-02-02 1:43:00 AM","28","0","0","0","38.4872","106.2309"],
        ["Inner Mongolia","Mainland China","2020-02-02 3:43:00 AM","27","0","0","0","40.8424","111.75"],
        ["Jilin","Mainland China","2020-02-02 2:33:00 AM","23","0","0","0","43.8171","125.3235"],
        ["Xinjiang","Mainland China","2020-02-02 12:43:00 AM","21","0","0","0","43.8256","87.6168"],
        ["Tokyo","Japan","2020-02-01 6:53:00 PM","20","0","0","0","35.6762","139.6503"],
        ["Bankok","Thailand","2020-01-31 10:37:00 AM","19","0","0","0","13.7563","100.5018"],
        ["Singapore","Singapore","2020-02-02 1:03:00 AM","18","0","0","0","1.3521","103.8198"],
        ["Seoul","South Korea","2020-02-02 2:23:00 AM","15","0","0","0","37.5665","126.978"],
        ["Hong Kong","Hong Kong","2020-02-02 1:03:00 AM","14","0","0","0","22.3193","114.1694"],
        ["Taiwan","Taiwan","2020-01-31 3:20:00 PM","10","0","0","0","25.033","121.5654"],
        ["Qinghai","Mainland China","2020-02-01 5:37:00 AM","9","0","0","0","36.6171","101.7782"],
        ["Bavaria","Germany","2020-02-01 11:33:00 PM","8","0","0","0","48.1351","11.582"],
        ["Kuala Lumpur","Malaysia","2020-01-31 8:15:00 AM","8","0","0","0","3.139","101.6869"],
        ["Macau","Macau","2020-01-31 8:15:00 AM","7","0","0","0","22.1987","113.5439"],
        ["Paris","France","2020-02-01 1:52:00 AM","6","0","0","0","48.8566","2.3522"],
        ["Hanoi","Vietnam","2020-02-01 7:38:00 AM","6","0","0","0","21.0278","105.8342"],
        ["New South Wales","Australia","2020-02-01 6:12:00 PM","4","0","0","0","-33.8688","151.2093"],
        ["Victoria","Australia","2020-02-01 6:12:00 PM","4","0","0","0","-37.8136","144.9631"],
        ["Abu Dhabi","United Arab Emirates","2020-01-31 8:15:00 AM","4","0","0","0","24.4539","54.3773"],
        ["Queensland","Australia","2020-02-01 6:12:00 PM","3","0","0","0","27.4698","153.0251"],
        ["Ontario","Canada","2020-02-01 6:12:00 PM","3","0","0","0","43.6532","-79.3832"],
        ["Rome","Italy","2020-01-31 8:15:00 AM","2","0","0","0","41.9028","12.4964"],
        ["Manila","Philippines","2020-02-02 3:33:00 AM","2","0","0","1","14.5995","120.9842"],
        ["Zabaikalsky","Russia","2020-01-31 4:13:00 PM","2","0","0","0","53.0929","116.9677"],
        ["Oxfordshire","UK","2020-02-01 1:52:00 AM","2","0","0","0","51.7612","-1.2465"],
        ["Chicago, IL","US","2020-02-01 7:43:00 PM","2","0","0","0","40.6331","-89.3985"],
        ["South Australia","Australia","2020-02-01 6:12:00 PM","1","0","0","0","-34.9285","138.6007"],
        ["Phnom Penh","Cambodia","2020-01-31 8:15:00 AM","1","0","0","0","11.5564","104.9282"],
        ["British Columbia","Canada","2020-02-01 6:12:00 PM","1","0","0","0","49.2827","-123.1207"],
        ["Helsinki","Finland","2020-01-31 8:15:00 AM","1","0","0","0","60.1699","24.9384"],
        ["New Delhi","India","2020-01-31 8:15:00 AM","1","0","0","0","28.6139","77.209"],
        ["Tibet","Mainland China","2020-02-01 1:52:00 AM","1","0","0","0","29.6548","91.1406"],
        ["Kathmandu","Nepal","2020-01-31 8:15:00 AM","1","0","0","0","27.7172","85.324"],
        ["Madrid","Spain","2020-02-01 11:43:00 PM","1","0","0","0","40.4168","-3.7038"],
        ["Colombo","Sri Lanka","2020-01-31 8:15:00 AM","1","0","0","0","6.9271","79.8612"],
        ["Jönköping","Sweden","2020-02-01 2:13:00 AM","1","0","0","0","57.7826","14.1618"],
        ["Boston, MA","US","2020-02-01 7:43:00 PM","1","0","0","0","42.3601","-71.0589"],
        ["Los Angeles, CA","US","2020-02-01 7:53:00 PM","1","0","0","0","34.0522","-118.2437"],
        ["Orange, CA","US","2020-02-01 7:53:00 PM","1","0","0","0","33.7879","-117.8531"],
        ["Santa Clara, CA","US","2020-02-01 7:53:00 PM","1","0","0","0","37.3541","-121.9552"],
        ["Seattle, WA","US","2020-02-01 7:43:00 PM","1","0","0","0","47.7511","-120.74"],
        ["Tempe, AZ","US","2020-02-01 7:43:00 PM","1","0","0","0","33.4255","-111.94"]
        


    ];

    var realdata = {};
    realdata['objects'] = [];
    rawdata.forEach(d => {
        var tmp = {};
        tmp['data'] = [parseFloat(d[7]), parseFloat(d[8]), parseInt(d[3]), parseInt(d[4]),
        parseInt(d[5]), parseInt(d[6]), d[0], d[1], d[2]];
        realdata['objects'].push(tmp);
    })
    // console.log(realdata)
    return realdata;
}// end getrealdata




// get the link of SARS reports from the website of WHO 
function getwhosarsdatalinks() {

    var url = "https://www.who.int/csr/sars/country/en/";
    //https://api.jquery.com/jquery.get/



    var getlinks = d3.html(url, d => {

        // console.log(d)

        // turn the dom (d) into a d3 object
        var thedomobj = d3.select(d)
        // console.log(thedomobj)

        // var thedombody = thedomobj.select('body') // not work
        //  console.log(thedombody)

        // the first ul contains the target li elements
        var theul = thedomobj.select('ul.auto_archive')
        // console.log(theul)

        // the first ul contains the target li elements
        var theli_d3objs = theul.selectAll('li')
        // console.log(theli_d3objs)
        var thelidoms = theli_d3objs.nodes()
        // console.log(thelidoms)

        var thelinks = []
        var thelinks_csvstr = "id" + ", " + "\"datestr\"" + "," + "\"url\"" + "\n";
        var i = 1
        thelidoms.forEach(e => {
            var thelink = d3.select(e).select('a')
            // console.log(thelink)
            // console.log(thelink.text())
            // console.log(thelink.attr("href"))

            // ***optiuon1. push reuslts by property
            function option1() {
                var tmp0 = {};
                tmp0.datestr = thelink.text()
                tmp0.link = "https://www.who.int" + thelink.attr("href")
                // run getdailydata and push the result data into the filed tmp0.data
                // getdailydata(tmp0.link)
                thelinks.push(tmp0)
            }
            //** option2: save as a csv format */
            var thelinkstr = "https://www.who.int" + thelink.attr("href");
            function option2(i) {
                var thecsvrowstr = i   // id of the link
                    + ", " + "\"" + thelink.text() + "\""  // the report date in string
                    + ", " + "\"" + thelinkstr + "\""
                thelinks_csvstr = thelinks_csvstr + thecsvrowstr + "\n"
                // fetch table data from the link
            }

            option2(i)
            if (i > -1) { // the if here is to control whether run for all days or a particular day or a few
                //run the function to get daily data and save as csv files at data/sars
                getdailydata(thelinkstr, i)
            }

            i = i + 1
        }) // end loop for each link

        // console.log(thelinks_csvstr)

        // post the str to php, and save on the server
        var targetphp = 'php/phptotxt.php',
            srcfilestr = thelinks_csvstr, // the str in csv format
            targetfilename = 'reports.csv' // the name of the csv

        // save the list of report files as a csv at data/sars
        saveToserverbyPHP(srcfilestr, targetfilename, targetphp)

        //

    }) // end d3.html

} // end function getwhosarsdatalinks()


/* 
 Getting data 

 1. colnames in  tbody.thead, or in tbody.tr1  ==> check the collection of doms '<thead>'
        {if .length>0 : col names from thead cells; if 0: col names from the first row of tbody cells}
 2. data in tr.<p>, or in tr.<b> ===> get the .innerText

 3. different col numbers and names
  
*/


// var thelink1 = 'https://www.who.int/csr/sars/country/table/en/'
// var thelink2 = 'https://www.who.int/csr/sars/country/2003_03_28/en/'
// var thelink3 = 'https://www.who.int/csr/sars/country/2003_07_11/en/'

/* 
Principle on when to get as a d3 obj, when as an array of html doms
1. To get all the children components, get the parent as a d3 obj. (e.g., pd3.selectAll('tr'))
2. To loop for all children, get the childen as an array of htmlDOMs. (so as to use .forEach())
*/
function getdailydata(thelink, id) {
    // console.log(thelink)
    d3.html(thelink, d => {

        // console.log(d)
        var thedomobj = d3.select(d)

        // init the colnames
        var colnames = []
        var targetset = []

        // test if there is a dom 'thead'
        var thetablehead = thedomobj.select('thead')
        var theaddomelength = thetablehead.nodes().length

        // if theaddomelength >0, get colnames from thead
        if (theaddomelength > 0) {

            //get a collection of tds of the first row of the thead
            var theadcelldoms = thedomobj.select('thead').select('tr').selectAll('td').nodes()
            // console.log(theadcelldoms)

            theadcelldoms.forEach(d => {
                colnames.push(d.innerText)
            })
            // console.log(colnames)
        }


        // get the table dom as a d3 obj
        var thetablebody = thedomobj.select('tbody')
        // console.log(thetablebody)

        // // get the rows
        var therowdoms = thetablebody.selectAll('tr').nodes()
        // console.log(therowdoms)

        //loop for each row
        var i = 0; // count the number of rows
        therowdoms.forEach(r => {
            // console.log(r)
            var thetrs_d3 = d3.select(r)
            // console.log(thetrs_d3)

            //get the cell doms        
            var thecelldoms = thetrs_d3.selectAll('td').nodes()
            // console.log(thecelldoms)

            // if column names have not be defined (not in <thead>), and it is the first row
            // save the contents as the colnames

            if (i === 0 && colnames.length === 0) {
                thecelldoms.forEach(c => {
                    // console.log(c)
                    colnames.push(c.innerText)
                })
            } else { // if the colname have been defined, save the data into a tmp obj, and push it into the final data array
                var tmp = {}, j = 0;
                thecelldoms.forEach(c => {
                    // save data into the target field, like tmp['country'] = 'Vietnam'
                    tmp[colnames[j]] = c.innerText
                    j = j + 1
                })
                // after the loop of all cells (in a row) is done, push the tmp into the target set
                //
                targetset.push(tmp)
            }

            // loop for each cell, push values into an array
            thecelldoms.forEach(c => {
                // console.log(c)
                // console.log(c.innerText)
            })

            i = i + 1; // accrual of row numbers

        }) // end of loop for rows

        // console.log(targetset)
        //save the targetset as data of the tmp0 from the parent function

        // the target data set is in a sort of obj with propoerties 
        //(e.g., [{countr:'..', cases:'..'},{countr:'..', cases:'..'}...)

        //change the targetset into a csv str
        var thedailydatastr = '';
        // append the column names as the first row
        var i = 0;
        var rowstr = '';
        colnames.forEach(d => {
            if (i === 0) {
                rowstr = "\"" + d + "\"";
            } else {
                rowstr = rowstr + "," + "\"" + d + "\"";
            }
            i = i + 1;
        })
        thedailydatastr = thedailydatastr + rowstr + "\n";

        targetset.forEach(d => {

            var rowstr = '';
            var i = 0;
            // loop for each property (value of column names)
            colnames.forEach(e => {
                if (i === 0) {
                    rowstr = "\"" + d[e] + "\"";
                } else {
                    rowstr = rowstr + "," + "\"" + d[e] + "\"";
                }
                i = i + 1;
            })
            // append the whole row str to thedailydatastr with a "\n"'
            thedailydatastr = thedailydatastr + rowstr + '\n'

        })

        // console.log(thedailydatastr)
        // post the data to php, and save on the server as a csv file
        var targetphp = 'php/phptotxt.php',
            srcfilestr = thedailydatastr, // the str in csv format
            targetfilename = id + '.csv' // the name of the csv

        // save the list of report files as a csv at data/sars
        saveToserverbyPHP(srcfilestr, targetfilename, targetphp)

    }); // end of d3.htmnl() 

}// end function getdailydata()


//Run the following the get the link and save the SARS daily data.
// getwhosarsdatalinks();





// to post data to the php file
function saveToserverbyPHP(srcfilestr, targetfilename, targetphp) {

    var
        v1 = srcfilestr,
        v2 = targetfilename;
    tosend = {
        thesrcstr: v1,
        targetfilename: v2
    }

    // Post the json data to a php file, and receive response text echoed on that php file
    //https://api.jquery.com/jQuery.post/
    // The jquery way is simply to specify: 1) the target php, 2) the name of the json data 3) the data type.

    var jqxhr = $.post(
        targetphp,
        tosend,
        'json'
    )
        // the following is to return the contents printed on the target php, so that user can 
        // moniter whether the target php runs normally or having errors.
        .done(function (d) {
            console.log('On targetphp:\n' + d);
        }) // end post

}
