import define1 from "./6be05c6c4b4db0de@455.js";
import define2 from "./4caee69e966109c8@35.js";

function _1(md){return(
md`# Player

Inspired by [https://observablehq.com/@mbostock/scrubber](https://observablehq.com/@mbostock/scrubber).`
)}

function _2(md){return(
md`To use in your notebook:

~~~js
import {Player} from "@oscar6echo/player"
import {style as faStyle} from "@airbornemint/fontawesome"
faStyle({ solid: true })
~~~
`
)}

function _3(md,btn,fas){return(
md`## Options
+ \`format\`: display function - default: \`identity\`
+ \`index\`: returns index of value instead of value - default: \`false\`
+ \`initial\`: initial index - default: \`0\`
+ \`delay\`: time between 2 increments in ms - default \`1000/60\` ie. 60 fps
+ \`autoplay\`: starts upon creation - default: \`true\`
+ \`loop\`: starts over after run: default - default: \`false\`
+ \`alternate\`: change direction after run - default: \`false\`
+ \`width\`: slider width in px - default: \`300\`
+ \`time\`: display runtime - default: \`false\`
+ \`speedFactor\`: speed up/down factor - default: \`1.5\`
+ \`show\`: controls which buttons are displayed - default: \`null\` ie. all buttons
+ \`debug\`: console.logs some events - default: \`false\`

## Buttons:
+ ${btn(fas`play`)} to start play
+ ${btn(fas`pause`)} to pause
+ ${btn(fas`stop`)} to stop and reset
+ ${btn(fas`step-forward`)} to step forward
+ ${btn(fas`step-backward`)} to step backward
+ ${btn(
  fas`chevron-up`
)} to speed up ie. decrease delay (divide by \`speedFactor\`)
+ ${btn(
  fas`chevron-down`
)} to speed down ie. increase delay (multiply by \`speedFactor\`)
+ ${btn(fas`arrow-right`)} or ${btn(fas`arrow-left`)} to toggle direction
+ ${btn(fas`exchange-alt`)} to toggle "change direction when an end is reached"
+ ${btn(fas`redo`)} to toggle "restart from other end when an end is reached"
`
)}

function _4(md){return(
md`## Examples
`
)}

function _numbers(){return(
Array.from({length: 256}, (_, i) => i)
)}

function _dates(){return(
Array.from({ length: 365 }, (_, i) => {
  const date = new Date(2019, 0, 1);
  date.setDate(i + 1);
  return date;
})
)}

function _letters(){return(
'abcdefghijklmnopqrstuvwxyz'.split('')
)}

function _8(md){return(
md`### Format & Initial
`
)}

function _a(Player,dates){return(
Player(dates, {
  autoplay: true,
  initial: 31,
  format: date => date.toLocaleString("en", { month: "long", day: "numeric" })
})
)}

function _10(md,a){return(
md`\`a\` = ${a}`
)}

function _11(md){return(
md`### Index
`
)}

function _b(Player,letters){return(
Player(letters, { index: true, delay: 1000 })
)}

function _13(md,b){return(
md`\`b\` = ${b}`
)}

function _14(md){return(
md`### Delay
`
)}

function _c(Player,numbers){return(
Player(numbers, { delay: 250 })
)}

function _16(md,c){return(
md`\`c\` = ${c}`
)}

function _17(md){return(
md`### Loop & Alternate
`
)}

function _d(Player,numbers){return(
Player(numbers, { loop: true, alternate: true })
)}

function _19(md,d){return(
md`\`d\` = ${d}`
)}

function _20(md){return(
md`### Width & Time
`
)}

function _e(Player,numbers){return(
Player(numbers, {
  width: 450,
  time: true,
  loop: true
})
)}

function _22(md,e){return(
md`\`e\` = ${e}`
)}

function _23(md){return(
md`### Select Buttons
+ \`show\` is an object with keys among [\`play\`, \`stop\`, \`stepLeft\`, \`stepRight\`, \`speedUp\`, \`speedDown\`, \`alternate\`, \`loop\`] - default \`null\` i.e. all buttons are displayed
+ if all values in \`show\` are \`true\`, only those mentioned are displayed
+ if all values in \`show\` are \`false\`, only those mentioned are hidden
+ if all values in \`show\` are \`false\` and \`false\`, those not mentioned are hidden 
+ \`play\` always shows, irrespective of input
`
)}

