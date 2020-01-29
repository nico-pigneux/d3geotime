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

// add g for plotting circles
var sliderg = slidersvg.append("g")
    .attr("class", "sliderg")
  .attr("class", "leaflet-zoom-hide")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
//add a play button
var playButton = themaparea.append('button')
    .attrs({"id":"play-button"})
    .text("Play")

// add a div box to hold the map
var mapbox = themaparea.append('div')
    .attrs({
        "id": "map"
    })
    .styles({
        "width":"1000px",
        "height": "600px"
    })
;

function nt(){
//the youtubebox
var theyoutubebox = thebigbox.append('div')
    .attrs({ "class": "youtubebox" })
    .styles({
        "margin-left": "50px",
        "display": "inline-block",
        "position": "relative",
        "vertical-align":"top"
});

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

