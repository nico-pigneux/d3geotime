
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
    }, 3000)
}