based on 

d3 plotting on map
https://observablehq.com/@sfu-iat355/intro-to-leaflet-d3-interactivity


d3 timeline and play button
https://bl.ocks.org/officeofjane/47d2b0bfeecfcb41d2212d06d095c763


as branch v6

work around the bug: on mouseclick, the time inset shift to right:
It is caused by the transform of the time line bar (shift to right for the distance of margin.left)
The following is done to work around the problem:
1. set margin-left of the bigbox div =  50px
2. set margin.left = 0
3. change the handle label's text anchor to 'left'. (That way, the label won't be covered by the left border of the parent svg)
4. shortern the timeline bar, leaving enough space to display the handle label as it moves to the right end.



