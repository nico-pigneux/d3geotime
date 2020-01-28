
//load data, prepare (format it), and make 
d3.csv(srcdata, prepare, function (data) {

    // update the value of dataset
    dataset = data;
  
    // draw plots using data in dataset
    drawPlot(dataset);
  
    //listen to the playbutton events
    playButton
      .on("click", function () {
        var button = d3.select(this);
        if (button.text() == "Pause") {
          moving = false;
          clearInterval(timer);
          // timer = 0;
          button.text("Play");
        } else {
          moving = true;
          timer = setInterval(step, speedInMSPerStep); // the time (in ms) to take per step of play
          button.text("Pause");
        }
        console.log("Slider moving: " + moving);
      })
  })

// listen to the slide events
slider.call(d3.drag()
  .on("start.interrupt", function () { slider.interrupt(); })
  .on("start drag", function () {
    currentValue = d3.event.x;
    sliderupdate(x.invert(currentValue));
  })
);
