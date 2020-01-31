// document.getElementById("currenttimestamp").innerHTML = Date()

//title
var thebody = d3.select('body');
thebody.append('h1')
    .styles({
        "text-align": "center"
    })
    .text("Cases of choronavirus (2019-nCoV) infection in the world")
    .append('span')
    .attrs({ "id": "currenttimestamp" })
    .styles({
        "font-size": "12px",
        "font-weight": "normal"
    })
    .html('<br />   as of ' + Date())

// subtitle: github link
thebody.append('h3')
    .styles({
        "text-align": "center"
    })
    .append('a')
    .attrs({
        "href": "https://github.com/ShenzhenYAO/d3geotime/tree/v6",
        "target": '_blank'
    })
    .text("Github: https://github.com/ShenzhenYAO/d3geotime/tree/")

// a big box to hold everthing
var thebigbox = thebody.append('div')
    .attrs({ "class": "bigbox" })
    .styles({
        "border-style": "none",
        "margin-left": "50px",
        "margin-top": "50px"
    })
//the map area
var themaparea = thebigbox.append('div')
    .attrs({ "class": "maparea", "id": "maparea"  })
    .styles({

        "border-style":"solid", 
        "border-width":"1px", 
        "border-color":"lightblue",
        "display": "inline-block",
        "position": "relative"
    })

var sliderbox = themaparea.append('div')
    .attrs({ "class": "sliderbox", "id": "sliderbox"  })
    .styles({
        "width":"900",
        "border-style":"none", 
        "border-width":"0px", 
        "display": "inline-block",
        "position": "relative"
    })

// add a svg to hold slider components    
var slidersvg =sliderbox
    .append("svg")
    .attr("width", width + margin.left + margin.right )
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "slidersvg")
    ;

//add a play button
var playbuttonbox = themaparea.append('div')
    .styles({
    "width":"100px",
    "height":"100px", 
    "display": "inline-block",
    "position": "relative",
    "vertical-align": "top"
});
var playButton = playbuttonbox.append('button')
    .attrs({ "id": "play-button" })
    .text("Play")

// add a div box to hold the map
var mapbox = themaparea.append('div')
    .attrs({
        "id": "map"
    })
    .styles({
        "width": "1000px",
        "height": "500px"
    })
    ;
// add a box to hold legends
var legendbox =  themaparea.append('div')
    .attrs({"id": "legendbox"})
    .styles({"border-style":"solid","border-width":"0px", "border-color":"lightblue"})
var legendsvg=legendbox.append('svg').attrs({"class":"legendsvg", "width":"1000px", "height":"100px"})


var i =0
var offset
// add legend circle
rcats.forEach(d=>{
    legendsvg.append('g')
        .attr("class", 'legendcircleg')
        .attr("transform", ()=>{
        if (i===0){
            offseth = 50;
        } else {
            offseth = i * 100//offseth + (rcats[i-1] + rcats[i])*4 +20
        }
        var offsetv = rcats[rcats.length-1] - d + 40
        // console.log(i)
        return "translate (" + (offseth) + "," + offsetv +")"
    })
    .append('circle').attrs({"class":"legendcircle"}).attr("r", d)
    ;

    i=i+1;
})

// add legend circle text
var i=0;
legendsvg.selectAll('g.legendcircleg').nodes().forEach(d=>{
    d3.select(d).append('text').text("confirmed").attr("class", "circlelegendtext")
    .attr("dy", ()=>{
        var offsetv =  40 -(rcats[rcats.length-1] - rcats[i])
        return offsetv
    })
    .attr("text-anchor", "middle")
    i=i+1;
})

// add rect g
var i =0
var offset
// add legend rect
scats.forEach(d=>{
    legendsvg.append('g')
        .attr("class", 'legendrectg')
        .attr("transform", ()=>{
        if (i===0){
            offseth = 550;
        } else {
            offseth = i * 100+500//offseth + (rcats[i-1] + rcats[i])*4 +20
        }
        var offsetv = scats[scats.length-1] - d + 50
        // console.log(i)
        return "translate (" + (offseth) + "," + offsetv +")"
    })
    .append('rect').attrs({"class":"legendrect"}).attr("width", d).attr("height", d)
    ;
    i=i+1;
})

// add legend rect text
var i=0;
legendsvg.selectAll('g.legendrectg').nodes().forEach(d=>{
    d3.select(d).append('text')
    .text(d=>{
        if (i ===0) {
            return "death:1"
        } else if (i ===1){
            return "2-54"
        } else {
            return "55+"
        }
    }).attr("class", "rectlegendtext")
    .attr("dy", ()=>{
        var offsetv =  40 -(rcats[rcats.length-1] - rcats[i])
        return offsetv
    })
    .attr("text-anchor", "middle")
    i=i+1;
})
               

//the youtubebox
var theyoutubebox = thebigbox.append('div')
    .attrs({ "class": "youtubebox" })
    .styles({
        "margin-left": "50px",
        "display": "inline-block",
        "position": "relative",
        "vertical-align": "top"
    });

//title of the video
theyoutubebox.append('span').html('number of confirmed cases<br />')
    .styles({
        // "font-family":"Source Sans Pro",
        "font-weight":"400",
        "font-size":"15px"
    }) //<br /><br /><br /><br /><br />
