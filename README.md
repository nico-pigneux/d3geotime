based on:

Google Maps + D3
https://bl.ocks.org/mbostock/899711

Map using leaflet.js
http://bl.ocks.org/d3noob/9267535

d3 plotting on map (using Observable instead of plain js)
https://observablehq.com/@sfu-iat355/intro-to-leaflet-d3-interactivity

d3 timeline and play button
http://bl.ocks.org/cmdoptesc/fc0e318ce7992bed7ca8
https://bl.ocks.org/officeofjane/47d2b0bfeecfcb41d2212d06d095c763

V11

Rearrange layout
try to fix incomplete loading issue for csv files (not sure if the problem has been solved)

branch v10
add line chart comparing NV and SARS cases

branch v9
add functions to download SARS data from WHO
change the handle label (make it align right when reaching the end)
change the function checking the point to stop playing, fixed the original bug (in sliderupdate())

branch v8
adding stacked bars using Tauchart.

branch v7
rearranged legends

as branch v6

work around the bug: on mouseclick, the time inset shift to right:
It is caused by the transform of the time line bar (shift to right for the distance of margin.left)
The following is done to work around the problem:
1. set margin-left of the bigbox div =  50px
2. set margin.left = 0
3. change the handle label's text anchor to 'left'. (That way, the label won't be covered by the left border of the parent svg)
4. shortern the timeline bar, leaving enough space to display the handle label as it moves to the right end.



