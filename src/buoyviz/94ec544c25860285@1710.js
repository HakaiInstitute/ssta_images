// https://observablehq.com/@mbrownshoes/how-i-start-maps-in-d3@1710
function _1(md){return(
md`# How I start maps in D3

`
)}

function _2(md){return(
md`
## Starting with a geojson file ...

Upload the geojson to mapshaper and in the console and run *proj wgs84*. This will convert the it to the [WGS 84](https://spatialreference.org/ref/epsg/wgs-84/) (lat long), coordinate reference system which we can then project to whatever we want using D3 magic.

The file used in the example that follows was already in WGS 84 so no conversion was necessary. 

Then, export the file as topojson for easy plotting in D3. Converting to [topojson](https://github.com/topojson/topojson) also significantly reduced the files size. If the file is large you can also simplify in mapshaper to further reduce the size. 

`
)}

function _BC_Midres(FileAttachment){return(
FileAttachment("BC_Midres_latlngTOPO.json").json()
)}

function _topojson(require){return(
require('topojson')
)}

function _d3(require){return(
require("d3@5", "d3-array@2")
)}

function _6(topojson,BC_Midres){return(
topojson.feature(BC_Midres, BC_Midres.objects.BC_Midres_latlng).features
)}

function _stations(){return(
[
  { station: "C46004", lat: 50.94, lon: -135.87 },
  { station: "C46036", lat: 48.3, lon: -133.86 },
  { station: "C46131", lat: 49.91, lon: -124.99 },
  { station: "C46132", lat: 49.74, lon: -127.93 },
  { station: "C46134", lat: 48.66, lon: -123.48 },
  { station: "C46145", lat: 54.38, lon: -132.42 },
  { station: "C46146", lat: 49.34, lon: -123.73 },
  { station: "C46147", lat: 51.83, lon: -131.23 },
  { station: "C46181", lat: 53.82, lon: -128.84 },
  { station: "C46182", lat: 49.48, lon: -123.29 },
  { station: "C46183", lat: 53.57, lon: -131.14 },
  { station: "C46184", lat: 53.92, lon: -138.85 },
  { station: "C46185", lat: 52.42, lon: -129.79 },
  { station: "C46204", lat: 51.38, lon: -128.77 },
  { station: "C46205", lat: 54.3, lon: -133.4 },
  { station: "C46206", lat: 48.83, lon: -126 },
  { station: "C46207", lat: 50.88, lon: -129.91 },
  { station: "C46208", lat: 52.51, lon: -132.69 }
]
)}

function _8(md){return(
md`
### Da map
`
)}

function _exampleMap(d3,width,topojson,BC_Midres,stations)
{
  const height = 500;
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  // BC Alberts projection
  const projection = d3.geoAlbers().rotate([126, 0]);

  projection.fitSize(
    [width, height],
    topojson.feature(BC_Midres, BC_Midres.objects.BC_Midres_latlng)
  );

  // generate the shapes we want - this case bc
  const path = d3.geoPath().projection(projection);

  // create the svg of our features
  svg
    .append("g")
    .selectAll("path")
    .data(
      topojson.feature(BC_Midres, BC_Midres.objects.BC_Midres_latlng).features
    )
    .join("path")
    .attr("d", path)
    .attr("fill", "#f3f3f3");

  // Add stations!
  svg
    .selectAll("circle")
    .data(stations)
    .join("circle")
    .attr("r", 4)
    .attr("transform", function (d) {
      // Project our stations to the same projeciton as our map!
      return `translate(${projection([d.lon, d.lat])})`;
    })
    .attr("opacity", 0.8)
    .attr("fill", function (d) {
      return "steelblue";
    })
    .attr("stroke", "#aaa");

  return svg.node();
}


function _10(p,stations){return(
p([stations[0].lon, stations[0].lat])
)}

function _11(stations){return(
stations[0]
)}

function _p(d3){return(
d3.geoAlbers().rotate([126, -10])
)}

function _13(md){return(
md`
<br>

<br>
<br>

## Appendix


`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["BC_Midres_latlngTOPO.json",new URL("./files/7ba550b22fdb22cba9fed3326a51f513cf291d8ea63f9db45879b66641f3935ce23bb2fa199e89c9fca8abcc84e39c72ed6a9e2ade12d479badfd9ce5e1b9044",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("BC_Midres")).define("BC_Midres", ["FileAttachment"], _BC_Midres);
  main.variable(observer("topojson")).define("topojson", ["require"], _topojson);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer()).define(["topojson","BC_Midres"], _6);
  main.variable(observer("stations")).define("stations", _stations);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("exampleMap")).define("exampleMap", ["d3","width","topojson","BC_Midres","stations"], _exampleMap);
  main.variable(observer()).define(["p","stations"], _10);
  main.variable(observer()).define(["stations"], _11);
  main.variable(observer("p")).define("p", ["d3"], _p);
  main.variable(observer()).define(["md"], _13);
  return main;
}
