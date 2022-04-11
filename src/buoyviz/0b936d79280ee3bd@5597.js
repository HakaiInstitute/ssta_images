import define1 from "./2b1bbd5c6560d3d0@977.js";
import define2 from "./41364653f34651d0@303.js";
import define3 from "./a33468b95d0b15b0@808.js";
import define4 from "./94ec544c25860285@1710.js";
import define5 from "./506fa8606867a815@373.js";

function _1(md){return(
md`# Marine heatwave charts and brush/player
`
)}

function _curDate(md,textcolor,timeFormat,time1){return(
md`# ${textcolor(timeFormat(new Date(time1)), "black")}`
)}

function _3(md){return(
md`play button below (is white so you can't see it)`
)}

function _time1(Player,datesToPlot){return(
Player(datesToPlot, {
  width: 0, //Math.min(555, width - 30),
  // margin: 500,
  delay: 100,
  autoplay: false,
  loop: false,
  show: { play: true },
  format: (d) => ""
})
)}

function _5(md){return(
md`anomaly or category button`
)}

function _colorView(Inputs,html){return(
Inputs.radio(["Anomaly", "Heatwaves"], {
  value: "Anomaly",
  // label: "Choose category to view",
  format: (x) => html`<span style="color: white">${x}`
})
)}

function _debug(){return(
null
)}

function _8(brusedAllDates){return(
brusedAllDates
)}

function _9(brushedData){return(
brushedData
)}

function _chart(colorView,focusHeight,d3,width,margin,xMHW,stack,brushedDataMHW,colors,x1MHW,time1,x,drag,brusedAllDates,brushedData,sstaColors)
{
  if (colorView === "Heatwaves") {
    const height = focusHeight;
    const svg = d3
      .create("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("display", "block");

    const y = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top + 5]);

    const xAxis = (g, xMHW, height) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
          d3
            .axisBottom(xMHW)
            .ticks(width / 80)
            .tickSizeOuter(0)
        )
        .style("stroke", "#e0f5ee");

    svg.append("g").call(xAxis, xMHW, height).attr("class", "axisWhite");

    const chartData = stack(brushedDataMHW);
    // svg.append("path")
    const groups = svg
      .append("g")
      // Each layer of the stack goes in a group
      // the group contains that layer for all countries
      .selectAll("g")
      .data(chartData)
      .join("g")
      // rects in the same layer will all have the same color, so we can put it on the group
      // we can use the key on the layer's array to set the color
      .style("fill", (d, i) => {
        // console.log(d);
        return colors.get(d.key);
      });
    // .attr("d", area(x, y.copy().range([focusHeight - margin.bottom, 4])));

    groups
      .selectAll("rect")
      // Now we place the rects, which are the children of the layer array
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => {
        // console.log(
        //   x1MHW(new Date(d.data.date).toISOString().substring(0, 10))
        // );
        return x1MHW(new Date(d.data.date).toISOString().substring(0, 10));
      })
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x1MHW.bandwidth());

    const recordLine = svg
      .append("line")
      .datum([
        {
          date: time1,
          value: 1
        }
      ])
      .attr("x1", (d) => {
        // console.log(d);
        return x(time1);
      })
      .attr("x2", (d) => x(time1))
      .attr("y2", y(1))
      .attr("y1", y(0))
      .attr("fill", "none")
      .attr("stroke", "deeppink")
      .attr("stoke-width", 1.5)
      .attr("stroke-linejoin", "round");
    // .attr("stroke-dasharray", "10 10");
    // .attr("stroke-opacity", 0.8);

    const circles = svg
      .selectAll("circle")
      .data([
        {
          date: time1,
          value: 1
        }
      ])
      .join("circle")
      .attr("cx", (d) => {
        return x(d.date);
      })
      .attr("cy", (d) => y(0.98))
      .attr("r", 7)
      .attr("fill", (d) => "deeppink")
      .attr("stroke", (d) => "deeppink")
      .call(drag);

    return svg.node();
  } else {
    const height = focusHeight;
    const svg = d3
      .create("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("display", "block");

    const y = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top + 5]);

    const xAxis = (g, x, height) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
        )
        .style("stroke", "#e0f5ee");

    svg.append("g").call(xAxis, x, height).attr("class", "axisWhite");

    const x2 = d3
      .scaleBand()
      .range([margin.left, width - margin.right], 0.01)
      .padding(0.01)
      .domain(brusedAllDates);

    // svg.append("path")
    const bars = svg
      .selectAll("rect")
      .data(brushedData)
      .enter()
      .append("rect")
      .attr("x", (d) => x2(d.date.toISOString().substring(0, 10)))
      .attr("y", (d) => {
        return y(1);
      })
      .attr("width", (d) => x2.bandwidth())
      .attr("height", (d) => y(0) - y(1))
      .attr("fill", (d) => sstaColors(d.value));

    const recordLine = svg
      .append("line")
      .datum([
        {
          date: time1,
          value: 1
        }
      ])
      .attr("x1", (d) => {
        // console.log(d);
        return x(time1);
      })
      .attr("x2", (d) => x(time1))
      .attr("y2", y(1))
      .attr("y1", y(0))
      .attr("fill", "none")
      .attr("stroke", "deeppink")
      .attr("stoke-width", 1.5)
      .attr("stroke-linejoin", "round");
    // .attr("stroke-dasharray", "10 10");
    // .attr("stroke-opacity", 0.8);

    const circles = svg
      .selectAll("circle")
      .data([
        {
          date: time1,
          value: 1
        }
      ])
      .join("circle")
      .attr("cx", (d) => {
        return x(d.date);
      })
      .attr("cy", (d) => y(0.98))
      .attr("r", 7)
      .attr("fill", (d) => "deeppink")
      .attr("stroke", (d) => "deeppink")
      .call(drag);
    return svg.node();
  }
  // return svg.node();
}


