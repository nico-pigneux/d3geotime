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
    
    //plan changed as the report time for each batch is unqiue, no need to check gps
    // in fact checking gps could be wrong (California appears as diff place in diff reports
    // was california as a state, but later broken down into counties)

    // get the most recent time
    var Recent3=[]

    if (dataArray.length > 1) {
        var maxtime = dataArray[dataArray.length-1].time 
        // console.log(maxtime)


        dataArray.forEach(d => {
            // console.log(maxtime.unix())
            // console.log(d.time.unix())
            //d.time is not the same as maxtime, but the unix() is the same. Stupid momnetjs!
            if (d.time.unix() === maxtime.unix()) {
                Recent3.push(d)
            }
        })

        // console.log(Recent3)
        // var maxtime = Math.max.apply(Math, recent.map(function(o) { return o.time; }))
        // console.log(maxtime)
    }
    
    return Recent3

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
}// end getrecent




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

function  AddSARSlabel () {
    // on the SARS chart area, add a div as label : "SARS 8437 cases/813 deaths"
    setTimeout(d => {

        // find g elements containing line graphics (there are 2, one for nv, one for SARS)
        var linegraphs = d3.selectAll('g.tau-chart__area.area.i-role-path.tau-chart__line-opacity-2.frame').nodes()
        // console.log(linegraphs)

        // select the second g, which is for SARS
        var sarschart = d3.select(linegraphs[1])
        // console.log(sarschart)

        //Within the second g, add a g for SARS label
        var sarslabelg = sarschart.append('g')//.insert('g', ":first-child")
            .attrs({
                "class": "sarslabelg"
            })
            .attr("transform", "translate(950,180)") // push it to the center of the SARS graphic area

        // add the label as a foreignObject: xhtml : div
        var sarslabelbox = sarslabelg
            .append('foreignObject').attr('width', '600').attr('height', '600')
            .append('xhtml:div')
            .style("width", "600px")
            .style("height", "600px")
            .styles({
                "font-family": "Bebas Neue",
                "font-size": "60px",
                "color": "grey",
                "opacity": "0.5"
            })
            .style('border-style', "none")
            .html('<span style="font-size:40px;">SARS-2003</span><span style="font-size:20px">(confrimed cases/deaths):</span><br /><strong>8437/813</strong>')
    }, 6000)
}


function  AddNVlabel (thefig) {

    var conf= thefig[0], dece=thefig[1];
    // on the NV chart area, add a div as label : "NV 8437 cases/813 deaths"
    setTimeout(d => {

        // find g elements containing line graphics (there are 2, one for nv, one for NV)
        var linegraphs = d3.selectAll('g.tau-chart__area.area.i-role-path.tau-chart__line-opacity-2.frame').nodes()
        // console.log(linegraphs)

        // select the second g, which is for NV
        var NVchart = d3.select(linegraphs[0])
        // console.log(NVchart)

        //Within the second g, add a g for NV label
        var NVlabelg = NVchart.append('g')//.insert('g', ":first-child")
            .attrs({
                "class": "NVlabelg"
            })
            .attr("transform", "translate(100,180)") // push it to the center of the NV graphic area

        // add the label as a foreignObject: xhtml : div
        var NVlabelbox = NVlabelg
            .append('foreignObject').attr('width', '600').attr('height', '600')
            .append('xhtml:div')
            .style("width", "600px")
            .style("height", "600px")
            .styles({
                "font-family": "Bebas Neue",
                "font-size": "60px",
                "color": "grey",
                "opacity": "1"
            })
            .style('border-style', "none")
            .html('<span style="font-size:40px;">New virus (2019-nCoV)</span><span style="font-size:20px;">(confrimed cases/deaths):</span><br /><span style="color:red;" ><strong  id="nvlabel1">'+conf+'</strong ></span><span style="color:black;"><strong  id="nvlabel2">/'+dece+'</strong></span>')
    }, 6000)
}
