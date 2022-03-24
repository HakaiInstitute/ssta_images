// https://observablehq.com/@innermatrix/preact@130
function _1(md){return(
md`# Preact`
)}

function _2(md){return(
md`A utility for rendering preact in Observable notebooks. Use like so:

~~~js
import { render, htm } from "@airbornemint/preact"
~~~
`
)}

function _3(render,htm){return(
render(htm)`
  <p>Lorem <i>ipsum</i></p>
`
)}

function _4(md){return(
md`By default, the DOM is rendered inside a plain \`div\`, but you can customize it:`
)}

function _5(render,htm,html){return(
render(htm, html`<div style="color: red"/>`)`
  <p>Lorem <i>ipsum</i></p>
`
)}

function _6(md){return(
md`Also works as an Observable view:`
)}

function _testValue(render,htm){return(
render(htm)`<input type="range"/>`
)}

function _8(testValue){return(
testValue
)}

function _t1(render,htm,Test){return(
render(htm)`<${Test}/>`
)}

function _Test(Preact,InputEvent,htm){return(
class Test extends Preact.Component {
  constructor() {
    super();
    this.ref = Preact.createRef();
    this.state = { value: 0 };
  }

  onInput() {
    return (evt => {
      var value = parseInt(evt.target.value);
      this.setState({ value: value });
      console.log('onInput', evt.target.value, this.state);
      evt.stopPropagation();
      this.ref.current.value = value;
      this.ref.current.dispatchEvent(
        new InputEvent('input', { bubbles: true })
      );
    }).bind(this);
  }

  componentDidMount() {
    debugger;
    this.ref.current.value = this.state.value;
    console.log("componentDidMount", this.state);
    this.ref.current.dispatchEvent(new InputEvent('input', { bubbles: true }));
  }

  render({ children }, { value }) {
    return htm`<div ref=${this.ref}><ul>${[
      ...Array(value).fill(false),
      true
    ].map((input, idx) =>
      input
        ? htm`<li key='input'><input onInput=${this.onInput()} value=${value}/></li>`
        : htm`<li key='not-input-${idx}'>Not an input (#${idx})</li>`
    )}
  </ul></div>`;
  }
}
)}

function _11(t1){return(
t1
)}

function _12(md){return(
md`---
## Implementation`
)}

function _render(html,Preact){return(
function render(vdommer, container = html`<div/>`) {
  return function() {
    Preact.render(vdommer(...arguments), container);
    container.addEventListener(
      'input',
      evt => {
        // Can allow event to bubble because not altering value
        container.value = evt.target.value;
      },
      { passive: true }
    );

    // If you need composite value from children, it's on you to construct it
    container.value = [...container.children]
      .map(child => child.value)
      .find(value => value !== undefined);
    return container;
  };
}
)}

async function _htm(require,Preact){return(
(await require("htm@2/dist/htm.umd.js")).bind(Preact.h)
)}

function _Preact(require){return(
require('preact@10/dist/preact.umd.js')
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["render","htm"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["render","htm","html"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("viewof testValue")).define("viewof testValue", ["render","htm"], _testValue);
  main.variable(observer("testValue")).define("testValue", ["Generators", "viewof testValue"], (G, _) => G.input(_));
  main.variable(observer()).define(["testValue"], _8);
  main.variable(observer("viewof t1")).define("viewof t1", ["render","htm","Test"], _t1);
  main.variable(observer("t1")).define("t1", ["Generators", "viewof t1"], (G, _) => G.input(_));
  main.variable(observer("Test")).define("Test", ["Preact","InputEvent","htm"], _Test);
  main.variable(observer()).define(["t1"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("render")).define("render", ["html","Preact"], _render);
  main.variable(observer("htm")).define("htm", ["require","Preact"], _htm);
  main.variable(observer("Preact")).define("Preact", ["require"], _Preact);
  return main;
}
