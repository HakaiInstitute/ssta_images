(self.webpackChunkssta=self.webpackChunkssta||[]).push([[640],{640:(e,t,n)=>{"use strict";function r(e){return e`# Stylized Scrubber


This reusable input is intended to drive animations while providing the reader interactive control on demand: the animation pauses when the user interacts with the slider, but can be resumed by clicking the play button. For examples, see [Bar Chart Race](/@mbostock/bar-chart-race-with-scrubber), [The Wealth & Health of Nations](/@mbostock/the-wealth-health-of-nations), [Solar Path](/@mbostock/solar-path), or [Animated Treemap](/@d3/animated-treemap).`}function a(e){return e`To use in your notebook:

~~~js
import {Scrubber} from "@mbostock/scrubber"
~~~
`}function i(e,t){return e(t)}function o(){return Array.from({length:2e4},((e,t)=>t))}function l(e,t){return e`The current value of *i* is ${t}.`}function u(e){return e`Given an array of *values* representing the discrete frames of the animation, such as an array of numbers or dates, Scrubber returns a [view-compatible input](/@observablehq/introduction-to-views). (It uses the [disposal promise](/@mbostock/disposal) to stop the animation automatically on invalidation.)`}function s(e){return e`## Options

Scrubber has several options which you can pass as the second argument.`}function d(e){return e`The *autoplay* option, which defaults to true, specifies whether the animation plays automatically. Set it to false to require the reader to click on the play button.`}function c(e,t){return e(t,{autoplay:!1})}function b(e){return e`The *loop* option, which defaults to true, specifies whether the animation should automatically restart from the beginning after the end is reached. Set it to false to require the reader to click the play button to restart the animation after it ends.`}function f(e,t){return e(t,{loop:!1})}function h(e){return e.update(3)}function m(e){return e`The *alternate* option, which defaults to false, specifies whether the animation should reverse direction when it reaches the end, rather than repeat from the start.`}function p(e,t){return e(t,{loop:!1,alternate:!0})}function v(e){return e`The *delay* option, which defaults to null, specifies how long to wait between frames in milliseconds. A null value means to use [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame), which typically means sixty times per second (about 17ms). Non-null delays use [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval).`}function y(e){return e(["red","green","blue"],{delay:1e3})}function w(e){return e`The *loopDelay* option, which defaults to 0, specifies how long to wait before looping in milliseconds. This can be paired with the *initial* option to show the ending value before the animation starts anew from the beginning.`}function g(e,t){return e(t,{initial:t.length-1,loopDelay:1e3})}function A(e){return e`The *format* option, which defaults to the identity function, specifies how to display the currently-selected value. The *format* function is passed the current value, the current (zero-based) index, and the values array.`}function S(){return Array.from({length:365},((e,t)=>{const n=new Date(2019,0,1);return n.setDate(t+1),n}))}function k(e,t){return e(t,{autoplay:!1,loop:!1,format:e=>e.toLocaleString("en",{month:"long",day:"numeric"})})}function x(e){return e}function N(e){return e`If you have suggestions for other options you’d like to see, please let me know!`}function T(e){return e`---

## Implementation`}function I(e){return e`
<style>
  .button {
  border: 0;
  background: transparent;
  box-sizing: border-box;
  width: 100;
  height: 74px;
  border-color: transparent transparent transparent #202020;
  transition: 100ms all ease;
  cursor: pointer;
  border-style: solid;
  border-width: 37px 0 37px 60px;
accent-color:pink
}
.paused {
  border-style: double;
  border-width: 0px 0 0px 60px;
}
.button:hover {
  border-color: transparent transparent transparent #404040;
}
input{
 accent-color:white
}

  </style>
`}function q(e,t){return function(n,{format:r=(e=>e),initial:a=0,delay:i=null,autoplay:o=!0,loop:l=!0,loopDelay:u=null,alternate:s=!1}={}){n=Array.from(n);const d=e`<form style="font: 12px var(--sans-serif); font-variant-numeric: tabular-nums; display: flex; height: 50px; align-items: center;">
  <button name=b class=button  type=button ></button>
  <label style="display: flex; align-items: center;">
    <input name=i type=range min=0 max=${n.length-1} value=${a} step=1 style="width: 0px;">
    <output name=o style="margin-left: 0.4em;"></output>
  </label>
</form>`;let c=null,b=null,f=null,h=1;function m(){d.b.classList.add("paused"),null===i?c=requestAnimationFrame(y):f=setInterval(y,i)}function p(){d.b.classList.remove("paused"),null!==c&&(cancelAnimationFrame(c),c=null),null!==b&&(clearTimeout(b),b=null),null!==f&&(clearInterval(f),f=null)}function v(){return null!==c||null!==b||null!==f}function y(){if(d.i.valueAsNumber===(h>0?n.length-1:h<0?0:NaN)){if(!l)return p();if(s&&(h=-h),null!==u)return null!==c&&(cancelAnimationFrame(c),c=null),null!==f&&(clearInterval(f),f=null),void(b=setTimeout((()=>(w(),m())),u))}null===i&&(c=requestAnimationFrame(y)),w()}function w(){d.i.valueAsNumber=(d.i.valueAsNumber+h+n.length)%n.length,d.i.dispatchEvent(new CustomEvent("input",{bubbles:!0}))}return d.i.oninput=e=>{e&&e.isTrusted&&v()&&p(),d.value=n[d.i.valueAsNumber],d.o.value=r(d.value,d.i.valueAsNumber,n)},d.b.onclick=()=>{if(v())return p();h=s&&d.i.valueAsNumber===n.length-1?-1:1,d.i.valueAsNumber=(d.i.valueAsNumber+h)%n.length,d.i.dispatchEvent(new CustomEvent("input",{bubbles:!0})),m()},d.i.oninput(),o?m():p(),t.disposal(d).then(p),d}}function D(e,t){const n=e.module();return n.variable(t()).define(["md"],r),n.variable(t()).define(["md"],a),n.variable(t("viewof i")).define("viewof i",["Scrubber","numbers"],i),n.variable(t("i")).define("i",["Generators","viewof i"],((e,t)=>e.input(t))),n.variable(t("numbers")).define("numbers",o),n.variable(t()).define(["md","i"],l),n.variable(t()).define(["md"],u),n.variable(t()).define(["md"],s),n.variable(t("autoplay")).define("autoplay",["md"],d),n.variable(t()).define(["Scrubber","numbers"],c),n.variable(t("loop")).define("loop",["md"],b),n.variable(t("viewof Num")).define("viewof Num",["Scrubber","numbers"],f),n.variable(t("Num")).define("Num",["Generators","viewof Num"],((e,t)=>e.input(t))),n.variable(t()).define(["viewof Num"],h),n.variable(t()).define(["md"],m),n.variable(t()).define(["Scrubber","numbers"],p),n.variable(t("delay")).define("delay",["md"],v),n.variable(t()).define(["Scrubber"],y),n.variable(t("loopDelay")).define("loopDelay",["md"],w),n.variable(t()).define(["Scrubber","numbers"],g),n.variable(t("format")).define("format",["md"],A),n.variable(t("dates")).define("dates",S),n.variable(t("viewof date")).define("viewof date",["Scrubber","dates"],k),n.variable(t("date")).define("date",["Generators","viewof date"],((e,t)=>e.input(t))),n.variable(t()).define(["date"],x),n.variable(t()).define(["md"],N),n.variable(t()).define(["md"],T),n.variable(t("style")).define("style",["html"],I),n.variable(t("Scrubber")).define("Scrubber",["html","Inputs"],q),n}n.r(t),n.d(t,{default:()=>D})}}]);
//# sourceMappingURL=bundle.3537120b63d169ba725a.js.map