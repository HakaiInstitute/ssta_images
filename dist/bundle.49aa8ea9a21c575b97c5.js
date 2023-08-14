(self.webpackChunkssta=self.webpackChunkssta||[]).push([[592],{592:(e,t,n)=>{"use strict";function a(e){return e`# Stylized Scrubber


This reusable input is intended to drive animations while providing the reader interactive control on demand: the animation pauses when the user interacts with the slider, but can be resumed by clicking the play button. For examples, see [Bar Chart Race](/@mbostock/bar-chart-race-with-scrubber), [The Wealth & Health of Nations](/@mbostock/the-wealth-health-of-nations), [Solar Path](/@mbostock/solar-path), or [Animated Treemap](/@d3/animated-treemap).`}function i(e){return e`To use in your notebook:

~~~js
import {Scrubber} from "@mbostock/scrubber"
~~~
`}function r(){return Array.from({length:100},((e,t)=>t))}function o(e,t){return e`The current value of *i* is ${t}.`}function l(e){return e`Given an array of *values* representing the discrete frames of the animation, such as an array of numbers or dates, Scrubber returns a [view-compatible input](/@observablehq/introduction-to-views). (It uses the [disposal promise](/@mbostock/disposal) to stop the animation automatically on invalidation.)`}function u(e){return e`## Options

Scrubber has several options which you can pass as the second argument.`}function s(e){return e`The *autoplay* option, which defaults to true, specifies whether the animation plays automatically. Set it to false to require the reader to click on the play button.`}function d(e,t){return e(t,{autoplay:!1})}function c(e){return e`The *loop* option, which defaults to true, specifies whether the animation should automatically restart from the beginning after the end is reached. Set it to false to require the reader to click the play button to restart the animation after it ends.`}function f(e){return e`The *alternate* option, which defaults to false, specifies whether the animation should reverse direction when it reaches the end, rather than repeat from the start.`}function m(e,t){return e(t,{loop:!1,alternate:!0})}function b(e){return e`The *delay* option, which defaults to null, specifies how long to wait between frames in milliseconds. A null value means to use [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame), which typically means sixty times per second (about 17ms). Non-null delays use [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval).`}function h(e){return e`The *loopDelay* option, which defaults to 0, specifies how long to wait before looping in milliseconds. This can be paired with the *initial* option to show the ending value before the animation starts anew from the beginning.`}function p(e){return e`The *format* option, which defaults to the identity function, specifies how to display the currently-selected value. The *format* function is passed the current value, the current (zero-based) index, and the values array.`}function v(){return Array.from({length:365},((e,t)=>{const n=new Date(2019,0,1);return n.setDate(t+1),n}))}function w(e,t){return e(t,{autoplay:!1,loop:!1,format:e=>e.toLocaleString("en",{month:"long",day:"numeric"})})}function y(e,t,n){return e(t,{initial:n,delay:1e3,autoplay:!1,loopDelay:1e3})}function g(e){return e.value}function A(e){return e}function N(){return 30}function k(e){return e.value}function x(e){return e.o.form.value=1}function S(e){return e.value=1}function T(e){return e.o.value=1}function I(e){return e.o.value}function q(e){return e}function D(e){return e`If you have suggestions for other options you’d like to see, please let me know!`}function F(e){return e`---

## Implementation`}function z(e){return e`
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
`}function C(e,t){return function(n,{format:a=(e=>e),index:i=!1,initial:r=0,delay:o=null,autoplay:l=!0,loop:u=!0,loopDelay:s=null,alternate:d=!1}={}){n=Array.from(n);let c=e`<form style="font: 12px var(--sans-serif); font-variant-numeric: tabular-nums; display: flex; height: 50px; align-items: center;">
  <button name=b class=button  type=button ></button>
  <label style="display: flex; align-items: center;">
    <input id='dot' name=i type=range min=0 max=${n.length-1} value=${r} step=1 style="width: 0px;">
    <output name=o style="margin-left: 0.4em;"></output>
  </label>
</form>`,f=null,m=null,b=null,h=1;function p(){c.b.classList.add("paused"),null===o?f=requestAnimationFrame(y):b=setInterval(y,o)}function v(){c.b.classList.remove("paused"),null!==f&&(cancelAnimationFrame(f),f=null),null!==m&&(clearTimeout(m),m=null),null!==b&&(clearInterval(b),b=null)}function w(){return null!==f||null!==m||null!==b}function y(){if(c.i.valueAsNumber===(h>0?n.length-1:h<0?0:NaN)){if(!u)return v();if(d&&(h=-h),null!==s)return null!==f&&(cancelAnimationFrame(f),f=null),null!==b&&(clearInterval(b),b=null),void(m=setTimeout((()=>(g(),p())),s))}null===o&&(f=requestAnimationFrame(y)),g()}function g(){c.i.valueAsNumber=(c.i.valueAsNumber+h+n.length)%n.length,c.i.dispatchEvent(new CustomEvent("input",{bubbles:!0}))}return console.log(c.i.value),c.i.oninput=e=>{e&&e.isTrusted&&w()&&v(),c.value=n[c.i.valueAsNumber],c.o.value=a(c.value,c.i.valueAsNumber,n)},c.b.onclick=()=>{if(w())return v();h=d&&c.i.valueAsNumber===n.length-1?-1:1,c.i.valueAsNumber=(c.i.valueAsNumber+h)%n.length,c.i.dispatchEvent(new CustomEvent("input",{bubbles:!0})),p()},c.i.oninput(),l?p():v(),t.disposal(c).then(v),c}}function W(e,t){const n=e.module();return n.variable(t()).define(["md"],a),n.variable(t()).define(["md"],i),n.variable(t("numbers")).define("numbers",r),n.variable(t()).define(["md","i"],o),n.variable(t()).define(["md"],l),n.variable(t()).define(["md"],u),n.variable(t("autoplay")).define("autoplay",["md"],s),n.variable(t()).define(["Scrubber","numbers"],d),n.variable(t("loop")).define("loop",["md"],c),n.variable(t()).define(["md"],f),n.variable(t()).define(["Scrubber","numbers"],m),n.variable(t("delay")).define("delay",["md"],b),n.variable(t("loopDelay")).define("loopDelay",["md"],h),n.variable(t("format")).define("format",["md"],p),n.variable(t("dates")).define("dates",v),n.variable(t("viewof date")).define("viewof date",["Scrubber","dates"],w),n.variable(t("date")).define("date",["Generators","viewof date"],((e,t)=>e.input(t))),n.variable(t("viewof num")).define("viewof num",["Scrubber","numbers","newNum"],y),n.variable(t("num")).define("num",["Generators","viewof num"],((e,t)=>e.input(t))),n.variable(t()).define(["viewof num"],g),n.variable(t()).define(["newNum"],A),n.define("initial newNum",N),n.variable(t("mutable newNum")).define("mutable newNum",["Mutable","initial newNum"],((e,t)=>new e(t))),n.variable(t("newNum")).define("newNum",["mutable newNum"],(e=>e.generator)),n.variable(t()).define(["viewof num"],k),n.variable(t()).define(["viewof num"],x),n.variable(t()).define(["viewof num"],S),n.variable(t()).define(["viewof num"],T),n.variable(t()).define(["viewof num"],I),n.variable(t()).define(["num"],q),n.variable(t()).define(["md"],D),n.variable(t()).define(["md"],F),n.variable(t("style")).define("style",["html"],z),n.variable(t("Scrubber")).define("Scrubber",["html","Inputs"],C),n}n.r(t),n.d(t,{default:()=>W})}}]);
//# sourceMappingURL=bundle.49aa8ea9a21c575b97c5.js.map