function _focus(colorView,d3,width,focusHeight,dateExtent,margin,xAxis,stack,monthlyGrouped,colors,x1,y,data,sstaColors)
{
  if (colorView === "Heatwaves") {
    const svg = d3
      .create("svg")
      .attr("viewBox", [0, 0, width, focusHeight])
      .style("display", "block");

    const x = d3
      .scaleTime()
      .domain(dateExtent)
      .range([margin.left, width - margin.right]);

    const brush = d3
      .brushX()
      .extent([
        [margin.left, 0.5],
        [width - margin.right, focusHeight - margin.bottom + 0.5]
      ])
      .on("brush", brushed)
      .on("end", brushended);

    const defaultSelection = [
      x(d3.utcYear.offset(x.domain()[1], -1)),
      x.range()[1]
    ];

    svg.append("g").call(xAxis, x, focusHeight).attr("class", "axisWhite");
    let previousS0, previousS1;

    const chartData = stack(monthlyGrouped);

    const groups = svg
      .append("g")
      // Each layer of the stack goes in a group
      // the group contains that layer for all countries
      .selectAll("g")
      .data(chartData)
      .join("g")
      // rects in the same layer will all have the same color, so we can put it on the group
      // we can use the key on the layer's array to set the color
      .style("fill", (d, i) => {
        // console.log(d.key);
        return colors.get(d.key);
      });
    // .attr("d", area(x, y.copy().range([focusHeight - margin.bottom, 4])));

    groups
      .selectAll("rect")
      // Now we place the rects, which are the children of the layer array
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => {
        // console.log(d.data.date);
        return x1(new Date(d.data.date).toISOString().substring(0, 10));
      })
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x1.bandwidth());

    const gb = svg.append("g").call(brush);
    gb.call(brush.move, defaultSelection);

    function brushed({ selection }) {
      if (selection) {
        // console.log("fire1");
        var s = selection || x.range();

        svg.property(
          "value",
          selection.map(x.invert, x).map(d3.utcMonth.round)
        );
        svg.dispatch("input");

        if (((s[1] - s[0]) / width) * 120 > 30) {
          gb.call(brush.move, [previousS0, previousS1]);
          return;
        }
        previousS0 = s[0];
        previousS1 = s[1];
      }
    }

    function brushended({ selection }) {
      if (!selection) {
        gb.call(brush.move, [defaultSelection]);
      }
    }
    return svg.node();

    /////
  } else {
    const svg = d3
      .create("svg")
      .attr("viewBox", [0, 0, width, focusHeight])
      .style("display", "block");

    const x = d3
      .scaleTime()
      .domain(dateExtent)
      .range([margin.left, width - margin.right]);

    const brush = d3
      .brushX()
      .extent([
        [margin.left, 0.5],
        [width - margin.right, focusHeight - margin.bottom + 0.5]
      ])
      .on("brush", brushed)
      .on("end", brushended);

    const defaultSelection = [
      x(d3.utcYear.offset(x.domain()[1], -1)),
      x.range()[1]
    ];

    svg.append("g").call(xAxis, x, focusHeight).attr("class", "axisWhite");
    let previousS0, previousS1;
    // svg.append("path")
    const bars = svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x1(d.date.toISOString().substring(0, 10)))
      .attr("y", (d) => {
        return y(1);
      })
      .attr("width", (d) => x1.bandwidth())
      .attr("height", (d) => y(0) - y(1))
      .attr("fill", (d) => sstaColors(d.value));
    // .attr("d", area(x, y.copy().range([focusHeight - margin.bottom, 4])));

    const gb = svg.append("g").call(brush);
    gb.call(brush.move, defaultSelection);

    function brushed({ selection }) {
      if (selection) {
        // console.log("fire1");
        var s = selection || x.range();

        svg.property(
          "value",
          selection.map(x.invert, x).map(d3.utcMonth.round)
        );
        svg.dispatch("input");

        if (((s[1] - s[0]) / width) * 120 > 30) {
          gb.call(brush.move, [previousS0, previousS1]);
          return;
        }
        previousS0 = s[0];
        previousS1 = s[1];
      }
    }

    function brushended({ selection }) {
      if (!selection) {
        gb.call(brush.move, [defaultSelection]);
      }
    }

    return svg.node();
  }
}


function _legTitle(md,colorView){return(
md` ${
  colorView === "Anomaly" ? "Sea surface temperature anomaly" : " "
}`
)}

function _leg(colorView,Plot)
{
  return colorView === "Anomaly"
    ? Plot.legend({
        marginLeft: 10,
        marginRight: 10,

        style: {
          backgroundColor: "#000000",
          color: "#e0f5ee",
          fontSize: "16px",
          fontWeight: "normal"
        },
        color: {
          type: "diverging",
          domain: [-4, 4],
          pivot: 0,
          reverse: true,
          legend: true,
          label: ""
        }
      })
    : Plot.legend({
        color: {
          type: "categorical",
          domain: ["No heatwave", "Moderate", "Strong", "Severe", "Extreme"],
          range: ["lightblue", "#FEDB67", "#f26722", "#cd3728", "#7E1416"] // use the "accent" scheme
        },
        style: {
          backgroundColor: "#000000",
          color: "#e0f5ee",
          fontSize: "16px",
          fontWeight: "normal"
        }
      });
}


