import define1 from "./450051d7f1174df8@254.js";
import define2 from "./a33468b95d0b15b0@808.js";
import define3 from "./94ec544c25860285@1710.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# MHW Buoys without Globe

heatwave status and temp values
by date [API endpoint](https://t6r95rekqe.execute-api.us-east-1.amazonaws.com/dev/getDailySSTStats?startDate=1900-01-01&endDate=2000-01-01&stationPK=7)

Hourlyish data from a particular site
https://t6r95rekqe.execute-api.us-east-1.amazonaws.com/dev/getTimeSeries/4?startDate=2020-01-01&endDate=2021-01-21

Daily data
https://t6r95rekqe.execute-api.us-east-1.amazonaws.com/dev/getDailySSTStats?startDate=2020-01-01&endDate=2022-01-01

MHW periods by category
https://t6r95rekqe.execute-api.us-east-1.amazonaws.com/dev/getClimatology?startDate=2021-01-01&endDate=2021-06-01

Show time series of al buoys at once or wait for user to select a buoy?

Marine tracker plot example
http://whalemap.ocean.dal.ca/MHW/

To do

Get global marine heatwave status and ssta data
https://coralreefwatch.noaa.gov/product/marine_heatwave/
- extract daily ssta values for each buoy location

Bounding box around globe for inset

Get satellite data for each buoy so we can plot both together
- do we want to compare
see https://pac-dev1.cioos.org/dev/buoy_qc_plots/C46131_-_Sentry_Shoal/

try embedding globe and add more files
Best approach might be to embed all charts except globe, the animate globe in script using time from slider

`
)});
  main.variable(observer("ind")).define("ind", ["dates","time1"], function(dates,time1){return(
dates.indexOf(time1)
)});
  main.variable(observer("viewof time1")).define("viewof time1", ["Scrubber","dates"], function(Scrubber,dates){return(
Scrubber(dates, {
  delay: 500,
  autoplay: false,
  loop: true,
  format: (d) => ""
})
)});
  main.variable(observer("time1")).define("time1", ["Generators", "viewof time1"], (G, _) => G.input(_));
  main.variable(observer()).define(["time1"], function(time1){return(
time1
)});
  main.variable(observer()).define(["md","timeFormat","time1"], function(md,timeFormat,time1){return(
md`### ${timeFormat(new Date(time1))}`
)});
  main.variable(observer("viewof map")).define("viewof map", ["projection","width","height","html","mapboxgl","r","mutable siteClicked","invalidation"], function*(projection,width,height,html,mapboxgl,r,$0,invalidation)
{
  let center = projection.invert([width / 2, height / 2]);

  const container = html`<div style="height:${height}px;">`;
  yield container;
  const map = (container.value = new mapboxgl.Map({
    container,
    style: r,
    center: [-127, 51],
    scrollZoom: false,
    zoom: 4
  }));
  // add navigation controls (zoom buttons, pitch & rotate)
  map.addControl(new mapboxgl.NavigationControl());

  map.on("load", function () {
    // https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.on("mouseenter", "hexbins", function (e) {
      map.getCanvas().style.cursor = "default";

      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;
      const description = `${properties.name} <br> 
Heat wave category: ${properties.category}
      `;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });

    map.on("mouseleave", "hexbins", function () {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });

    map.on("click", "hexbins", function (e) {
      console.log(e);
      $0.value = e.features[0].properties.station;
      container.value.selected = {
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
        data: e.features[0].properties
      };
      container.dispatchEvent(new CustomEvent("input", { bubbles: true }));
    });
  });
  invalidation.then(() => map.remove());

  // Wait until the map loads, then yield the container again.
  yield new Promise((resolve) => {
    if (map.loaded()) resolve(map);
    else map.on("load", () => resolve(map));
  });

  yield container;
}
);
  main.variable(observer("map")).define("map", ["Generators", "viewof map"], (G, _) => G.input(_));
  main.variable(observer()).define(["legend","d3"], function(legend,d3){return(
legend({
  color: d3
    .scaleOrdinal()
    .domain(["Moderate", "Strong", "Severe", "Extreme"])
    .range(["#FEDB67", "#f26722", "#cd3728", "#7E1416"])
})
)});
  main.variable(observer("lineChart")).define("lineChart", ["Plot","clickedSite","colors","time1","d3","width"], function(Plot,clickedSite,colors,time1,d3,width){return(
Plot.plot({
  height: 300,
  marks: [
    Plot.line(clickedSite, {
      x: "date",
      y: "sst",
      stroke: colors.get("sst"),
      curve: "step",
      strokeWidth: 0.5
    }),
    Plot.line(clickedSite, {
      x: "date",
      y: "thresh",
      stroke: colors.get("thresh"),
      // curve: "step",
      strokeWidth: 0.5
    }),
    Plot.line(clickedSite, {
      x: "date",
      y: "seas",
      stroke: colors.get("seas"),
      // curve: "step",
      strokeWidth: 0.5
    }),
    Plot.areaY(clickedSite, {
      x: "date",
      y1: "thresh",
      y2: "diff",
      sort: "date",
      curve: "step",
      fill: colors.get("moderate")
    }),

    Plot.areaY(clickedSite, {
      x: "date",
      y1: "thresh",
      y2: "diffStrong",
      sort: "date",
      curve: "step",
      fill: colors.get("Strong")
    }),

    // Plot.areaY(buoyDailyData, {
    //   x: "date",
    //   y1: "thresh",
    //   y2: (d) => Math.min(d.thresh, d.avg),
    //   sort: "date",
    //   fill: colors.get("below")
    // }),

    // rule at bottom of chart marking y=0;
    Plot.ruleY([0]),

    // vertical rule to mark date/time of event
    Plot.ruleX([time1], {
      stroke: "gray",
      y1: 0,
      y2: d3.max(clickedSite, (d) => d.sst)
    })

    // text to mark date/time of event
    // Plot.text([event], {
    //   text: "description",
    //   x: "datetime",
    //   y: maxValue * 1.05,
    //   textAnchor: "start"
    // })
  ],
  // x: {
  //   ticks: d3
  //     .utcWeeks(...d3.extent(buoyDailyData, (d) => d.date))
  //     .map((d) => d3.utcHour.offset(d, 10)),
  //   tickFormat: (d) => {
  //     return d.toLocaleString("en-US", {
  //       month: "short",
  //       day: "2-digit"
  //       // to display the UTC date/times in the timezone in which the events took place
  //       // timeZone: "America/Chicago"
  //     });
  //   }
  // },
  color: {
    domain: ["above", "below", "avg", "thresh"],
    range: [
      colors.get("above"),
      colors.get("below"),
      colors.get("actuals"),
      colors.get("forecast")
    ]
  },
  // x: {
  //   ticks: d3
  //     .utcWeeks(...d3.extent(data, (d) => d.date))
  //     .map((d) => d3.utcHour.offset(d, 6)),
  //   tickFormat: (d) =>
  //     d.toLocaleString("en-US", {
  //       timeZone: "America/Chicago",
  //       month: "short",
  //       day: "numeric"
  //     })
  // },
  marginLeft: 60,
  width
})
)});
  main.define("initial siteClicked", function(){return(
null
)});
  main.variable(observer("mutable siteClicked")).define("mutable siteClicked", ["Mutable", "initial siteClicked"], (M, _) => new M(_));
  main.variable(observer("siteClicked")).define("siteClicked", ["mutable siteClicked"], _ => _.generator);
  main.variable(observer()).define(["md"], function(md){return(
md`Code for globe`
)});
  main.variable(observer("viewof table")).define("viewof table", ["Inputs","buoyDailyData"], function(Inputs,buoyDailyData){return(
Inputs.table(buoyDailyData, {})
)});
  main.variable(observer("table")).define("table", ["Generators", "viewof table"], (G, _) => G.input(_));
  main.variable(observer("clickedSite")).define("clickedSite", ["buoyDailyData","siteClicked"], function(buoyDailyData,siteClicked){return(
buoyDailyData.filter((d) => d.station === siteClicked)
)});
  main.variable(observer("colors")).define("colors", function(){return(
new Map([
  ["avg", "#5b6187"],
  ["thresh", "#FEDB67"],
  ["below", "#89119c"], // actuals below forecast
  ["above", "pink"], // actuals above forecast
  ["moderate", "#FEDB67"],
  ["Strong", "#f26722"],
  ["seas", "pink"]
])
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Buoy plot`
)});
  main.variable(observer("r")).define("r", function(){return(
"mapbox://styles/hakai/ckwpei0yq08cj15nthgd4ql45"
)});
  main.variable(observer("buoys")).define("buoys", function(){return(
[
  {
    short_name: "C46004",
    lat: 50.94,
    lon: -135.87,
    long_name: "Middle Nomad",
    pk: 1
  },
  {
    short_name: "C46036",
    lat: 48.3,
    lon: -133.86,
    long_name: "South Nomad",
    pk: 2
  },
  {
    short_name: "C46131",
    lat: 49.91,
    lon: -124.99,
    long_name: "Sentry Shoal",
    pk: 3
  },
  {
    short_name: "C46132",
    lat: 49.74,
    lon: -127.93,
    long_name: "South Brooks",
    pk: 4
  },
  {
    short_name: "C46134",
    lat: 48.66,
    lon: -123.48,
    long_name: "Pat Bay Test Buoy",
    pk: 5
  },
  {
    short_name: "C46145",
    lat: 54.38,
    lon: -132.42,
    long_name: "Central Dixon Entran",
    pk: 6
  },
  {
    short_name: "C46146",
    lat: 49.34,
    lon: -123.73,
    long_name: "Halibut Bank",
    pk: 7
  },
  {
    short_name: "C46147",
    lat: 51.83,
    lon: -131.23,
    long_name: "South Moresby",
    pk: 8
  },
  {
    short_name: "C46181",
    lat: 53.82,
    lon: -128.84,
    long_name: "Nanakwa Shoal",
    pk: 9
  },
  {
    short_name: "C46182",
    lat: 49.48,
    lon: -123.29,
    long_name: "Pam Rocks",
    pk: 10
  },
  {
    short_name: "C46183",
    lat: 53.57,
    lon: -131.14,
    long_name: "North Hecate Strait",
    pk: 11
  },
  {
    short_name: "C46184",
    lat: 53.92,
    lon: -138.85,
    long_name: "North Nomad",
    pk: 12
  },
  {
    short_name: "C46185",
    lat: 52.42,
    lon: -129.79,
    long_name: "South Hecate Strait",
    pk: 13
  },
  {
    short_name: "C46204",
    lat: 51.38,
    lon: -128.77,
    long_name: "West Sea Otter",
    pk: 14
  },
  {
    short_name: "C46205",
    lat: 54.3,
    lon: -133.4,
    long_name: "West Dixon Entrance",
    pk: 15
  },
  {
    short_name: "C46206",
    lat: 48.83,
    lon: -126,
    long_name: "La Perouse Bank",
    pk: 16
  },
  {
    short_name: "C46207",
    lat: 50.88,
    lon: -129.91,
    long_name: "East Dellwood",
    pk: 17
  },
  {
    short_name: "C46208",
    lat: 52.51,
    lon: -132.69,
    long_name: "West Moresby",
    pk: 18
  }
]
)});
  main.variable(observer()).define(["md"], function(md){return(
md`For a date, find the heatwave status for each station`
)});
  main.variable(observer()).define(["buoyDailyData"], function(buoyDailyData){return(
buoyDailyData
)});
  main.variable(observer("selected")).define("selected", ["hexbyLocation","map"], function(hexbyLocation,map){return(
hexbyLocation.get(
  map.selected ? map.selected.data.lng + "|" + map.selected.data.lat : ""
) || []
)});
  main.variable(observer("hexbyLocation")).define("hexbyLocation", ["d3","hex"], function(d3,hex){return(
d3.group(hex, (d) => d.lng + "|" + d.lat)
)});
  main.variable(observer()).define(["buoyDailyData"], function(buoyDailyData){return(
new Date(buoyDailyData[4000].result_time).toISOString().substring(0, 10)
)});
  main.variable(observer()).define(["time1"], function(time1){return(
new Date(time1).toISOString().substring(0, 10) === "2021-01-01"
)});
  main.variable(observer("HWsForDate")).define("HWsForDate", ["buoyDailyData","time1"], function(buoyDailyData,time1){return(
buoyDailyData.filter(
  (d) =>
    new Date(time1).toISOString().substring(0, 10) ===
    new Date(d.result_time).toISOString().substring(0, 10)
)
)});
  main.variable(observer()).define(["buoyDailyData"], function(buoyDailyData){return(
buoyDailyData.filter((d) => d.category === "Strong")
)});
  main.variable(observer("hex")).define("hex", ["buoys","time1","HWsForDate"], function(buoys,time1,HWsForDate)
{
  const data = [];
  for (let i = 0; i < buoys.length; i++) {
    data.push({
      name: buoys[i].long_name,
      station: buoys[i].pk,
      lat: buoys[i].lat,
      lng: buoys[i].lon,
      category: "none",
      day: time1
    });
  }
  // replace categories with real value
  if (HWsForDate.length > 0) {
    data.forEach((d) => {
      let sta = HWsForDate.find((h) => Number(h.station) === d.station);
      if (sta) {
        d.category = sta.category;
      }
    });
  }
  return data;
}
);
  main.variable(observer("dates")).define("dates", ["d3","dateExtent"], function(d3,dateExtent){return(
d3.timeDay
  .range(new Date(dateExtent[0]), new Date(dateExtent[1]))
  .map((d) => +d)
)});
  main.variable(observer("dateExtent")).define("dateExtent", function(){return(
[new Date("2015-01-01"), new Date("2016-02-01")]
)});
  main.variable(observer("hexgeo")).define("hexgeo", ["hex","selected","colorMHW","opacityMHW"], function(hex,selected,colorMHW,opacityMHW){return(
hex.map((d, i) => {
  let sel = {};
  if (selected && selected[0]) {
    sel = selected[0];
  }
  return {
    id: i,
    properties: {
      ...d,
      stroke: d.lat == sel.lat && d.lng == sel.lng ? 2 : 0,
      mhwcolor: colorMHW(d.category),
      mhwopacity: opacityMHW(d.category)
      // p03color: colorP03(d.p03),
      // p03opacity: opacityP03(d.p03)
    },
    geometry: { type: "Point", coordinates: [d.lng, d.lat] },
    type: "Feature"
  };
})
)});
  main.variable(observer("center")).define("center", ["projection","width","height"], function(projection,width,height){return(
projection.invert([width/2, height/2])
)});
  main.variable(observer("metersToPixelsAtMaxZoom")).define("metersToPixelsAtMaxZoom", function(){return(
(meters, latitude) =>
    meters / 0.075 / Math.cos(latitude * Math.PI / 180)
)});
  main.variable(observer("hexbinLayer")).define("hexbinLayer", ["metersToPixelsAtMaxZoom","center"], function(metersToPixelsAtMaxZoom,center)
{
  return {
    id: "hexbins",
    type: "circle",
    source: "hexbins",
    paint: {
      // keep the circles the same size
      // https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js
      "circle-radius": {
        stops: [
          [0, 0],
          [6.2, metersToPixelsAtMaxZoom(2, center[1])]
        ],
        base: 2
      },
      "circle-stroke-color": "blue",
      "circle-stroke-width": ["get", "stroke"],
      "circle-color": ["get", "mhwcolor"],
      "circle-opacity": ["get", "mhwopacity"]
    }
  };
}
);
  main.variable(observer("buoyDailyData")).define("buoyDailyData", ["dateExtent"], function(dateExtent)
{
  let daysago = new Date().getDate() - 7;
  let st = new Date(new Date().setDate(daysago));

  return fetch(
    "https://t6r95rekqe.execute-api.us-east-1.amazonaws.com/dev/getDailySSTStats?startDate=" +
      dateExtent[0].toISOString().substring(0, 10) +
      "&endDate=" +
      dateExtent[1].toISOString().substring(0, 10) +
      ""
  )
    .then((resp) => resp.json())
    .then((data) => {
      data.forEach((d) => {
        d.diffStrong = d.thresh;
        if (d.category === "Strong") {
          d.diffStrong = Math.max(d.thresh, d.sst);
        }
        d.diff = Math.max(d.thresh, d.sst);
        d.date = new Date(d.result_time);
      });
      return data;
    });
}
);
  main.variable(observer("updateMapbox")).define("updateMapbox", ["hexgeo","map","hexbinLayer"], function(hexgeo,map,hexbinLayer)
{
  // This allows us to update the map with data without re-rendering the whole cell
  // There is a bit of weirdness around adding and removing the layer to make sure mapbox rerenders
  let fc = {
    type: "FeatureCollection",
    features: hexgeo
  };
  if (map._loaded) {
    if (!map.getSource("hexbins")) {
      map.addSource("hexbins", {
        type: "geojson",
        data: fc
      });
    } else {
      // console.log("setting source")
      map.getSource("hexbins").setData(fc);
    }
    if (map.getLayer(hexbinLayer.id)) {
      map.removeLayer(hexbinLayer.id);
    }
    // console.log("adding layer")
    map.addLayer(hexbinLayer);
    // map.flyTo(projection.invert([100,1000]))
    //   console.log("flying")
    // }
    return true;
  }
  return false;
}
);
  main.variable(observer()).define(["map"], function(map){return(
map._loaded
)});
  main.variable(observer()).define(["map"], function(map){return(
map.getSource("hexbins")
)});
  main.variable(observer("originalScale")).define("originalScale", function(){return(
25355.18980109889
)});
  main.variable(observer("scaleRatio")).define("scaleRatio", ["projection","originalScale"], function(projection,originalScale){return(
projection.scale() / originalScale
)});
  main.variable(observer("widthRatio")).define("widthRatio", ["width"], function(width){return(
width / 955
)});
  main.variable(observer("heightRatio")).define("heightRatio", ["height"], function(height){return(
height / 500
)});
  main.variable(observer("projection")).define("projection", ["d3","width","height","topojson","BC_Midres"], function(d3,width,height,topojson,BC_Midres){return(
d3
  .geoAlbers()
  .rotate([126, 0])
  .fitSize(
    [width, height],
    topojson.feature(BC_Midres, BC_Midres.objects.BC_Midres_latlng)
  )
)});
  main.variable(observer("pixelRadius")).define("pixelRadius", ["scaleRatio","d3","widthRatio","heightRatio"], function(scaleRatio,d3,widthRatio,heightRatio){return(
100 * scaleRatio * d3.min([widthRatio, heightRatio])
)});
  main.variable(observer("hexbin")).define("hexbin", ["d3","width","height"], function(d3,width,height){return(
d3
  .hexbin()
  .extent([
    [0, 0],
    [width, height]
  ])
  .radius(100)
)});
  main.variable(observer("numOfDates")).define("numOfDates", ["d3","dateExtent"], function(d3,dateExtent){return(
d3.timeDay.count(...dateExtent)
)});
  main.variable(observer("height")).define("height", function(){return(
500
)});
  main.variable(observer("colorMHW")).define("colorMHW", ["d3"], function(d3){return(
d3
  .scaleOrdinal()
  .domain(["none", "Moderate", "Strong", "Extreme", "Severe"])
  .range(["#a3a3a3", "#FEDB67", "#f26722", "#cd3728", "#7E1416"])
)});
  main.variable(observer()).define(["opacityMHW"], function(opacityMHW){return(
opacityMHW("none")
)});
  main.variable(observer("opacityMHW")).define("opacityMHW", ["d3"], function(d3){return(
d3
  .scaleOrdinal()
  .domain(["none", "Moderate", "Strong", "Extreme", "Severe"])
)});
  main.variable(observer("colorPM1")).define("colorPM1", ["d3"], function(d3){return(
d3.scaleLinear()
  .domain([0,50, 100, 150, 200, 250])
  .range(["green", "yellow", "orange", "red", "maroon", "maroon"])
)});
  main.variable(observer("opacityPM1")).define("opacityPM1", ["d3"], function(d3){return(
d3.scaleLinear()
  .domain([0,50, 100, 150, 200, 250])
  .range([0.1, 0.5, 0.9, 0.9, 0.9, 0.9])
)});
  main.variable(observer("colorP03")).define("colorP03", ["d3"], function(d3){return(
d3.scaleLinear()
  .domain([1,1000, 5000, 10000, 20000, 25000])
  .range(["green", "yellow", "orange", "red", "maroon", "maroon"])
)});
  main.variable(observer("opacityP03")).define("opacityP03", ["d3"], function(d3){return(
d3
  .scaleLinear()
  .domain([1, 1000, 5000, 10000, 20000, 25000])
  .range([0.1, 0.75, 0.75, 0.9, 0.9, 0.9])
)});
  main.variable(observer("numFormat")).define("numFormat", ["d3"], function(d3){return(
d3.format(",d")
)});
  main.variable(observer("timeFormat")).define("timeFormat", ["d3"], function(d3){return(
d3.timeFormat("%Y-%m-%d")
)});
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  const child2 = runtime.module(define2);
  main.import("legend", child2);
  const child3 = runtime.module(define3);
  main.import("BC_Midres", child3);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6.0.0-rc.3", "d3-hexbin@0.2")
)});
  main.variable(observer("mapboxgl")).define("mapboxgl", ["require","html"], async function(require,html)
{
  const gl = await require("mapbox-gl");
  if (!gl.accessToken) {
    gl.accessToken =
      "pk.eyJ1IjoiaGFrYWkiLCJhIjoiY2lyNTcwYzY5MDAwZWc3bm5ubTdzOWtzaiJ9.6QhxH6sQEgK634qO7a8MoQ";
    const href = await require.resolve("mapbox-gl/dist/mapbox-gl.css");
    document.head.appendChild(html`<link href=${href} rel=stylesheet>`);
  }
  return gl;
}
);
  return main;
}
