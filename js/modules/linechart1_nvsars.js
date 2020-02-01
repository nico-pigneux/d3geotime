
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
var sars=[]
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
        var y =2020 // make a psuedo year
        var m = da[1]
        var dd = da[0]
        var dstr = y + "-" + m + "-" + dd
        // console.log(dstr)

        tmp.time = moment(dstr, "YYYY-MMMM-D")        
        tmp.timestr = formatDateYMD(tmp.time)
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
                tmp.time=sarsreportdates[id-1].time
                tmp.timestr = formatDateYMD(tmp.time)
                tmp.count = count
                tmp.group = 'sars'
                // tmp.id = id
                // lookup the report time by id
                
                sars.push(tmp)
                
                if (id === 96) {
                    // console.log(sars)
    
                // console.log(sars)                

                    // layer 3
                    // get nv data and make chart
                   mergenvsars(sars)
                } 
            }
        })
    })
}

function mergenvsars(sarsdata) {
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
    var alldata=[]
    nvdata.forEach(d=>{
        alldata.push(d)
    })
    Array.prototype.push.apply(alldata,sarsdata);

    //sort by time, then by count 
    alldata.sort(function(a, b) {
        return a["timestr"] - b["timestr"] || a["count"] - b["count"];
    }).reverse();

    // for each day point, keep a unique record (of the highest count)
    var timepoints = []
    var newdata1 = [] 
    alldata.forEach(d=>{
        if (! timepoints.includes(d.timestr)){
            timepoints.push(d.timestr)
            newdata1.push(d)
        }
    })

    var i=1
    newdata1.reverse().forEach(d=>{
        d.time = new Date(d.timestr + 'T00:00Z') 
        // d.time2 =moment(d.timestr + " 00:00:00", "YYYY-MM-DD HH:mm:ss") // moment obj are not compatible with taucharts
        d.id=i
        i=i+1
    })

    //   console.log(newdata1)

    // make the chart
    lchart(newdata1, 'linetotal', lchart1a )
}


function lchart( thedata, chartboxid, chartbox ) {

    chartbox.select('div.tau-chart__layout').remove();

    new Taucharts.Chart({
        data: thedata, //data(),
        type: 'line',
        x: 'time',//'longitude', //'time4',
        y: 'count', //'latitude', //'count',
        color:'group',
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
            // ,
            // color: {
            //     brewer: {
            //         'nv': 'rgba(0,0,0,0)', // use transparent color for workaround
            //         'nv2': '#FF0000',
            //         'nv': '#000000'
            //     }
            // }
        },
        plugins: [
            // tauCharts.api.plugins.get('legend')(),
            Taucharts.api.plugins.get('tooltip')()
        ]

    }).renderTo('#'+chartboxid);

// format ticks
//    var theticklabels = d3.selectAll('g.tick').select('text')
//    theticklabels.text(d=>{
//     //    console.log(d)
//        //format d
//        return d
//    })
//    console.log(theticklabels)
 

}// function linchart