function _f(Player,letters){return(
Player(letters, {
  delay: 250,
  loop: true,
  show: { play: true }
})
)}

function _25(md,f){return(
md`\`f\` = ${f}`
)}

function _g(Player,letters){return(
Player(letters, {
  delay: 350,
  loop: true,
  show: { stepLeft: false, stepRight: false, alternate: false }
})
)}

function _27(md,g){return(
md`\`g\` = ${g}`
)}

function _28(md){return(
md`### Programmatic Update
To update a player from outside, via third party code, use its \`update()\` method.  
For more info about this approach see notebook [Nesting & Setting viewof](https://observablehq.com/@oscar6echo/nesting-viewof).  
`
)}

function _29(html,letters,$0)
{
  const text = 'update player g';
  const btn = html`<button>${text}`;
  btn.onclick = () => {
    const v = Math.floor(Math.random() * letters.length);
    $0.update(v);
    btn.innerHTML = `${text} (latest jump to ${v})`;
  };
  return btn;
}


function _30(html,$0)
{
  const text = 'toggle player g play/pause';
  const btn = html`<button>${text}`;
  btn.onclick = () => {
    $0.remoteClickPlayPause();
  };
  return btn;
}


function _31(md){return(
md`---

## Implementation`
)}

function _Player(html,fas,sb,bgc2,bgc,disposal){return(
function Player(
  values,
  {
    format = (value) => value,
    index = false,
    initial = 0,
    delay = 1000 / 60,
    autoplay = true,
    loop = false,
    alternate = false,
    width = 300,
    time = false,
    speedFactor = 1.5,
    debug = false,
    show = null
  } = {}
) {
  const delay0 = delay;
  const alternate0 = alternate;
  const loop0 = loop;

  values = Array.from(values);
  let idx = initial;
  let isPlay = false;
  let isAlternate = null;
  let isLoop = null;

  let isForward = true;
  let timer = null;
  let t0 = null;
  let t1 = null;

  const sf = `
    font: 12px var(--sans-serif);
    font-variant-numeric: tabular-nums;
    display: flex;
    height: 33px;
    align-items: center;
  `;

  const icons = {
    play: html`${fas`play`}`,
    pause: html`${fas`pause`}`,
    stop: html`${fas`stop`}`,
    speedUp: html`${fas`chevron-up`}`,
    speedDown: html`${fas`chevron-down`}`,
    toRight: html`${fas`arrow-right`}`,
    toLeft: html`${fas`arrow-left`}`,
    alternate: html`${fas`exchange-alt`}`,
    loop: html`${fas`redo`}`,
    stepRight: html`${fas`step-forward`}`,
    stepLeft: html`${fas`step-backward`}`
  };

  const btnDesc = [
    ["p", "play"],
    ["s", "stop"],
    ["l", "stepLeft"],
    ["r", "stepRight"],
    ["u", "speedUp"],
    ["d", "speedDown"],
    ["w", "toRight"],
    ["a", "alternate"],
    ["b", "loop"]
  ];

  const func = !show
    ? (acc, v) => ((acc[v] = true), acc)
    : Object.values(show).every((e) => e)
    ? (acc, v) => ((acc[v] = show[v] === true ? true : false), acc)
    : Object.values(show).every((e) => !e)
    ? (acc, v) => ((acc[v] = show[v] === false ? false : true), acc)
    : (acc, v) => ((acc[v] = show[v] || true), acc);

  const showBtn = btnDesc.map((e) => e[1]).reduce(func, {});
  showBtn.play = true;

  const btns = btnDesc.map(([x, kind]) => {
    if (!showBtn[kind]) return "";
    const icon = icons[kind];
    return html`<button name=${x} id="butts" type=button style="${sb}">${icon}</button>`;
  });

  const form = html`  
<form style="${sf}">
  ${btns}
  <label style="display: none; align-items: center;">
    <input name=i type=range min=0 max=${
      values.length - 1
    } value=${idx} step=1 style="width: ${width}px;">
    <output name=o style="margin-left: 0.4em;">${format(values[idx])}</output>
  </label>
</form>
`;
  const h = html`
<form style="display:flex; justify-content:space-between;">
  <div>${form}</div>
  <output name=t style="${sf}"></output>
</form>
`;
  function log(txt) {
    if (debug) console.log(txt);
  }
  function updateIconP() {
    const before = form.p.firstChild;
    const after = isPlay ? icons.pause : icons.play;
    form.p.replaceChild(after, before);
  }
  function updateIconW() {
    if (!showBtn.way) return;
    const before = form.w.firstChild;
    const after = isForward ? icons.toRight : icons.toLeft;
    form.w.replaceChild(after, before);
  }
  function updateIconStyleA() {
    if (!showBtn.alternate) return;
    form.a.style.background = isAlternate ? bgc2 : bgc;
  }
  function updateIconStyleB() {
    if (!showBtn.loop) return;
    form.b.style.background = isLoop ? bgc2 : bgc;
  }
  function updateForm() {
    form.i.valueAsNumber = idx;
    form.value = values[idx];
    form.o.value = format(form.value, form.i.valueAsNumber, values);
    dispatchEvent();
  }
  function dispatchEvent() {
    h.value = index ? idx : values[idx];
    h.dispatchEvent(new CustomEvent("input", { bubbles: true }));
  }
  function resetTime() {
    t0 = new Date();
  }
  function clearTime() {
    h.t.value = "";
  }
  function updateTime() {
    const t1 = new Date();
    const dt = (t1.getTime() - t0.getTime()) / 1000;
    if (time) h.t.value = `${dt.toFixed(2)} s`;
  }

  function step() {
    const first = 0;
    const last = values.length - 1;
    let move = true;
    if (isForward) {
      if (idx < last) {
        idx++;
      } else if (isLoop) {
        if (isAlternate) {
          idx = last - 1;
          isForward = false;
          updateIconW();
        } else {
          idx = first;
        }
      } else {
        move = false;
      }
    } else if (idx > first) {
      idx--;
    } else if (isLoop) {
      if (isAlternate) {
        idx = first + 1;
        isForward = true;
        updateIconW();
      } else {
        idx = last;
      }
    } else {
      move = false;
    }
    if (!move) {
      log("no move");
      clearInterval(timer);
      isPlay = false;
      updateIconP();
    }
    updateForm();
    updateTime();
    log(idx);
  }

  function setTimer() {
    step();
    if (isPlay) timer = setTimeout(setTimer, delay);
  }

  function clickPlayPause() {
    if (isPlay) {
      log("clicked pause");
      isPlay = false;
      clearTimeout(timer);
    } else {
      log("clicked play");
      isPlay = true;
      resetTime();
      if (isForward && idx === values.length - 1) idx = 0;
      if (!isForward && idx === 0) idx = values.length - 1;
      updateIconP();
      setTimer();
    }
    updateIconP();
  }
  function clickStop() {
    log("clicked stop");
    clearInterval(timer);
    isPlay = false;
    idx = initial;
    delay = delay0;
    alternate = alternate0;
    loop = loop0;
    updateIconStyleA();
    updateIconStyleB();
    updateIconP();
    updateForm();
    clearTime();
  }
  function clickStepLeft() {
    log("clicked step left");
    if (!isPlay) {
      if (isForward) {
        isForward = false;
        updateIconW();
      }
      step();
    }
  }
  function clickStepRight() {
    log("clicked step right");
    if (!isPlay) {
      if (!isForward) {
        isForward = true;
        updateIconW();
      }
      step();
    }
  }
  function clickSpeedUp() {
    log("clicked speed up");
    delay /= speedFactor;
    log(delay);
  }
  function clickSpeedDown() {
    log("clicked speed down");
    delay *= speedFactor;
    log(delay);
  }
  function clickWay() {
    log("clicked toggle way");
    isForward = !isForward;
    updateIconW();
  }
  function clickAlternate() {
    log("clicked toggle alternate");
    isAlternate = !isAlternate;
    updateIconStyleA();
  }
  function clickLoop() {
    log("clicked toggle loop");
    isLoop = !isLoop;
    updateIconStyleB();
  }

  if (showBtn.play) form.p.onclick = clickPlayPause;
  if (showBtn.stop) form.s.onclick = clickStop;
  if (showBtn.stepLeft) form.l.onclick = clickStepLeft;
  if (showBtn.stepRight) form.r.onclick = clickStepRight;
  if (showBtn.speedUp) form.u.onclick = clickSpeedUp;
  if (showBtn.speedDown) form.d.onclick = clickSpeedDown;
  if (showBtn.way) form.w.onclick = clickWay;
  if (showBtn.alternate) form.a.onclick = clickAlternate;
  if (showBtn.loop) form.b.onclick = clickLoop;

  form.i.oninput = (event) => {
    // console.log('form.i event', event, form.i.valueAsNumber, form.i.value);
    idx = form.i.valueAsNumber;
    updateForm();
  };

  if (alternate) clickAlternate();
  if (loop) clickLoop();
  if (autoplay) clickPlayPause();
  dispatchEvent();
  if (showBtn.stop) disposal(form).then(clickStop);

  const update = (i) => {
    idx = i;
    updateForm();
  };

  const remoteClickPlayPause = () => {
    clickPlayPause();
  };

  return Object.assign(h, { update, remoteClickPlayPause });
}
)}

