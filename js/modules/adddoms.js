// document.getElementById("currenttimestamp").innerHTML = Date()

//title
var thebody = d3.select('body');
thebody.append('h1')
    .styles({
        "text-align": "center"
    })
    .text("The cases of novel choronavirus infection")
    .append('span')
    .attrs({ "id": "currenttimestamp" })
    .styles({
        "font-size": "12px",
        "font-weight": "normal"
    })
    .html('   as of ' + Date())

// subtitle: github link
thebody.append('h3')
    .styles({
        "text-align": "center"
    })
    .append('a')
    .attrs({
        "href": "https://github.com/ShenzhenYAO/d3geotime/tree/d3leafletmap16",
        "target": '_blank'
    })
    .text("Github: https://github.com/ShenzhenYAO/d3geotime/tree/d3leafletmap16")

// a big box to hold everthing
var thebigbox = thebody.append('div')
    .attrs({ "class": "bigbox" })
    .styles({
        "border-style": "none",
    })
//the map area
var themaparea = thebigbox.append('div')
    .attrs({ "class": "maparea", "id": "vis" })
    .styles({
        "border-style": "none",
        "display": "inline-block",
        "position": "relative"
    })
    
//add a play button
var playButton = themaparea.append('button')
    .attrs({"id":"play-button"})
    .text("Play")

function nt(){
//the youtubebox
var theyoutubebox = thebigbox.append('div')
    .attrs({ "class": "youtubebox" })
    .styles({
        "margin-left": "50px",
        "display": "inline-block",
        "position": "relative",
        "vertical-align":"top"
    })
//title of the video
theyoutubebox.append('h2').text('How to view it')
// the youtube iframe
theyoutubebox.append('iframe')
    .attrs({ 
        "width": "560",
        "height": "315" ,
        "src": "https://www.youtube.com/embed/8gliqTh3Sig" ,
        "frameborder": "0", 
        "allow": "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
        "allowfullscreen": null
    })
    .styles({
        "margin-left": "50px",
        "display": "inline-block",
        "position": "relative",
        "vertical-align":"top"
    })
}

// add a svg to hold slider and map    
var svg = d3.select("#vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

// add g for plotting circles
var plot = svg.append("g")
  .attr("class", "plot")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
