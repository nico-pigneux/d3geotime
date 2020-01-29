
function prepare(d) {
  d.id = d.id;
  d.date = parseDate(d.date);
  return d;
}

function step() {

  sliderupdate(x.invert(currentValue));
  // currentValue = currentValue + (targetValue / 151); 
  currentValue = currentValue + distancePerStep;
  if (currentValue > targetValue) {
    moving = false;
    currentValue = 0;
    clearInterval(timer);
    // timer = 0;
    playButton.text("Play");
    console.log("Slider moving: " + moving);
  }
}

// draw plots 
function drawPlot(data) {

  // within plot(a g ele), bind data
  var locations = bigg.selectAll(".location").data(data);

  // add circle to the plot
  // if filtered dataset has more circles than already existing, transition new ones in
  locations.enter()
    .append("circle")
    .attr("class", "location")
    .attr("cx", function (d) { return x(d.date); })
    .attr("cy", height / 2)
    // change style according to date values
    // .style("fill", function(d) { return d3.hsl(d.date/1000000000, 0.8, 0.8)})
    // .style("stroke", function(d) { return d3.hsl(d.date/1000000000, 0.7, 0.7)})
    .style("opacity", 0.5)
    .attr("r", 8)
    .transition()
    .duration(400)
    // .attr("r", 25) // this is to have the animation effect, i.e., first enlarge it to r of 25, then shrink it to r of 8
    // .transition()
    // .attr("r", 8);

  //remove excessive components
  // if filtered dataset has less circles than already existing, remove excess
  locations.exit()
    .remove();
}

function sliderupdate(h) {
  // update position and text of label according to slider scale
  handle.attr("cx", x(h));
  label
    .attr("x", x(h))
    .text(formatDateYMDH(h));
  
  // filter data set and redraw plot
  // var newData = dataset.filter(function (d) {
  var newData = dataset.filter(function (d) {
    // console.log(d)
    return d.time < h;
  })

  displayNodes(newData);
  
}