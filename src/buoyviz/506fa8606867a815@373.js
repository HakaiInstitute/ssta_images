// https://observablehq.com/@observablehq/text-color-annotations-in-markdown@373
import define1 from "./388e64af7cdc956c@80.js";

function _1(md){return(
md`# Text color annotations in markdown
In notebooks we often write text that accompanies a data visualization using markdown. Here we provide a helper function that allows you to match the background color of a piece of text to the color used in your chart.
`
)}

function _2(md){return(
md`### For example`
)}

function _3(textcolor,d3,md){return(
md`In the chart below, we can see ${textcolor('AMZN', d3.schemeTableau10[1])} overtaking ${textcolor('GOOG', d3.schemeTableau10[2])} between 2016 and 2018.`
)}

function _4(Plot,stocks){return(
Plot.plot({
  marginRight: 40,
  y: {
    grid: true,
    label: "↑ Price ($)"
  },
  marks: [
    Plot.ruleY([0]),
    Plot.line(stocks, {x: "Date", y: "Close", stroke: "Symbol"}),
    Plot.text(stocks, Plot.selectLast({x: "Date", y: "Close", z: "Symbol", text: "Symbol", textAnchor: "start", dx: 3, fill: "Symbol"}))
  ]
})
)}

function _5(md){return(
md`*For more inspiration on how this technique can be used, see how [Sophie Beiers](https://sophiebeiers.com) applied it in this [data-driven story](https://graphics.aclu.org/south_carolina/) for the ACLU.*`
)}

function _6(md){return(
md`---
## Usage  

~~~js
// Import into your own notebook first
import {textcolor} from "@observablehq/text-color-annotations-in-markdown"
~~~

Then, anywhere in your markdown you can call the following function:
~~~js
$\{textcolor('category', 'green')}
~~~
Where the first argument is the text you'd like to color, and the second is an HTML valid color.
`
)}

function _7(textcolor,md){return(
md`Here's some ${textcolor('highlighted', 'darkgreen')} text.`
)}

function _8(textcolor,md){return(
md`You can override the ${textcolor('foreground color', {background: '#111111', color: 'pink'})} by specifying an options object instead of a background color. The options object can also be used define other css properties, like using an ${textcolor('italic', {background: 'purple', fontStyle: 'italic'})} font style or adding ${textcolor('more padding', {background: '#5bc9cf', padding: "0 20px"})}`
)}

function _9(textcolor,d3,md){return(
md`You can use colors from d3 color scales like ${textcolor('AMZN', d3.schemeTableau10[1])} in our chart example above.`
)}

function _10(md){return(
md`---
## Implementation`
)}

function _textcolor(d3,htl){return(
function textcolor(content, style = {}) {
  function yiq(color) {
    const {r, g, b} = d3.rgb(color);
    return (r * 299 + g * 587 + b * 114) / 1000 / 255; // returns values between 0 and 1
  }
  const {
    background,
    color = yiq(background) >= 0.6 ? "#111" : "white", 
    padding = "0 5px",
    borderRadius = "4px",
    fontWeight = 800,
    ...rest
  } = typeof style === "string" ? {background: style} : style;
  return htl.html`<span style=${{
    background, 
    color, 
    padding, 
    borderRadius, 
    fontWeight, 
    ...rest
  }}>${content}</span>`;
}
)}

function _12(md){return(
md`## Appendix`
)}

function _13(md){return(
md`### Notes
The "yiq" function in the code above calculates whether a given background color should be dark or light to improve contrast. See [Text color based on luminance](https://observablehq.com/@vsaarinen/text-color-based-on-luminance). Alternatively, you could use \`\`\`d3.lab(color).l\`\`\` for similar effect. 

The chart and data is based on the [Observable Plot documentation](https://observablehq.com/@observablehq/plot-select). `
)}

function _14(md){return(
md`### Acknowledgements

*Thank you to [Mike Bostock](https://observablehq.com/@mbostock), [Ian Johnson](https://observablehq.com/@enjalot), and [Fil Rivière](https://observablehq.com/@fil) for their help, ideas, and code review. Thank you to [Ville Saarinen](https://observablehq.com/@vsaarinen)
for the [notebook on luminance and text color](https://observablehq.com/@vsaarinen/text-color-based-on-luminance). *`
)}

function _15(md){return(
md`### Import data for chart`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["textcolor","d3","md"], _3);
  main.variable(observer()).define(["Plot","stocks"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["textcolor","md"], _7);
  main.variable(observer()).define(["textcolor","md"], _8);
  main.variable(observer()).define(["textcolor","d3","md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("textcolor")).define("textcolor", ["d3","htl"], _textcolor);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer()).define(["md"], _15);
  const child1 = runtime.module(define1);
  main.import("stocks", child1);
  return main;
}
