
/* To have a line chart comparing the progress of 2019NV cases with that of 2013 SARS cases
[{time: , confirmed:, death: recovered: }
]

read SARS 
report dates
===========================> read individual SARS 
                                reort and get data
                            ==========================> merge with 2019 NV data
                                                        ==========================> make line chart

*/

function makelinechart1() {
    var sars = []
    // get the dates
    d3.csv('data/sars/reports.csv', d => {
        // console.log(d)
        var keys = Object.keys(d)
        // get the last key, which is the column names

        var indexOfcolnames = keys[keys.length - 1]
        var colnames = d[indexOfcolnames]
        // console.log(colnames)
        var col1name = colnames[0]
        var col2name = colnames[1]

        var sarsreportdates = []
        d.forEach(e => {
            // console.log(e[col2name]) // the name of the column2 is indeed " "datestr""
            var tmp = {}
            tmp.id = parseInt(e[col1name])
            // console.log(e[col2name])
            // handle datestr
            var thestr = e[col2name]
            // trim heading and trailing whitespace
            thestr = thestr.trim()
            //remove quotes
            thestr = thestr.replace(/\"/g, "")
            var da = thestr.split(" ")
            // console.log(da)
            var y = da[2]//
            var y = 2020 // make a psuedo year
            var m = da[1]
            var dd = da[0]
            var dstr = y + "-" + m + "-" + dd
            // console.log(dstr)

            tmp.time = moment(dstr, "YYYY-MMMM-D")
            tmp.timestr = formatDateYMD(tmp.time)
            // tmp.timestr = formatDateMD(tmp.time)
            // console.log(tmp)
            sarsreportdates.push(tmp)
        })
        // console.log(sarsreportdates)

        // layer2 get SARSData
        // var sars = []
        for (var i = 1; i < 97; i++) {
            getSARSData(i, sarsreportdates)
        }

    })



    //get data from individual csv files
    function getSARSData(id, sarsreportdates) {
        d3.csv('data/sars/' + id + '.csv', d => {
            // console.log(d)

            var keys = Object.keys(d)

            // get the last key, which is the column names
            var indexOfcolnames = keys[keys.length - 1]
            var colnames = d[indexOfcolnames]

            // the column name of the first column
            var col1name = colnames[0]
            // console.log(col1name)
            var col2name = colnames[1]
            // console.log(col2name)
            d.forEach(e => {
                var col1 = e[col1name].trim().toUpperCase()
                // removing heading and trailing space
                if (col1.includes("TOTAL")) {
                    // get the # of cases
                    var count = parseInt(e[col2name].trim())
                    var tmp = {}
                    // order matters latter merging with nv data
                    tmp.time = sarsreportdates[id - 1].time
                    tmp.timestr = formatDateYMD(tmp.time)
                    // tmp.timestr = formatDateMD(tmp.time)
                    tmp.count = count
                    tmp.group = 'sars'
                    // tmp.id = id
                    // lookup the report time by id

                    sars.push(tmp)

                    // if (id === 96) {
                    //     // console.log(sars)
                    //     console.log(sars)
                    //     // layer 3
                    //     // get nv data and make chart
                    //     mergenvsars(sars)
                    // }

                    // wait until all 96 csv files are loaed
                    // do {
                    //     setTimeout(function(){ console.log(sars.length); }, 500);
                    //     // wait for 0.5 sec

                    // } while (sars.length < 95)
                    if (sars.length === 96) {
                        console.log(sars)
                        mergenvsars(sars)
                    }
                }
            })
        })
    }


    function mergenvsars(sarsdata) {
        // get nv data
        var data = dataset;

        // console.log(data)

        // summarize the confirmed cases by time (for all reporting dates)
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

        // console.log(newdata1)

        // make the chart
        lchart(newdata1, 'linetotal', lchart1a)
    }

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


    function lchart(thedata, chartboxid, chartbox) {

        chartbox.select('div.tau-chart__layout').remove();

        new Taucharts.Chart({
            data: thedata, //data(),
            type: 'area',
            x: 'time',//'longitude', //'time4',
            y: 'count', //'latitude', //'count',
            color: 'group',
            //text: 'place',
            size: 'count', //'count',
            split: 'group',
            // color: 'direction',
            guide: {
                showGridLines: 'x',
                x: { nice: false },
                y: { nice: false }
                // ,
                // size: {
                //     func: 'linear'
                //     ,
                //     minSize: 1,
                //     maxSize: 12
                // }
                ,
                color: {
                    brewer: {
                        // 'nv': 'rgba(0,0,0,0)', // use transparent color for workaround
                        'nv': 'rgba(255,0,0, 1)',//#FF0000,
                        'sars': 'rgba(110,110,110, 0.5)'
                    }
                }
            },
            plugins: [
                // tauCharts.api.plugins.get('legend')(),
                Taucharts.api.plugins.get('tooltip')()
            ]

        }).renderTo('#' + chartboxid);

        // format ticks
        //    var theticklabels = d3.selectAll('g.tick').select('text')
        //    theticklabels.text(d=>{
        //     //    console.log(d)
        //        //format d
        //        return d
        //    })
        //    console.log(theticklabels)


    }// function linchart

} // makelinechart1