//https://api.taucharts.com/basic/line.html
function data() {
	return [
        [24.0, 55.0,   4000, 'P', '0', 'Kowno'],
        [25.3, 54.7,   4000, 'P', '0', 'Wilna'],
        [26.4, 54.4,   4000, 'P', '0', 'Smorgon'],
        [26.8, 54.3,   4000, 'P', '0', 'Molodechno'],
        [27.7, 55.2,   4000, 'P', '0', 'Gloubokoe'],
        [27.6, 53.9,   4000, 'P', '0', 'Minsk'],
        [28.5, 54.3,   4000, 'P', '0', 'Studienska'],
        [28.7, 55.5,   4000, 'P', '0', 'Polotzk'],
        [29.2, 54.4,   4000, 'P', '0', 'Bobr'],
        [30.2, 55.3,   4000, 'P', '0', 'Vitebsk'],
        [30.4, 54.4,   4000, 'P', '0', 'Orscha'],
        [30.4, 53.9,   4000, 'P', '0', 'Mohilow'],
        [32.0, 54.8,   4000, 'P', '0', 'Smolensk'],
        [34.3, 55.2,   4000, 'P', '0', 'Wixma'],
        [34.4, 55.5,   4000, 'P', '0', 'Chjat'],
        [36.0, 55.5,   4000, 'P', '0', 'Mojaisk'],
        [37.6, 55.8,   4000, 'P', '0', 'Moscow'],
        [36.6, 55.3,   4000, 'P', '0', 'Tarantino'],
        [36.5, 55.0,   4000, 'P', '0', 'Malo-jarosewli'],

        [24.0, 54.9, 340000, 'A', '1'],
        [24.5, 55.0, 340000, 'A', '1'],
        [25.5, 54.5, 340000, 'A', '1'],
        [26.0, 54.7, 320000, 'A', '1'],
        [27.0, 54.8, 300000, 'A', '1'],
        [28.0, 54.9, 280000, 'A', '1'],
        [28.5, 55.0, 240000, 'A', '1'],
        [29.0, 55.1, 210000, 'A', '1'],
        [30.0, 55.2, 180000, 'A', '1'],
        [30.3, 55.3, 175000, 'A', '1'],
        [32.0, 54.8, 145000, 'A', '1'],
        [33.2, 54.9, 140000, 'A', '1'],
        [34.4, 55.5, 127100, 'A', '1'],
        [35.5, 55.4, 100000, 'A', '1'],
        [36.0, 55.5, 100000, 'A', '1'],
        [37.6, 55.8, 100000, 'A', '1'],
        [37.7, 55.7, 100000, 'R', '1'],
        [37.5, 55.7,  98000, 'R', '1'],
        [37.0, 55.0,  97000, 'R', '1'],
        [36.6, 55.0,  96000, 'R', '1'],
        [36.8, 55.0,  96000, 'R', '1'],
        [35.4, 55.3,  87000, 'R', '1'],
        [34.3, 55.2,  55000, 'R', '1'],
        [33.3, 54.8,  37000, 'R', '1'],
        [32.0, 54.6,  24000, 'R', '1'],
        [30.4, 54.4,  20000, 'R', '1'],
        [29.2, 54.3,  20000, 'R', '1'],
        [28.5, 54.2,  20000, 'R', '1'],
        [28.3, 54.3,  20000, 'R', '1'],
        [27.5, 54.5,  20000, 'R', '1'],
        [26.8, 54.3,  12000, 'R', '1'],
        [26.4, 54.4,  14000, 'R', '1'],
        [25.0, 54.4,   8000, 'R', '1'],
        [24.4, 54.4,   4000, 'R', '1'],
        [24.2, 54.4,   4000, 'R', '1'],
        [24.1, 54.4,   4000, 'R', '1'],
        [24.0, 55.1,  60000, 'A', '2'],
        [24.5, 55.2,  60000, 'A', '2'],
        [25.5, 54.7,  60000, 'A', '2'],
        [26.6, 55.7,  40000, 'A', '2'],
        [27.4, 55.6,  33000, 'A', '2'],
        [28.7, 55.5,  33000, 'A', '2'],
        [28.7, 55.5,  33000, 'R', '2'],
        [28.5, 54.15, 30000, 'R', '2'],
        [28.3, 54.25, 28000, 'R', '2'],
        [24.0, 55.2,  22000, 'A', '3'],
        [24.5, 55.3,  22000, 'A', '3'],
        [24.6, 55.8,   6000, 'A', '3'],
        [24.6, 55.8,   6000, 'R', '3'],
        [24.2, 54.4,   6000, 'R', '3'],
        [24.1, 54.4,   6000, 'R', '3']
    ].map(function (row) {
            var ar = {
                P: 'Place',
                A: 'Advance',
                R: 'Retreat'
            };
            return {
                longitude: row[0],
                latitude: row[1],
                survivors: row[2],
                direction: ar[row[3]],
                group: row[4],
                place: row[5]
            };
        });
}