function _lineChart(clickedSite,Plot,limitsDelayed,yMaxDomainToUse,time1,d3,dateForLabel,yValueForLabel,buoyClicked,colors,dateForLabelVal,currentValue,siteClicked,colorView,md)
{
  const noData = "No data during time period selected";
  const taLabel = clickedSite.length === 0 ? "" : "Temperature anomaly";
  const HWlineChart = Plot.plot({
    x: {
      domain: [limitsDelayed[0], limitsDelayed[1]]
    },
    y: {
      label: "↑ SST (°C)",
      domain: [0, yMaxDomainToUse]
    },
    style: {
      backgroundColor: "#000000",
      color: "#e0f5ee",
      // fontFamily: "system-ui",
      fontSize: 10
      // overflow: "visible"
    },
    height: 500,
    marginTop: 20,
    className: "hwclass",
    // y: {
    //   nice: true
    // },
    // x: {
    //   nice: true
    // },
    marks: [
      Plot.dot(clickedSite, {
        x: "date",
        y: "sst",
        stroke: "category",
        fill: "category"
      }),
      // Plot.line(clickedSite, {
      //   x: "date",
      //   y: "sst",
      //   stroke: "#ccc",
      //   curve: "step",
      //   strokeWidth: 0.5
      // }),
      // vertical rule to mark date/time of event
      Plot.ruleX([time1], {
        stroke: "white",
        y1: 0,
        y2: d3.max(clickedSite, (d) => d.sst)
      }),
      Plot.text(
        [
          {
            x: dateForLabel,
            y: yValueForLabel,
            text: buoyClicked
          }
        ],
        {
          x: "x",
          y: "y",
          text: "text",
          fontSize: 16
        }
      )
    ],
    color: {
      domain: ["none", "Moderate", "Strong", "Severe", "Extreme"],
      range: [
        colors.get("none"),
        colors.get("Moderate"),
        colors.get("Strong"),
        colors.get("Severe"),
        colors.get("Extreme")
      ]
      // legend: true
    },

    width: 500,
    height: 300
    // marginBottom: 70,
    // label: buoyClicked
    // title: "some stie"
  });

  const SSTAlineChart = Plot.plot({
    x: {
      domain: [limitsDelayed[0], limitsDelayed[1]]
    },
    y: {
      label: "↑ SST (°C)",
      domain: [0, yMaxDomainToUse]
    },
    style: {
      backgroundColor: "#000000",
      color: "#e0f5ee",
      // fontFamily: "system-ui",
      fontSize: 10
      // overflow: "visible"
    },
    height: 500,
    marginTop: 20,
    className: "hwclass",
    // y: {
    //   nice: true
    // },
    // x: {
    //   nice: true
    // },
    marks: [
      Plot.dot(clickedSite, {
        x: "date",
        y: "sst",
        stroke: "ssta",
        fill: "ssta"
      }),
      // Plot.line(clickedSite, {
      //   x: "date",
      //   y: "sst",
      //   stroke: "#ccc",
      //   curve: "step",
      //   strokeWidth: 0.5
      // }),
      // vertical rule to mark date/time of event
      Plot.ruleX([time1], {
        stroke: "white",
        y1: 0,
        y2: d3.max(clickedSite, (d) => d.sst)
      }),
      Plot.text(
        [
          {
            x: dateForLabel,
            y: yValueForLabel,
            text: buoyClicked
          }
        ],
        {
          x: "x",
          y: "y",
          text: "text",
          fontSize: 16
        }
      ),
      Plot.text(
        [
          {
            x: dateForLabelVal,
            y: yValueForLabel,
            text: taLabel
          }
        ],
        {
          x: "x",
          y: "y",
          text: "text",
          fontSize: 10
        }
      ),
      Plot.text(
        [
          {
            x: dateForLabelVal,
            y: yValueForLabel - 1,
            text: currentValue
          }
        ],
        {
          x: "x",
          y: "y",
          text: "text",
          fontSize: 10
        }
      )
    ],
    color: {
      type: "diverging",
      domain: [-4, 4],
      pivot: 0,
      reverse: true
      // legend: true,
      // label: "SSTA (°C) →"
    },

    width: 500,
    height: 300
    // marginBottom: 70,
    // label: buoyClicked
    // title: "some stie"
  });
  if (siteClicked !== null) {
    return colorView === "Anomaly" ? SSTAlineChart : HWlineChart;
  } else {
    return md``;
  }
}


function _ind(dates,time1){return(
dates.indexOf(time1)
)}

function _today(d3){return(
d3.timeDay.offset(d3.utcDay(), -2)
)}

function _start(d3,today){return(
d3.timeDay.offset(today, -365)
)}

async function _limitsDelayed(Promises,focus)
{
  await Promises.delay(1500, ""); // delay returning
  return focus;
}


async function _limitsDelayedMHW(Promises,focus)
{
  await Promises.delay(1500, ""); // delay returning
  return focus;
}


function _buttonStyle(faStyle){return(
faStyle({ solid: true })
)}

function _23(md){return(
md`## bar charts`
)}

function _focusHeight(){return(
60
)}

function _margin(){return(
{ top: 4, right: 20, bottom: 30, left: 10 }
)}

function _x1(d3,margin,width,alldates){return(
d3
  .scaleBand()
  .range([margin.left, width - margin.right], 0.01)
  .padding(0.1)
  .domain(alldates)
)}