function _33(md){return(
md`## Annex
`
)}

function _btn(html,sb){return(
function (x) {
  return html`<button name=p id=butt type=button style="${sb}">${x}</button>`;
}
)}

function _sb(bgc){return(
`
margin-right: 0.3em;
width: 2em;
border-radius:0;
background-color:${bgc};
border: 1px solid #bbb;
outline: none
`
)}

function _bgc(){return(
'#f5f5f5'
)}

function _bgc2(){return(
'#cdcdcd'
)}

function _fas(){return(
function fas(s) {
  return `<i class="fas fa-${String.raw(...arguments)} fa-xs"></i>`;
}
)}

function _39(faStyle){return(
faStyle({ solid: true })
)}

function _40(faStyle){return(
faStyle
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md","btn","fas"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("numbers")).define("numbers", _numbers);
  main.variable(observer("dates")).define("dates", _dates);
  main.variable(observer("letters")).define("letters", _letters);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("viewof a")).define("viewof a", ["Player","dates"], _a);
  main.variable(observer("a")).define("a", ["Generators", "viewof a"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","a"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("viewof b")).define("viewof b", ["Player","letters"], _b);
  main.variable(observer("b")).define("b", ["Generators", "viewof b"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","b"], _13);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("viewof c")).define("viewof c", ["Player","numbers"], _c);
  main.variable(observer("c")).define("c", ["Generators", "viewof c"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","c"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("viewof d")).define("viewof d", ["Player","numbers"], _d);
  main.variable(observer("d")).define("d", ["Generators", "viewof d"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","d"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer("viewof e")).define("viewof e", ["Player","numbers"], _e);
  main.variable(observer("e")).define("e", ["Generators", "viewof e"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","e"], _22);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("viewof f")).define("viewof f", ["Player","letters"], _f);
  main.variable(observer("f")).define("f", ["Generators", "viewof f"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","f"], _25);
  main.variable(observer("viewof g")).define("viewof g", ["Player","letters"], _g);
  main.variable(observer("g")).define("g", ["Generators", "viewof g"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","g"], _27);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer()).define(["html","letters","viewof g"], _29);
  main.variable(observer()).define(["html","viewof g"], _30);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer("Player")).define("Player", ["html","fas","sb","bgc2","bgc","disposal"], _Player);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer("btn")).define("btn", ["html","sb"], _btn);
  main.variable(observer("sb")).define("sb", ["bgc"], _sb);
  main.variable(observer("bgc")).define("bgc", _bgc);
  main.variable(observer("bgc2")).define("bgc2", _bgc2);
  main.variable(observer("fas")).define("fas", _fas);
  main.variable(observer()).define(["faStyle"], _39);
  main.variable(observer()).define(["faStyle"], _40);
  const child1 = runtime.module(define1);
  main.import("style", "faStyle", child1);
  const child2 = runtime.module(define2);
  main.import("disposal", child2);
  return main;
}
