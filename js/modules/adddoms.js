// document.getElementById("currenttimestamp").innerHTML = Date()

//title
var thebody = d3.select('body');
thebody.append('h1')
    .styles({
        "text-align": "center"
    })
    .text("Cases of the novel choronavirus infection in the world")
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
        "height": "600px"
    })
    ;

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

// copyright box
var thefootnotebox = thebody.append('div')
    .styles({"margin-top":"100px"})
thefootnotebox.append("p")
.html(`
            <strong>Copyright (c) 2020<br /> Shenzhen YAO</strong> 

            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:

            The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.

            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
`)

thefootnotebox.append("p")
.html(`<br /><br /><br />
            <strong>Reference:<br /> </strong> 
            <br />
            1. https://observablehq.com/@sfu-iat355/intro-to-leaflet-d3-interactivity<br />
            2. leaflet provider
            (https://raw.githubusercontent.com/leaflet-extras/leaflet-providers/master/leaflet-providers.j )<br />
            3. d3.slider.js (http://bl.ocks.org/cmdoptesc/raw/fc0e318ce7992bed7ca8/d3.slider.js )<br />
            4. rest_777.txt (http://bl.ocks.org/cmdoptesc/raw/fc0e318ce7992bed7ca8/rest_777.txt )<br />
            5. d3.slider.css (http://bl.ocks.org/cmdoptesc/raw/fc0e318ce7992bed7ca8/d3.slider.css )<br />
            6. novel coronavirus case data from
            https://docs.google.com/spreadsheets/d/169AP3oaJZSMTquxtrkgFYMSp4gTApLTTWqo25qCpjL0/edit#gid=2116154334<br />
            7. https://bl.ocks.org/officeofjane/47d2b0bfeecfcb41d2212d06d095c763 <br />
        </p>
`)