function _x1MHW(d3,margin,width,brusedAllDatesMHW){return(
d3
  .scaleBand()
  .range([margin.left, width - margin.right], 0.01)
  .padding(0.01)
  .domain(brusedAllDatesMHW)
)}

function _xAxis(margin,d3,width){return(
(g, x, height) =>
  g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(width / 80)
        .tickSizeOuter(0)
    )
    .style("stroke", "#e0f5ee")
)}

function _y(d3,focusHeight,margin){return(
d3
  .scaleLinear()
  .domain([0, 1])
  .range([focusHeight - margin.bottom, margin.top])
)}

function _brushedDataMHW(monthlyGrouped,focus){return(
monthlyGrouped.filter(
  (d) => d.date >= focus[0] && new Date(d.date) < new Date(focus[1])
)
)}

function _31(focus){return(
focus
)}

function _brusedAllDates(d3,focus){return(
d3.timeMonth
  .range(new Date(focus[0]), focus[1])
  .map((d) => d.toISOString().substring(0, 10))
)}

function _33(focus){return(
new Date(+new Date(focus[1]))
)}

function _brusedAllDatesMHW(d3,focus){return(
d3.timeMonth
  .range(new Date(focus[0]), new Date(focus[1]))
  .map((d) => d.toISOString().substring(0, 10))
)}

function _35(focus){return(
focus
)}

function _36(d3,today){return(
d3.timeDay.offset(today, -1)
)}

