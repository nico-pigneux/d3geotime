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
        "margin-left": "50px"
    })
//the map area
var themaparea = thebigbox.append('div')
    .attrs({ "class": "maparea", "id": "maparea" })
    .styles({
        "border-style": "none",
        "display": "inline-block",
        "position": "relative"
    })

// add a svg to hold slider components    
var slidersvg = d3.select("#maparea")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "slidersvg")
    ;

//add a play button
var playbuttonbox = themaparea.append('div')
    .styles({"height":"50px"})
    ;
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
var legendsvg=legendbox.append('svg').attrs({"class":"legendsvg", "width":"1000px"})


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
            offseth = 50;
        } else {
            offseth = i * 100//offseth + (rcats[i-1] + rcats[i])*4 +20
        }
        var offsetv = scats[scats.length-1] - d + 100
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
theyoutubebox.append('h2').html('<br /><br /><br /><br /><br />How to view it')
// the youtube iframe
theyoutubebox.append('iframe')
    .attrs({
        "width": "560",
        "height": "315",
        "src": "https://www.youtube.com/embed/8gliqTh3Sig",
        "frameborder": "0",
        "allow": "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
        "allowfullscreen": null
    })
    .styles({
        "margin-left": "0px",
        "display": "inline-block",
        "position": "relative",
        "vertical-align": "top"
    })

    theyoutubebox
    .append("xhtml:a")
    .attr("href", "./data/cases.csv")
    .html("<br /><br /><br />download cases.csv")
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