theyoutubebox.append('span').attrs({"id":"totalconfirmed"})
    .styles({
        "font-family":"Bebas Neue",
        "font-size":"160px", 
        'font-weight': 'bold',
        'color':"red"
    })
theyoutubebox.append('span').html('<br />number of death<br />')
.styles({
    // "font-family":"Source Sans Pro",
    "font-weight":"400",
    "font-size":"15px"
}) //<br /><br /><br /><br /><br />
theyoutubebox.append('span').attrs({"id":"totaldeath"})
    .styles({
        "font-family":"Bebas Neue",
        "font-size":"160px",
        'font-weight': 'bold',
        'color':"black"
    })

// // the youtube iframe
// theyoutubebox.append('iframe')
//     .attrs({
//         "width": "560",
//         "height": "315",
//         "src": "https://www.youtube.com/embed/8gliqTh3Sig",
//         "frameborder": "0",
//         "allow": "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
//         "allowfullscreen": null
//     })
//     .styles({
//         "margin-left": "0px",
//         "display": "inline-block",
//         "position": "relative",
//         "vertical-align": "top"
//     })

// links to download of data
theyoutubebox
    .append("xhtml:a")
    .attr("href", "./data/cases.csv")
    .html("<br /><br /><br />download cases.csv")
    ;

// insert a box for charts
var chartbox = thebody.append('div')
.attrs({ 
    "class": "chartbox",
    "id":"charts"
})
.styles({
    "border-style": "none",
    "margin-left": "50px",
    "width":"1000px"
    // "height":"1500px"
})
;

var hchart1 = chartbox.append('div')
.attrs({ 
    "class": "byplaceholder",
})
.styles({
    // "border-style": "solid",
    "width":"1000px",
    // "height":'100px',
    "display": "inline-block",
    "position": "relative"
    // "resize": "both",
    // "overflow": "auto",
    // "border-width":"1px"
})
.html("<h2>Number of confirmed and death cases in Mainland China, and Hubei (including Wuhan)</h2>")
;
// the idea is to delete the box each time so that Tauchart won't creaet the same div again and again...
var hchart1a = hchart1.append('div')
.attrs({ 
    "class": "hstack",
    "id":"cnhubi"
})
.styles({
    "border-style": "solid",
    "border-color":"lightblue",
    "width":"1000px",
    "height":'250px',
    // "resize": "both",
    // "overflow": "auto",
    "border-width":"1px"
})
;

var hchart2 = chartbox.append('div')
.attrs({ 
    "class": "byplaceholder",
})
.styles({
    // "border-style": "solid",
    "width":"1000px",
    // "resize": "both",
    // "overflow": "auto",
    // "border-width":"1px",
})
.html("<h2>Number of confirmed and death cases in Mainland China (except Hubei)</h2>")
;
// the idea is to delete the box each time so that Tauchart won't creaet the same div again and again...
var hchart2a = hchart2.append('div')
.attrs({ 
    "class": "hstack",
    "id":"elsecn"
})
.styles({
    "border-style": "solid",
    "border-color":"lightblue",
    "width":"1000px",
    "height":'700px',
    // "resize": "both",
    // "overflow": "auto",
    "border-width":"1px"
})
;

var hchart3 = chartbox.append('div')
.attrs({ 
    "class": "byplaceholder",
})
.styles({
    // "border-style": "solid",
    "width":"1000px",
    // "resize": "both",
    // "overflow": "auto",
    // "border-width":"1px",
})
.html("<h2>Number of confirmed and death cases outside Mainland China</h2>")
;
// the idea is to delete the box each time so that Tauchart won't creaet the same div again and again...
var hchart3a = hchart3.append('div')
.attrs({ 
    "class": "hstack",
    "id":"outcn"
})
.styles({
    "border-style": "solid",
    "border-color":"lightblue",
    "width":"1000px",
    "height":'600px',
    // "resize": "both",
    // "overflow": "auto",
    "border-width":"1px"
})
;


// copyright box
var thefootnotebox = thebody.append('div')
    .styles({"margin-top":"100px"})
thefootnotebox.append("p")
.html(`
        <strong>Copyright (c) 2020 Shenzhen YAO</strong> 
`)

thefootnotebox.append("p")
.html(`
            <strong>Reference:<br /> </strong> 
            <br />
            1. https://observablehq.com/@sfu-iat355/intro-to-leaflet-d3-interactivity<br />
            2. leaflet provider
            (https://raw.githubusercontent.com/leaflet-extras/leaflet-providers/master/leaflet-providers.j )<br />
            3. d3.slider.js (http://bl.ocks.org/cmdoptesc/raw/fc0e318ce7992bed7ca8/d3.slider.js )<br />
            4. rest_777.txt (http://bl.ocks.org/cmdoptesc/raw/fc0e318ce7992bed7ca8/rest_777.txt )<br />
            5. d3.slider.css (http://bl.ocks.org/cmdoptesc/raw/fc0e318ce7992bed7ca8/d3.slider.css )<br />
            6. novel coronavirus case data from
            https://docs.google.com/spreadsheets/d/1yZv9w9zRKwrGTaR-YzmAqMefw4wMlaXocejdxZaTs6w/htmlview?usp=sharing&sle=true<br />
            7. https://bl.ocks.org/officeofjane/47d2b0bfeecfcb41d2212d06d095c763 <br />
        </p>
`)