function _drag(d3,x,focus,datesToPlot,$0)
{
  function dragstarted(event, d) {
    d3.select(this).raise().attr("stroke", "black");
  }

  function dragged(event, d) {
    let isBelowMax = event.x > x(+focus[0]);
    let isAboveMin = event.x < x(+new Date("2022-03-31"));
    // mutable debug = new Date("2022-04-08");
    // console.log(d3.timeDay.offset(today, -1));

    if (isBelowMax && isAboveMin) {
      d3.select(this).attr("cx", (d.x = event.x));
      // console.log(event.x, event.dx);

      const ind = d3.bisect(datesToPlot, +x.invert(event.x));

      $0.update(ind);
    }

    // .attr("cy", (d.y = event.y));
  }

  function dragended(event, d) {
    d3.select(this).attr("stroke", null);
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}


function _38(focus){return(
focus
)}

function _focusLong(focus,d3){return(
[new Date(focus[0]), new Date(d3.timeMonth.offset(focus[1], 1))]
)}

function _x(d3,focus,margin,width){return(
d3
  .scaleTime()
  .domain(focus)
  .range([margin.left, width - margin.right])
)}

function _xMHW(d3,focus,margin,width){return(
d3
    .scaleTime()
    .domain(focus)
    .range([margin.left, width - margin.right])
)}

function _style(html,width,ns){return(
html`
<style>

  /* match the scrubber's width to our race chart */
   // input[type="range"][name="i"] {
   //   width: ${width - 90}px !important;
   // }

.${ns}{
  font-size: 16px;  
}
// .mapbox-improve-map {
//     display: none;
// }

button, input, textarea {
    accent-color: #007490;
}

#butt input, textarea {
    accent-color: green;
}
.brushFilter {
background-color: #606060;
color: "#e0f5ee"
}

.currentDot{
background-color: none;
color: "#e0f5ee"
}

.axisWhite line{
  stroke: #e0f5ee;
}

.axisWhite path{
  stroke: #e0f5ee;
}

// .selection{
// fill: #d9d9d9;
// fill-opacity: .6;
// stroke: none;
// }

.radio {

  color: deeppink;
}
  button {
  border: 0;
color:white;
  background: transparent;
background-color: transparent !important;;
  box-sizing: border-box;
  width: 100;
  // height: 74px;
  border-color: transparent transparent transparent !important;;
  transition: 100ms all ease;
  cursor: pointer;
  border-style: solid;
  border-width: 37px 0 37px 60px;
}
.fa-xs {
    font-size: 5.75em;
}

</style>
`
)}

function _stack(d3,cats){return(
d3.stack().keys(cats)
)}

function _44(focus){return(
focus
)}

function _45(focusLong){return(
focusLong
)}

function _brushedData(data,focus){return(
data.filter(
  (d) => d.date >= focus[0] && new Date(d.date) < new Date(focus[1])
)
)}

function _47(d3,focus){return(
new Date(d3.timeMonth.offset(focus[1], 1))
)}

function _sstaColors(d3){return(
d3.scaleDiverging(d3.interpolateRdBu).domain([4, 0, -4])
)}

function _brushHandle(arc){return(
(g, selection, margin, height) =>
  g
    .selectAll(".handle--custom")
    .data([{ type: "w" }, { type: "e" }])
    .join((enter) =>
      enter
        .append("path")
        .attr("class", "handle--custom")
        .attr("fill", "#afafaf")
        .attr("fill-opacity", 0.8)
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("cursor", "ew-resize")
        .attr("d", arc)
    )
    .attr("display", selection === null ? "none" : null)
    .attr(
      "transform",
      selection === null
        ? null
        : (d, i) =>
            `translate(${selection[i]},${
              (height + margin.top - margin.bottom) / 2
            })`
    )
)}

function _arc(d3)
{
  let height = 50;
  let margin = { top: 10, right: 20, bottom: 20, left: 95 };
  return d3
    .arc()
    .innerRadius(0)
    .outerRadius((height - margin.top - margin.bottom) / 2)
    .startAngle(0)
    .endAngle((d, i) => (i ? Math.PI : -Math.PI));
}


function _51(dataSsta){return(
dataSsta
)}

function _52(data){return(
data[109]
)}

function _data(dataSsta)
{
  const out = [];
  Object.keys(dataSsta).forEach((d) => {
    out.push({
      date: new Date(d.slice(0, 4) + "-" + d.slice(-2)),
      value: dataSsta[d][0]
    });
  });
  return out;
}


function _dataSsta(FileAttachment){return(
FileAttachment("monthly@7.json").json()
)}

function _ns(Inputs){return(
Inputs.text().classList[0]
)}

function _datesToPlot(datesCopy,limitsDelayed){return(
datesCopy.filter(
  (d) => d >= limitsDelayed[0] && d <= limitsDelayed[1]
)
)}

function _dates(d3,dateExtent){return(
d3.timeDay
  .range(new Date(dateExtent[0]), new Date(dateExtent[1]))
  .map((d) => +d)
)}

function _datesCopy(dates){return(
[...dates]
)}

function _dateExtent(){return(
[new Date("2013-01-01"), new Date()]
)}

function _siteClicked(){return(
11
)}

function _currentValue(clickedSite,time1)
{
  let value;
  if (clickedSite.length !== 0) {
    value = clickedSite
      .find(
        (d) =>
          new Date(d.date).toISOString().substring(0, 10) ===
          new Date(time1).toISOString().substring(0, 10)
      )
      .ssta.toFixed(2);
  } else {
    value = "";
  }

  // if (clickedSite.length === 0) value = "";
  return value;
}


function _yMaxDomainToUse(clickedSite,d3)
{
  return clickedSite[Math.floor(clickedSite.length / 1.2)] === undefined ?
    18 :  d3.max(clickedSite, (d) => d.sst) * 1.1
}


function _yValueForLabel(clickedSite,d3)
{
  return clickedSite[Math.floor(clickedSite.length / 1.2)] === undefined
    ? 18
    : d3.max(clickedSite, (d) => d.sst) * 1.1;
}


function _dateForLabel(clickedSite,d3,limitsDelayed)
{
  return clickedSite[Math.floor(clickedSite.length / 1.2)] === undefined
    ? d3.timeDay.offset(limitsDelayed[0], 30)
    : clickedSite[Math.floor(clickedSite.length * 0.2)].date;
}


function _dateForLabelVal(clickedSite,d3,limitsDelayed)
{
  return clickedSite[Math.floor(clickedSite.length / 2)] === undefined
    ? d3.timeDay.offset(limitsDelayed[0], 30)
    : clickedSite[Math.floor(clickedSite.length * 0.8)].date;
}


function _buoyClicked(buoys,siteClicked){return(
buoys.find((d) => d.pk === siteClicked).long_name
)}

function _67(clickedSite){return(
clickedSite.filter((d) => d.category === "Moderate")
)}

function _clickedSite(buoyDailyData,siteClicked){return(
buoyDailyData.filter((d) => d.station === siteClicked)
)}

function _colors(){return(
new Map([
  ["avg", "#5b6187"],
  ["thresh", "#FEDB67"],
  ["below", "#89119c"], // actuals below forecast
  ["above", "pink"], // actuals above forecast
  ["none", "lightblue"],
  ["Moderate", "#FEDB67"],
  ["Strong", "#f26722"],
  ["Severe", "#cd3728"],
  ["Extreme", "#7E1416"],

  ["seas", "pink"]
])
)}

function _buoys(){return(
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
  // {
  //   short_name: "C46134",
  //   lat: 48.66,
  //   lon: -123.48,
  //   long_name: "Pat Bay Test Buoy",
  //   pk: 5
  // },
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
  // {
  //   short_name: "C46181",
  //   lat: 53.82,
  //   lon: -128.84,
  //   long_name: "Nanakwa Shoal",
  //   pk: 9
  // },
  // {
  //   short_name: "C46182",
  //   lat: 49.48,
  //   lon: -123.29,
  //   long_name: "Pam Rocks",
  //   pk: 10
  // },
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
)}

function _HWsForDate(buoyDailyData,time1){return(
buoyDailyData.filter(
  (d) =>
    new Date(time1).toISOString().substring(0, 10) ===
    new Date(d.result_time).toISOString().substring(0, 10)
)
)}

function _dayBeforeStart(focus)
{
  const b = Object.assign(focus[0]);
  const fistDate = new Date(b);

  return new Date(fistDate.setDate(fistDate.getDate() - 1))
    .toISOString()
    .substring(0, 10);
}


function _buoyDailyData(dayBeforeStart,limitsDelayed)
{
  // let daysago = new Date().getDate() - 7;
  // let st = new Date(new Date().setDate(daysago));

  return fetch(
    "https://t6r95rekqe.execute-api.us-east-1.amazonaws.com/dev/getDailySSTStats?startDate=" +
      dayBeforeStart +
      "&endDate=" +
      limitsDelayed[1].toISOString().substring(0, 10) +
      ""
  )
    .then((resp) => resp.json())
    .then((data) => {
      data.forEach((d) => {
        d.ssta = d.sst - d.seas;
        d.diff = d.thresh;
        
        d.diffStrong = d.thresh;
        d.diffExtreme = d.thresh;
        d.diffSevere = d.thresh;
        if (d.category === "Strong") {
          d.diffStrong = Math.max(d.thresh, d.sst);
        }
        if (d.category === "Extreme") {
          d.diffExtreme = Math.max(d.thresh, d.sst);
        }
        if (d.category === "Severe") {
          d.diffSevere = Math.max(d.thresh, d.sst);
        }
        if (d.category === "Moderate") {
          d.diff = Math.max(d.thresh, d.sst);
        }
        if (d.category === null) {
          d.category = "none";
        }
        d.date = new Date(d.result_time);
      });
      return data;
    });
}


function _projection(d3,width,height,topojson,BC_Midres){return(
d3
  .geoAlbers()
  .rotate([126, 0])
  .fitSize(
    [width, height],
    topojson.feature(BC_Midres, BC_Midres.objects.BC_Midres_latlng)
  )
)}

function _height(){return(
500
)}

function _colorMHW(d3){return(
d3
  .scaleOrdinal()
  .domain(["none", "Moderate", "Strong", "Severe","Extreme"])
  .range(["#31a354", "#FEDB67", "#f26722", "#7E1416", "#cd3728"])
)}

function _opacityMHW(d3){return(
d3
  .scaleOrdinal()
  .domain(["none", "Moderate", "Strong", "Severe", "Extreme"])
)}

function _numFormat(d3){return(
d3.format(",d")
)}

function _timeFormat(d3){return(
d3.timeFormat("%Y-%m-%d")
)}

function _d3(require){return(
require("d3@6")
)}

function _p(time1){return(
new Date(time1).toISOString().substring(0, 10)
)}

function _hwEvent(){return(
[
  { date: "2013-10-01", value: 1 },
  { date: "2013-11-01", value: 1 },
  { date: "2013-12-01", value: 1 },
  { date: "2014-01-01", value: 1 },
  { date: "2014-02-01", value: 1 },
  { date: "2014-03-01", value: 1 },
  { date: "2014-04-01", value: 1 },
  { date: "2014-05-01", value: 1 },
  { date: "2014-06-01", value: 1 },
  { date: "2014-07-01", value: 1 },
  { date: "2014-08-01", value: 1 },
  { date: "2014-09-01", value: 1 },
  { date: "2014-10-01", value: 1 },
  { date: "2014-11-01", value: 1 },
  { date: "2014-12-01", value: 1 },
  { date: "2015-01-01", value: 1 },
  { date: "2015-02-01", value: 1 },
  { date: "2015-03-01", value: 1 },
  { date: "2015-04-01", value: 1 },
  { date: "2015-05-01", value: 1 },
  { date: "2015-06-01", value: 1 },
  { date: "2015-07-01", value: 1 },
  { date: "2015-08-01", value: 1 },
  { date: "2015-09-01", value: 1 },
  { date: "2015-10-01", value: 1 },
  { date: "2015-11-01", value: 1 },
  { date: "2015-12-01", value: 1 },
  { date: "2016-01-01", value: 1 },
  { date: "2016-02-01", value: 1 },
  { date: "2016-03-01", value: 1 },
  { date: "2016-04-01", value: 1 },
  { date: "2016-05-01", value: 1 },
  { date: "2016-06-01", value: 1 },
  { date: "2016-07-01", value: 1 },
  { date: "2016-08-01", value: 1 },
  { date: "2016-09-01", value: 1 },
  { date: "2016-10-01", value: 1 },
  { date: "2016-11-01", value: 1 },
  { date: "2019-08-01", value: 1 },
  { date: "2019-09-01", value: 1 },
  { date: "2019-10-01", value: 1 },
  { date: "2019-11-01", value: 1 }
]
)}

function _87(dateExtent){return(
dateExtent[1]
)}

function _88(alldates){return(
alldates[111]
)}

function _alldates(d3,dateExtent){return(
d3.timeMonth
  .range(new Date(dateExtent[0]), new Date(dateExtent[1]))
  .map((d) => d.toISOString().substring(0, 10))
)}

function _allmonths(mhwBarData){return(
[...new Set(mhwBarData.map((d) => d.date.slice(0, 7)))]
)}

function _91(monthlyTots){return(
monthlyTots.filter((d) => d.date === "2013-01")
)}

function _monthlyTots(allmonths,cats,d3,mhwBarData)
{
  const out = [];
  allmonths.forEach((month) => {
    let t = 0;
    for (let i = 0; i < cats.length; i++) {
      let s = d3.sum(
        mhwBarData.filter((d) => {
          return +new Date(d.month) === +new Date(month);
        }),
        (d) => d[cats[i]]
      );
      // 15541891 is the total amount of points
      out.push({ date: month, [cats[i]]: s });
      t += s;
      // console.log(month, [cats[i]], s);
      // console.log(t);
    }
    // console.log(t);
  });
  return out;
}


function _93(groups){return(
groups
)}

function _94(monthlyGrouped){return(
monthlyGrouped[110]
)}

function _monthlyGrouped(groups,cats)
{
  const out = [];
  groups.forEach((d) => {
    let sum = 0;
    d[1].forEach((d) => {
      sum += Object.values(d)[1];
    });
    // return sum;
    out.push({
      date: new Date(d[0]),
      [cats[0]]: d[1][0][cats[0]] / sum,
      [cats[1]]: d[1][1][cats[1]] / sum,
      [cats[2]]: d[1][2][cats[2]] / sum,
      [cats[3]]: d[1][3][cats[3]] / sum,
      [cats[4]]: d[1][4][cats[4]] / sum,
      sum: sum
    });
  });
  return out;
}


function _cats(){return(
["none", "Moderate", "Strong", "Extreme", "Severe"]
)}

function _groups(d3,monthlyTots){return(
d3.groups(monthlyTots, (d) => +new Date(d.date))
)}

async function _mhwBarData(FileAttachment)
{
  const raw = await FileAttachment("monthlyMHW.json").json();
  const out = [];
  Object.keys(raw).forEach((d) => {
    for (let i = 0; i < 1; i++) {
      let tot = raw[d].reduce((a, b) => a + b, 0);
      out.push({
        date: d.replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3"),
        month: d.replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3").slice(0, 7),
        none: raw[d][0],
        Moderate: raw[d][1],
        Strong: raw[d][2],
        Extreme: raw[d][3],
        Severe: raw[d][4]
      });
    }
  });
  return out;
}


function _tt(FileAttachment){return(
FileAttachment("monthlyMHW.json").json()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["monthlyMHW.json",new URL("./files/4f15d9ec1bd1193a40e6cccc638b5ebbef045d555e511f1e5b1b631be853554576b6519c5cbbb167076801ccadcfb6c355a2ccc8f3cdbedc96be1debbb74c2e2",import.meta.url)],["monthly@7.json",new URL("./files/a3fbadf29709e974764d626a8843acf9134d9d813173218a60e5bbdf612fc8f873cb8fc46bf03b10d42dff7e66f3861625456633c0b887fee99eb6c0c0ac42d9",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("curDate")).define("curDate", ["md","textcolor","timeFormat","time1"], _curDate);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("viewof time1")).define("viewof time1", ["Player","datesToPlot"], _time1);
  main.variable(observer("time1")).define("time1", ["Generators", "viewof time1"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("viewof colorView")).define("viewof colorView", ["Inputs","html"], _colorView);
  main.variable(observer("colorView")).define("colorView", ["Generators", "viewof colorView"], (G, _) => G.input(_));
  main.define("initial debug", _debug);
  main.variable(observer("mutable debug")).define("mutable debug", ["Mutable", "initial debug"], (M, _) => new M(_));
  main.variable(observer("debug")).define("debug", ["mutable debug"], _ => _.generator);
  main.variable(observer()).define(["brusedAllDates"], _8);
  main.variable(observer()).define(["brushedData"], _9);
  main.variable(observer("chart")).define("chart", ["colorView","focusHeight","d3","width","margin","xMHW","stack","brushedDataMHW","colors","x1MHW","time1","x","drag","brusedAllDates","brushedData","sstaColors"], _chart);
  main.variable(observer("viewof focus")).define("viewof focus", ["colorView","d3","width","focusHeight","dateExtent","margin","xAxis","stack","monthlyGrouped","colors","x1","y","data","sstaColors"], _focus);
  main.variable(observer("focus")).define("focus", ["Generators", "viewof focus"], (G, _) => G.input(_));
  main.variable(observer("legTitle")).define("legTitle", ["md","colorView"], _legTitle);
  main.variable(observer("leg")).define("leg", ["colorView","Plot"], _leg);
  main.variable(observer("viewof lineChart")).define("viewof lineChart", ["clickedSite","Plot","limitsDelayed","yMaxDomainToUse","time1","d3","dateForLabel","yValueForLabel","buoyClicked","colors","dateForLabelVal","currentValue","siteClicked","colorView","md"], _lineChart);
  main.variable(observer("lineChart")).define("lineChart", ["Generators", "viewof lineChart"], (G, _) => G.input(_));
  main.variable(observer("ind")).define("ind", ["dates","time1"], _ind);
  main.variable(observer("today")).define("today", ["d3"], _today);
  main.variable(observer("start")).define("start", ["d3","today"], _start);
  main.variable(observer("limitsDelayed")).define("limitsDelayed", ["Promises","focus"], _limitsDelayed);
  main.variable(observer("limitsDelayedMHW")).define("limitsDelayedMHW", ["Promises","focus"], _limitsDelayedMHW);
  main.variable(observer("buttonStyle")).define("buttonStyle", ["faStyle"], _buttonStyle);
  const child1 = runtime.module(define1);
  main.import("Player", child1);
  main.import("faStyle", child1);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("focusHeight")).define("focusHeight", _focusHeight);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("x1")).define("x1", ["d3","margin","width","alldates"], _x1);
  main.variable(observer("x1MHW")).define("x1MHW", ["d3","margin","width","brusedAllDatesMHW"], _x1MHW);
  main.variable(observer("xAxis")).define("xAxis", ["margin","d3","width"], _xAxis);
  main.variable(observer("y")).define("y", ["d3","focusHeight","margin"], _y);
  main.variable(observer("brushedDataMHW")).define("brushedDataMHW", ["monthlyGrouped","focus"], _brushedDataMHW);
  main.variable(observer()).define(["focus"], _31);
  main.variable(observer("brusedAllDates")).define("brusedAllDates", ["d3","focus"], _brusedAllDates);
  main.variable(observer()).define(["focus"], _33);
  main.variable(observer("brusedAllDatesMHW")).define("brusedAllDatesMHW", ["d3","focus"], _brusedAllDatesMHW);
  main.variable(observer()).define(["focus"], _35);
  main.variable(observer()).define(["d3","today"], _36);
  main.variable(observer("drag")).define("drag", ["d3","x","focus","datesToPlot","viewof time1"], _drag);
  main.variable(observer()).define(["focus"], _38);
  main.variable(observer("focusLong")).define("focusLong", ["focus","d3"], _focusLong);
  main.variable(observer("x")).define("x", ["d3","focus","margin","width"], _x);
  main.variable(observer("xMHW")).define("xMHW", ["d3","focus","margin","width"], _xMHW);
  main.variable(observer("style")).define("style", ["html","width","ns"], _style);
  main.variable(observer("stack")).define("stack", ["d3","cats"], _stack);
  main.variable(observer()).define(["focus"], _44);
  main.variable(observer()).define(["focusLong"], _45);
  main.variable(observer("brushedData")).define("brushedData", ["data","focus"], _brushedData);
  main.variable(observer()).define(["d3","focus"], _47);
  main.variable(observer("sstaColors")).define("sstaColors", ["d3"], _sstaColors);
  main.variable(observer("brushHandle")).define("brushHandle", ["arc"], _brushHandle);
  main.variable(observer("arc")).define("arc", ["d3"], _arc);
  main.variable(observer()).define(["dataSsta"], _51);
  main.variable(observer()).define(["data"], _52);
  main.variable(observer("data")).define("data", ["dataSsta"], _data);
  main.variable(observer("dataSsta")).define("dataSsta", ["FileAttachment"], _dataSsta);
  main.variable(observer("ns")).define("ns", ["Inputs"], _ns);
  main.variable(observer("datesToPlot")).define("datesToPlot", ["datesCopy","limitsDelayed"], _datesToPlot);
  main.variable(observer("dates")).define("dates", ["d3","dateExtent"], _dates);
  main.variable(observer("datesCopy")).define("datesCopy", ["dates"], _datesCopy);
  main.variable(observer("dateExtent")).define("dateExtent", _dateExtent);
  main.define("initial siteClicked", _siteClicked);
  main.variable(observer("mutable siteClicked")).define("mutable siteClicked", ["Mutable", "initial siteClicked"], (M, _) => new M(_));
  main.variable(observer("siteClicked")).define("siteClicked", ["mutable siteClicked"], _ => _.generator);
  main.variable(observer("currentValue")).define("currentValue", ["clickedSite","time1"], _currentValue);
  main.variable(observer("yMaxDomainToUse")).define("yMaxDomainToUse", ["clickedSite","d3"], _yMaxDomainToUse);
  main.variable(observer("yValueForLabel")).define("yValueForLabel", ["clickedSite","d3"], _yValueForLabel);
  main.variable(observer("dateForLabel")).define("dateForLabel", ["clickedSite","d3","limitsDelayed"], _dateForLabel);
  main.variable(observer("dateForLabelVal")).define("dateForLabelVal", ["clickedSite","d3","limitsDelayed"], _dateForLabelVal);
  main.variable(observer("buoyClicked")).define("buoyClicked", ["buoys","siteClicked"], _buoyClicked);
  main.variable(observer()).define(["clickedSite"], _67);
  main.variable(observer("clickedSite")).define("clickedSite", ["buoyDailyData","siteClicked"], _clickedSite);
  main.variable(observer("colors")).define("colors", _colors);
  main.variable(observer("buoys")).define("buoys", _buoys);
  main.variable(observer("HWsForDate")).define("HWsForDate", ["buoyDailyData","time1"], _HWsForDate);
  main.variable(observer("dayBeforeStart")).define("dayBeforeStart", ["focus"], _dayBeforeStart);
  main.variable(observer("buoyDailyData")).define("buoyDailyData", ["dayBeforeStart","limitsDelayed"], _buoyDailyData);
  main.variable(observer("projection")).define("projection", ["d3","width","height","topojson","BC_Midres"], _projection);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("colorMHW")).define("colorMHW", ["d3"], _colorMHW);
  main.variable(observer("opacityMHW")).define("opacityMHW", ["d3"], _opacityMHW);
  main.variable(observer("numFormat")).define("numFormat", ["d3"], _numFormat);
  main.variable(observer("timeFormat")).define("timeFormat", ["d3"], _timeFormat);
  const child2 = runtime.module(define2);
  main.import("Scrubber", child2);
  const child3 = runtime.module(define3);
  main.import("legend", child3);
  const child4 = runtime.module(define4);
  main.import("BC_Midres", child4);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child5 = runtime.module(define5);
  main.import("textcolor", child5);
  main.define("initial p", ["time1"], _p);
  main.variable(observer("mutable p")).define("mutable p", ["Mutable", "initial p"], (M, _) => new M(_));
  main.variable(observer("p")).define("p", ["mutable p"], _ => _.generator);
  main.variable(observer("hwEvent")).define("hwEvent", _hwEvent);
  main.variable(observer()).define(["dateExtent"], _87);
  main.variable(observer()).define(["alldates"], _88);
  main.variable(observer("alldates")).define("alldates", ["d3","dateExtent"], _alldates);
  main.variable(observer("allmonths")).define("allmonths", ["mhwBarData"], _allmonths);
  main.variable(observer()).define(["monthlyTots"], _91);
  main.variable(observer("monthlyTots")).define("monthlyTots", ["allmonths","cats","d3","mhwBarData"], _monthlyTots);
  main.variable(observer()).define(["groups"], _93);
  main.variable(observer()).define(["monthlyGrouped"], _94);
  main.variable(observer("monthlyGrouped")).define("monthlyGrouped", ["groups","cats"], _monthlyGrouped);
  main.variable(observer("cats")).define("cats", _cats);
  main.variable(observer("groups")).define("groups", ["d3","monthlyTots"], _groups);
  main.variable(observer("mhwBarData")).define("mhwBarData", ["FileAttachment"], _mhwBarData);
  main.variable(observer("tt")).define("tt", ["FileAttachment"], _tt);
  return main;
}
