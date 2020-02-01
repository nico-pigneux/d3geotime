var moving = false;
var currentValue = 0;
var targetValue = width - margin.right;

/* calculate the speed for playing:
  the whole distance of the timeline bar is 'targetValue'
  within that distance, it should travel from the startDate to endDate
*/
var lengthOfPlay = endDate - startDate; // in ms (1 day = 24*60*60*1000 ms)
// console.log(lengthOfPlay/60/60/1000/24)
// if it is to play at 6 hours per step, then it'll took 
var nSteps = (lengthOfPlay / 1000 / 60 / 60) / hoursPerInterval;
nSteps = Math.floor(nSteps)
// Given that the whole distance of the timeline bar is 'targetValue'
// each step will take the distance of:
var distancePerStep = targetValue / nSteps;

//define the timeline scale 
var x = d3.scaleTime()
  .domain([startDate, endDate])
  .range([0, targetValue])
  .clamp(true);

// define the slider g component
var slider = slidersvg.append("g")
  .attr("class", "slider")
  .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

// add the timeline track
slider.append("line")
  .attr("class", "track")
  .attr("x1", x.range()[0])
  .attr("x2", x.range()[1])
  // the following can be taken out
  // .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
  // .attr("class", "track-inset")
  // .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
  // .attr("class", "track-overlay")
  ;


// add timeline ticks
var theticks = slider.insert("g", ".track-overlay")
  .attr("class", "ticks")
  .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(x.ticks(10))
  .enter()
  .append("text")
  .attr("x", x)
  .attr("y", 10)
  .attr("text-anchor", "middle")
  // .text(function (d) { return formatDateIntoYear(d); });
  .text(function (d) { return formatDateYMD(d); });

// add a handle for sliding 
var handle = slider.insert("circle", ".track-overlay")
  .attr("class", "handle")
  .attr("r", 9)
  ;

// add a label to indicate the current time
var label = slider.append("text")
  .attr("class", "handlelabel")
  .attr("text-anchor", "left")
  .text(formatDateYMDH(startDate))
  .attr("transform", "translate(0," + (-25) + ")")