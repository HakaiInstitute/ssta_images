(self.webpackChunkssta=self.webpackChunkssta||[]).push([[652],{652:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>rt});var n=a(479);function r(e){return e`# Marine heatwave charts and brush/player

used to embed as a module in https://cioospacific.ca/applied-data/marine-heat-monitor/

curl -o bs.tgz "https://api.observablehq.com/d/0b936d79280ee3bd.tgz?v=3"

tar -C src/buoyviz -xvzf bs.tgz

This notebook includes
- loading the buoy data via api
- data brush chart (loads from github)
- scrubber for playing the animation in the website
- charts for the buoys

### Change log
June 22 2022
- replaced the player notebook with scrubber, as font awesome used in the player was not playing well with webpack.


`}function i(e,t,a){return e`# ${t(new Date(a))}`}function o(e){return e`date to stop playing. Ideally this should be a only a couple days in the past since data is usually updated each day`}function l(e){return e.timeDay.offset(e.utcDay(),-2)}function d(e){return e.timeDay.offset(e.utcDay(),-2)}function s(e,t,a){return e`
<style>

  /* match the scrubber's width to our race chart */
   // input[type="range"][name="i"] {
   //   width: ${t-90}px !important;
   // }

.${a}{
  font-size: 16px;  
}


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
  .button {
color:lightgrey;
  border: 0;
  background: transparent;
  box-sizing: border-box;
  width: 100;
  height: 74px;
  border-color: transparent transparent transparent lightgrey;
  transition: 100ms all ease;
  cursor: pointer;
  border-style: solid;
  border-width: 37px 0 37px 60px;
transform: scale(.7);
}
.paused {
  border-style: double;
  border-width: 0px 0 0px 60px;
}
.button:hover {
  border-color: transparent transparent transparent #8f8f8f;
}
// input[type="range"][name="input"] {
// accent-color:blue

// }

#dot{
 accent-color:black
}
.fa-xs {
    font-size: 5.75em;
}



</style>
`}function u(e){return e}function c(e){return e`play`}function f(e,t,a){return e(t,{width:0,delay:100,initial:a,autoplay:!1,loop:!1,format:e=>""})}function b(e){return e`anomaly or category button`}function m(e,t){return e.radio(["Anomaly","Heatwaves"],{value:"Anomaly",format:e=>t`<span style="color: white">${e}`})}function h(){return 0}function g(e){return e}function v(e,t){return e[e.length-1].date<new Date(t[t.length-1])&&e.push({date:new Date(t[t.length-1]),value:-99}),e}function p(e){return e[e.length-1]}function y(e,t,a,n,r,i,o,l,d,s,u,c,f,b,m,h,g){if("Heatwaves"===e){const e=t,m=a.create("svg").attr("viewBox",[0,0,n,e]).style("display","block"),h=a.scaleLinear().domain([0,1]).range([e-r.bottom,r.top+5]),g=(e,t,i)=>e.attr("transform",`translate(0,${i-r.bottom})`).call(a.axisBottom(t).ticks(n/80).tickSizeOuter(0)).style("stroke","#e0f5ee");m.append("g").call(g,i,e).attr("class","axisWhite");const v=o(l);return m.append("g").selectAll("g").data(v).join("g").style("fill",((e,t)=>(console.log(e),e.date>new Date("2022-08-01")?"grey":d.get(e.key)))).selectAll("rect").data((e=>e)).join("rect").attr("x",(e=>s(new Date(e.data.date).toISOString().substring(0,10)))).attr("y",(e=>h(e[1]))).attr("height",(e=>h(e[0])-h(e[1]))).attr("width",s.bandwidth()),m.append("line").datum([{date:u,value:1}]).attr("x1",(e=>c(u))).attr("x2",(e=>c(u))).attr("y2",h(1)).attr("y1",h(0)).attr("fill","none").attr("stroke","blue").attr("stoke-width",1.5).attr("stroke-linejoin","round"),m.append("line").datum([{date:f,value:1}]).attr("x1",(e=>c(f))).attr("x2",(e=>c(f))).attr("y2",h(1)).attr("y1",h(0)).attr("fill","none").attr("stroke","deeppink").attr("stoke-width",1.5).attr("stroke-linejoin","round"),m.selectAll("circle").data([{date:f,value:1}]).join("circle").attr("cx",(e=>c(e.date))).attr("cy",(e=>h(.98))).attr("r",7).attr("fill",(e=>"deeppink")).attr("stroke",(e=>"deeppink")).call(b),m.node()}{const e=t,i=a.create("svg").attr("viewBox",[0,0,n,e]).style("display","block"),o=a.scaleLinear().domain([0,1]).range([e-r.bottom,r.top+5]),l=(e,t,i)=>e.attr("transform",`translate(0,${i-r.bottom})`).call(a.axisBottom(t).ticks(n/80).tickSizeOuter(0)).style("stroke","#e0f5ee");i.append("g").call(l,c,e).attr("class","axisWhite");const d=a.scaleBand().range([r.left,n-r.right],.01).padding(.01).domain(m);return i.selectAll("rect").data(h).enter().append("rect").attr("x",(e=>d(e.date.toISOString().substring(0,10)))).attr("y",(e=>o(1))).attr("width",(e=>d.bandwidth())).attr("height",(e=>o(0)-o(1))).attr("fill",(e=>-99===e.value?"#ddd":g(e.value))),i.append("line").datum([{date:f,value:1}]).attr("x1",(e=>c(f))).attr("x2",(e=>c(f))).attr("y2",o(1)).attr("y1",o(0)).attr("fill","none").attr("stroke","deeppink").attr("stoke-width",1.5).attr("stroke-linejoin","round"),i.append("line").datum([{date:u,value:1}]).attr("x1",(e=>c(u))).attr("x2",(e=>c(u))).attr("y2",o(1)).attr("y1",o(0)).attr("fill","none").attr("stroke","blue").attr("stoke-width",1.5).attr("stroke-linejoin","round"),i.selectAll("circle").data([{date:f,value:1}]).join("circle").attr("cx",(e=>c(e.date))).attr("cy",(e=>o(.98))).attr("r",7).attr("fill",(e=>"deeppink")).attr("stroke",(e=>"deeppink")).call(b),i.node()}}function w(e,t,a,n,r,i,o){return e.drag().on("start",(function(t,a){e.select(this).raise().attr("stroke","black")})).on("drag",(function(l,d){let s=l.x>t(+a[0]),u=l.x<t(+n);if(s&&u){e.select(this).attr("cx",d.x=l.x);const a=e.bisect(r,+t.invert(l.x));i.value=a,o.update(a)}})).on("end",(function(t,a){e.select(this).attr("stroke",null)}))}function x(e){return e[115]}function k(){return null}function S(e,t,a,n,r,i,o,l,d,s,u,c,f,b,m){if("Heatwaves"===e){const e=t.create("svg").attr("viewBox",[0,0,a,n]).style("display","block"),f=t.scaleTime().domain(r).range([i.left,a-i.right]),b=t.brushX().extent([[i.left,.5],[a-i.right,n-i.bottom+.5]]).on("brush",y).on("end",w),m=[f(t.utcYear.offset(f.domain()[1],-1)),f.range()[1]];let h,g;e.append("g").call(o,f,n).attr("class","axisWhite");const v=l(d);e.append("g").selectAll("g").data(v).join("g").style("fill",((e,t)=>(console.log(e.key),s.get(e.key)))).selectAll("rect").data((e=>e)).join("rect").attr("x",(e=>u(new Date(e.data.date).toISOString().substring(0,10)))).attr("y",(e=>c(e[1]))).attr("height",(e=>c(e[0])-c(e[1]))).attr("width",u.bandwidth());const p=e.append("g").call(b);function y({selection:n}){if(n){var r=n||f.range();if(e.property("value",n.map(f.invert,f).map(t.utcMonth.ceil)),e.dispatch("input"),(r[1]-r[0])/a*120>30)return void p.call(b.move,[h,g]);h=r[0],g=r[1]}}function w({selection:e}){e||p.call(b.move,[m])}return p.call(b.move,m),e.node()}{const e=t.create("svg").attr("viewBox",[0,0,a,n]).style("display","block"),l=t.scaleTime().domain(r).range([i.left,a-i.right]),d=t.brushX().extent([[i.left,.5],[a-i.right,n-i.bottom+.5]]).on("brush",p).on("end",y),s=[l(t.utcYear.offset(l.domain()[1],-1)),l.range()[1]];let h,g;e.append("g").call(o,l,n).attr("class","axisWhite"),e.selectAll("rect").data(f).enter().append("rect").attr("x",(e=>u(e.date.toISOString().substring(0,10)))).attr("y",(e=>c(1))).attr("width",(e=>u.bandwidth())).attr("height",(e=>c(0)-c(1))).attr("fill",(e=>-99===e.value?"#ddd":b(e.value)));const v=e.append("g").call(d);function p({selection:n}){if(n){var r=n||l.range();if(e.property("value",n.map(l.invert,l).map(t.utcMonth.ceil)),e.dispatch("input"),(r[1]-r[0])/a*120>30||(r[1]-r[0])/a*120<2)return void v.call(d.move,[h,g]);h=r[0],g=r[1]}}function y({selection:e}){e||(m.value=s,v.call(d.move,[h,g]))}return v.call(d.move,s),e.node()}}function D(e,t){return e` ${"Anomaly"===t?"Sea surface temperature anomaly":" "}`}function M(e,t){return"Anomaly"===e?t.legend({marginLeft:10,marginRight:10,style:{backgroundColor:"#000000",color:"#e0f5ee",fontSize:"16px",fontWeight:"normal"},color:{type:"diverging",domain:[-4,4],pivot:0,reverse:!0,legend:!0,label:""}}):t.legend({color:{type:"categorical",domain:["No heatwave","Moderate","Strong","Severe","Extreme"],range:["lightblue","#FEDB67","#f26722","#cd3728","#7E1416"]},style:{backgroundColor:"#000000",color:"#e0f5ee",fontSize:"16px",fontWeight:"normal"}})}function C(e,t){return e.table(t)}function E(e){return e}function H(e,t){return new Date(e[0].date)<new Date(t[1])}function _(e,t,a,n){const r=e.timeDay.range(new Date(t[0]),t[1]).map((e=>e.toISOString().substring(0,10))),i=[];return r.forEach(((e,t)=>{let r=a.find((t=>+t.date==+new Date(e)));void 0===r?i.push({station:n,sst:NaN,ssta:NaN,date:e}):i.push(r)})),i}function O(e){return e}function T(e){return console.log(new Date(e[0]))}function W(e){return console.log(e[0].date)}function A(e,t){return+e[0].date==+new Date(t[0])}function I(e){return e.length}function B(e){return e}function F(e,t){return e.find((e=>+e.date==+new Date(t[0])))}function j(e){return void 0===e}function N(e,t,a,n,r,i,o,l,d,s,u,c,f,b,m){const h=0===e.length||void 0===t?"":"Temperature anomaly (°C)",g=a.plot({x:{domain:[n[0],n[1]]},y:{label:"↑ SST (°C)",domain:[0,r]},style:{backgroundColor:"#000000",color:"#e0f5ee",fontSize:10},height:500,marginTop:20,className:"hwclass",marks:[a.dot(e,{x:"date",y:"sst",stroke:"category",fill:"category"}),a.ruleX([i],{stroke:"white",y1:0,y2:o.max(e,(e=>e.sst))}),a.text([{x:l,y:d,text:s}],{x:"x",y:"y",text:"text",fontSize:16})],color:{domain:["none","Moderate","Strong","Severe","Extreme"],range:[u.get("none"),u.get("Moderate"),u.get("Strong"),u.get("Severe"),u.get("Extreme")]},width:500,height:300}),v=a.plot({x:{domain:[n[0],n[1]]},y:{label:"↑ SST (°C)",domain:[0,r]},style:{backgroundColor:"#000000",color:"#e0f5ee",fontSize:10},height:500,marginTop:20,className:"hwclass",marks:[a.dot(e,{x:"date",y:"sst",stroke:"ssta",fill:"ssta"}),a.ruleX([i],{stroke:"white",y1:0,y2:o.max(e,(e=>e.sst))}),a.text([{x:l,y:d,text:s}],{x:"x",y:"y",text:"text",fontSize:16}),a.text([{x:c,y:d,text:h}],{x:"x",y:"y",text:"text",fontSize:10}),a.text([{x:c,y:d-1,text:f}],{x:"x",y:"y",text:"text",fontSize:10})],color:{type:"diverging",domain:[-4,4],pivot:0,reverse:!0},width:500,height:300});return null!==e?"Anomaly"===b?v:g:m``}function z(){return 16}function V(e,t){return e.indexOf(t)}function G(e){return e.timeDay.offset(e.utcDay(),-2)}function L(e,t){return e.timeDay.offset(t,-365)}async function $(e,t){return await e.delay(1e3,""),t}async function P(e,t){return await e.delay(1e3,""),t}function R(e){return e`## bar charts`}function U(){return 60}function X(){return{top:4,right:20,bottom:30,left:10}}function q(e,t,a,n){return e.scaleBand().range([t.left,a-t.right],.01).padding(.1).domain(n)}function Y(e,t,a,n){return e.scaleBand().range([t.left,a-t.right],.01).padding(.01).domain(n)}function J(e,t,a){return(n,r,i)=>n.attr("transform",`translate(0,${i-e.bottom})`).call(t.axisBottom(r).ticks(a/80).tickSizeOuter(0)).style("stroke","#e0f5ee")}function K(e,t,a){return e.scaleLinear().domain([0,1]).range([t-a.bottom,a.top])}function Q(e,t){return e.filter((e=>e.date>=t[0]&&new Date(e.date)<new Date(t[1])))}function Z(e){return e}function ee(e,t){return e.timeMonth.range(new Date(t[0]),t[1]).map((e=>e.toISOString().substring(0,10)))}function te(e,t){return e.timeMonth.range(new Date(t[0]),new Date(t[1])).map((e=>e.toISOString().substring(0,10)))}function ae(e,t,a,n){return e.scaleTime().domain(t).range([a.left,n-a.right])}function ne(e,t,a,n){return e.scaleTime().domain(t).range([a.left,n-a.right])}function re(e,t){return e.stack().keys(t)}function ie(e,t){return e.filter((e=>e.date>=t[0]&&new Date(e.date)<new Date(t[1])))}function oe(e){return e.scaleDiverging(e.interpolateRdBu).domain([4,0,-4])}function le(e){return(t,a,n,r)=>t.selectAll(".handle--custom").data([{type:"w"},{type:"e"}]).join((t=>t.append("path").attr("class","handle--custom").attr("fill","#afafaf").attr("fill-opacity",.8).attr("stroke","#000").attr("stroke-width",1).attr("cursor","ew-resize").attr("d",e))).attr("display",null===a?"none":null).attr("transform",null===a?null:(e,t)=>`translate(${a[t]},${(r+n.top-n.bottom)/2})`)}function de(e){return e.arc().innerRadius(0).outerRadius(10).startAngle(0).endAngle(((e,t)=>t?Math.PI:-Math.PI))}function se(e){const t=[];return Object.keys(e).forEach((a=>{t.push({date:new Date(a.slice(0,4)+"-"+a.slice(-2)),value:e[a][0]})})),t}function ue(e){return e.text().classList[0]}function ce(e,t){return e.filter((e=>e>=t[0]&&e<=t[1]))}function fe(e,t){return e.timeDay.range(new Date(t[0]),new Date(t[1])).map((e=>+e))}function be(e){return[...e]}function me(){return[new Date("2013-01-01"),new Date]}function he(e,t){return e.find((e=>e.long_name===t)).pk}function ge(e){return e}function ve(e,t){return e.select([null].concat(t.map((e=>e.long_name))),{label:"site",value:"North Hecate Strait"})}function pe(e){return e}function ye(e){return new Date(e).toISOString().substring(0,10)}function we(e,t){return e.find((e=>new Date(e.date).toISOString().substring(0,10)===new Date(t).toISOString().substring(0,10)))}function xe(e,t){let a;return a=0!==e.length&&void 0!==t?t.ssta.toFixed(2):"",a}function ke(e,t){return void 0===e[Math.floor(e.length/1.2)]?18:1.1*t.max(e,(e=>e.sst))}function Se(e,t){return void 0===e[Math.floor(e.length/1.2)]?18:1.1*t.max(e,(e=>e.sst))}function De(e,t,a){return void 0===e[Math.floor(e.length/1.2)]?t.timeDay.offset(a[0],30):e[Math.floor(.2*e.length)].date}function Me(e,t,a){return void 0===e[Math.floor(e.length/2)]?t.timeDay.offset(a[0],30):e[Math.floor(.8*e.length)].date}function Ce(e,t){return e.find((e=>e.pk===t)).long_name}function Ee(e){return e[e.length-1]}function He(e,t){return e.filter((e=>e.station===t))}function _e(){return new Map([["avg","#5b6187"],["thresh","#FEDB67"],["below","#89119c"],["above","pink"],["none","lightblue"],["Moderate","#FEDB67"],["Strong","#f26722"],["Severe","#cd3728"],["Extreme","#7E1416"],["noData","#ddd"],["seas","pink"]])}function Oe(){return[{short_name:"C46004",lat:50.94,lon:-135.87,long_name:"Middle Nomad",pk:1},{short_name:"C46036",lat:48.3,lon:-133.86,long_name:"South Nomad",pk:2},{short_name:"C46131",lat:49.91,lon:-124.99,long_name:"Sentry Shoal",pk:3},{short_name:"C46132",lat:49.74,lon:-127.93,long_name:"South Brooks",pk:4},{short_name:"C46145",lat:54.38,lon:-132.42,long_name:"Central Dixon Entran",pk:6},{short_name:"C46146",lat:49.34,lon:-123.73,long_name:"Halibut Bank",pk:7},{short_name:"C46147",lat:51.83,lon:-131.23,long_name:"South Moresby",pk:8},{short_name:"C46183",lat:53.57,lon:-131.14,long_name:"North Hecate Strait",pk:11},{short_name:"C46184",lat:53.92,lon:-138.85,long_name:"North Nomad",pk:12},{short_name:"C46185",lat:52.42,lon:-129.79,long_name:"South Hecate Strait",pk:13},{short_name:"C46204",lat:51.38,lon:-128.77,long_name:"West Sea Otter",pk:14},{short_name:"C46205",lat:54.3,lon:-133.4,long_name:"West Dixon Entrance",pk:15},{short_name:"C46206",lat:48.83,lon:-126,long_name:"La Perouse Bank",pk:16},{short_name:"C46207",lat:50.88,lon:-129.91,long_name:"East Dellwood",pk:17},{short_name:"C46208",lat:52.51,lon:-132.69,long_name:"West Moresby",pk:18}]}function Te(e,t){return e.filter((e=>new Date(t).toISOString().substring(0,10)===new Date(e.result_time).toISOString().substring(0,10)))}function We(e){const t=Object.assign(e[0]),a=new Date(t);return new Date(a.setDate(a.getDate()-1)).toISOString().substring(0,10)}function Ae(e,t){return fetch("https://t6r95rekqe.execute-api.us-east-1.amazonaws.com/dev/getDailySSTStats?startDate="+e+"&endDate="+t[1].toISOString().substring(0,10)).then((e=>e.json())).then((e=>(e.forEach((e=>{e.ssta=e.sst-e.seas,e.diff=e.thresh,e.diffStrong=e.thresh,e.diffExtreme=e.thresh,e.diffSevere=e.thresh,"Strong"===e.category&&(e.diffStrong=Math.max(e.thresh,e.sst)),"Extreme"===e.category&&(e.diffExtreme=Math.max(e.thresh,e.sst)),"Severe"===e.category&&(e.diffSevere=Math.max(e.thresh,e.sst)),"Moderate"===e.category&&(e.diff=Math.max(e.thresh,e.sst)),null===e.category&&(e.category="none"),e.date=new Date(e.result_time)})),e)))}function Ie(){return 500}function Be(e){return e.scaleOrdinal().domain(["none","Moderate","Strong","Severe","Extreme"]).range(["#31a354","#FEDB67","#f26722","#7E1416","#cd3728"])}function Fe(e){return e.scaleOrdinal().domain(["none","Moderate","Strong","Severe","Extreme"])}function je(e){return e.format(",d")}function Ne(e){return e.timeFormat("%Y-%m-%d")}function ze(e){return e("d3@6")}function Ve(e){return new Date(e).toISOString().substring(0,10)}function Ge(){return[{date:"2013-10-01",value:1},{date:"2013-11-01",value:1},{date:"2013-12-01",value:1},{date:"2014-01-01",value:1},{date:"2014-02-01",value:1},{date:"2014-03-01",value:1},{date:"2014-04-01",value:1},{date:"2014-05-01",value:1},{date:"2014-06-01",value:1},{date:"2014-07-01",value:1},{date:"2014-08-01",value:1},{date:"2014-09-01",value:1},{date:"2014-10-01",value:1},{date:"2014-11-01",value:1},{date:"2014-12-01",value:1},{date:"2015-01-01",value:1},{date:"2015-02-01",value:1},{date:"2015-03-01",value:1},{date:"2015-04-01",value:1},{date:"2015-05-01",value:1},{date:"2015-06-01",value:1},{date:"2015-07-01",value:1},{date:"2015-08-01",value:1},{date:"2015-09-01",value:1},{date:"2015-10-01",value:1},{date:"2015-11-01",value:1},{date:"2015-12-01",value:1},{date:"2016-01-01",value:1},{date:"2016-02-01",value:1},{date:"2016-03-01",value:1},{date:"2016-04-01",value:1},{date:"2016-05-01",value:1},{date:"2016-06-01",value:1},{date:"2016-07-01",value:1},{date:"2016-08-01",value:1},{date:"2016-09-01",value:1},{date:"2016-10-01",value:1},{date:"2016-11-01",value:1},{date:"2019-08-01",value:1},{date:"2019-09-01",value:1},{date:"2019-10-01",value:1},{date:"2019-11-01",value:1}]}function Le(e,t){return e.timeMonth.range(new Date(t[0]),new Date(t[1])).map((e=>e.toISOString().substring(0,10)))}function $e(e){return[...new Set(e.map((e=>e.date.slice(0,7))))]}function Pe(e){return e.filter((e=>"2013-01"===e.date))}function Re(e,t,a,n){const r=[];return e.forEach((e=>{let i=0;for(let o=0;o<t.length;o++){let l=a.sum(n.filter((t=>+new Date(t.month)==+new Date(e))),(e=>e[t[o]]));r.push({date:e,[t[o]]:l}),i+=l}})),r}function Ue(e,t){const a=[];return e.forEach((e=>{let n=0;e[1].forEach((e=>{n+=Object.values(e)[1]})),a.push({date:new Date(e[0]),[t[0]]:e[1][0][t[0]]/n,[t[1]]:e[1][1][t[1]]/n,[t[2]]:e[1][2][t[2]]/n,[t[3]]:e[1][3][t[3]]/n,[t[4]]:e[1][4][t[4]]/n,noData:0,sum:n})})),a.map((e=>(new Date(e.date).toISOString().substring(0,7)===(new Date).toISOString().substring(0,7)&&(e.none=0,e.Moderate=0,e.Strong=0,e.Extreme=0,e.Severe=0,e.noData=1),e)))}function Xe(e){return e[115]}function qe(e){return e[115].date}function Ye(){return(new Date).toISOString().substring(0,7)}function Je(){return["none","Moderate","Strong","Extreme","Severe","noData"]}function Ke(e,t){return e.groups(t,(e=>+new Date(e.date)))}function Qe(e){const t=e,a=[];return Object.keys(t).forEach((e=>{for(let n=0;n<1;n++)t[e].reduce(((e,t)=>e+t),0),a.push({date:e.replace(/(\d{4})(\d{2})(\d{2})/g,"$1-$2-$3"),month:e.replace(/(\d{4})(\d{2})(\d{2})/g,"$1-$2-$3").slice(0,7),none:t[e][0],Moderate:t[e][1],Strong:t[e][2],Extreme:t[e][3],Severe:t[e][4]})})),a}function Ze(){return fetch("https://raw.githubusercontent.com/HakaiInstitute/ssta_images/gh-pages/src/monthlyMHW.json",{Method:"GET"}).then((e=>e.json()))}function et(e){return e[202203]}function tt(e){return e[202207]}function at(){return fetch("https://raw.githubusercontent.com/HakaiInstitute/ssta_images/gh-pages/src/monthly.json",{Method:"GET"}).then((e=>e.json()))}function nt(e){return e("monthly@7.json").json()}function rt(e,t){const rt=e.module(),it=new Map([["monthly@7.json",{url:new URL(a(383),a.b),mimeType:"application/json",toString:function(){return this.url}}]]);rt.builtin("FileAttachment",e.fileAttachments((e=>it.get(e)))),rt.variable(t()).define(["md"],r),rt.variable(t("curDate")).define("curDate",["md","timeFormat","time1"],i),rt.variable(t()).define(["md"],o),rt.variable(t()).define(["d3"],l),rt.variable(t("endPlayDate")).define("endPlayDate",["d3"],d),rt.variable(t("style")).define("style",["html","width","ns"],s),rt.variable(t()).define(["brushedData"],u),rt.variable(t()).define(["md"],c),rt.variable(t("viewof time1")).define("viewof time1",["Scrubber","datesToPlot","newNum"],f),rt.variable(t("time1")).define("time1",["Generators","viewof time1"],((e,t)=>e.input(t))),rt.variable(t()).define(["md"],b),rt.variable(t("viewof colorView")).define("viewof colorView",["Inputs","html"],m),rt.variable(t("colorView")).define("colorView",["Generators","viewof colorView"],((e,t)=>e.input(t))),rt.define("initial newNum",h),rt.variable(t("mutable newNum")).define("mutable newNum",["Mutable","initial newNum"],((e,t)=>new e(t))),rt.variable(t("newNum")).define("newNum",["mutable newNum"],(e=>e.generator)),rt.variable(t()).define(["brushedData"],g),rt.variable(t("addGreybar")).define("addGreybar",["data","brusedAllDates"],v),rt.variable(t()).define(["brusedAllDates"],p),rt.variable(t("chart")).define("chart",["colorView","focusHeight","d3","width","margin","xMHW","stack","brushedDataMHW","colors","x1MHW","endPlayDate","x","time1","drag","brusedAllDates","brushedData","sstaColors"],y),rt.variable(t("drag")).define("drag",["d3","x","focus","endPlayDate","datesToPlot","mutable newNum","viewof time1"],w),rt.variable(t()).define(["monthlyGrouped"],x),rt.define("initial debug1",k),rt.variable(t("mutable debug1")).define("mutable debug1",["Mutable","initial debug1"],((e,t)=>new e(t))),rt.variable(t("debug1")).define("debug1",["mutable debug1"],(e=>e.generator)),rt.variable(t("viewof focus")).define("viewof focus",["colorView","d3","width","focusHeight","dateExtent","margin","xAxis","stack","monthlyGrouped","colors","x1","y","data","sstaColors","mutable debug1"],S),rt.variable(t("focus")).define("focus",["Generators","viewof focus"],((e,t)=>e.input(t))),rt.variable(t("legTitle")).define("legTitle",["md","colorView"],D),rt.variable(t("leg")).define("leg",["colorView","Plot"],M),rt.variable(t()).define(["Inputs","alldays"],C),rt.variable(t()).define(["clickedSite"],E),rt.variable(t()).define(["clickedSite","limitsDelayed"],H),rt.variable(t("alldays")).define("alldays",["d3","focus","clickedSite","siteClicked"],_),rt.variable(t()).define(["alldays"],O),rt.variable(t()).define(["alldays"],T),rt.variable(t()).define(["clickedSite"],W),rt.variable(t()).define(["clickedSite","alldays"],A),rt.variable(t()).define(["alldays"],I),rt.variable(t()).define(["alldays"],B),rt.variable(t()).define(["clickedSite","alldays"],F),rt.variable(t()).define(["tempToShow"],j),rt.variable(t("viewof lineChart")).define("viewof lineChart",["alldays","tempToShow","Plot","limitsDelayed","yMaxDomainToUse","time1","d3","dateForLabel","yValueForLabel","buoyClicked","colors","dateForLabelVal","currentValue","colorView","md"],N),rt.variable(t("lineChart")).define("lineChart",["Generators","viewof lineChart"],((e,t)=>e.input(t))),rt.define("initial siteClicked",z),rt.variable(t("mutable siteClicked")).define("mutable siteClicked",["Mutable","initial siteClicked"],((e,t)=>new e(t))),rt.variable(t("siteClicked")).define("siteClicked",["mutable siteClicked"],(e=>e.generator)),rt.variable(t("ind")).define("ind",["dates","time1"],V),rt.variable(t("today")).define("today",["d3"],G),rt.variable(t("start")).define("start",["d3","today"],L),rt.variable(t("limitsDelayed")).define("limitsDelayed",["Promises","focus"],$),rt.variable(t("limitsDelayedMHW")).define("limitsDelayedMHW",["Promises","focus"],P),rt.variable(t()).define(["md"],R),rt.variable(t("focusHeight")).define("focusHeight",U),rt.variable(t("margin")).define("margin",X),rt.variable(t("x1")).define("x1",["d3","margin","width","alldates"],q),rt.variable(t("x1MHW")).define("x1MHW",["d3","margin","width","brusedAllDatesMHW"],Y),rt.variable(t("xAxis")).define("xAxis",["margin","d3","width"],J),rt.variable(t("y")).define("y",["d3","focusHeight","margin"],K),rt.variable(t("brushedDataMHW")).define("brushedDataMHW",["monthlyGrouped","focus"],Q),rt.variable(t()).define(["monthlyGrouped"],Z),rt.variable(t("brusedAllDates")).define("brusedAllDates",["d3","focus"],ee),rt.variable(t("brusedAllDatesMHW")).define("brusedAllDatesMHW",["d3","focus"],te),rt.variable(t("x")).define("x",["d3","focus","margin","width"],ae),rt.variable(t("xMHW")).define("xMHW",["d3","focus","margin","width"],ne),rt.variable(t("stack")).define("stack",["d3","cats"],re),rt.variable(t("brushedData")).define("brushedData",["data","focus"],ie),rt.variable(t("sstaColors")).define("sstaColors",["d3"],oe),rt.variable(t("brushHandle")).define("brushHandle",["arc"],le),rt.variable(t("arc")).define("arc",["d3"],de),rt.variable(t("data")).define("data",["dataSsta"],se),rt.variable(t("ns")).define("ns",["Inputs"],ue),rt.variable(t("datesToPlot")).define("datesToPlot",["datesCopy","limitsDelayed"],ce),rt.variable(t("dates")).define("dates",["d3","dateExtent"],fe),rt.variable(t("datesCopy")).define("datesCopy",["dates"],be),rt.variable(t("dateExtent")).define("dateExtent",me),rt.variable(t()).define(["buoys","siteClickeds"],he),rt.variable(t()).define(["siteClickeds"],ge),rt.variable(t("viewof siteClickeds")).define("viewof siteClickeds",["Inputs","buoys"],ve),rt.variable(t("siteClickeds")).define("siteClickeds",["Generators","viewof siteClickeds"],((e,t)=>e.input(t))),rt.variable(t()).define(["clickedSite"],pe),rt.variable(t()).define(["time1"],ye),rt.variable(t("tempToShow")).define("tempToShow",["clickedSite","time1"],we),rt.variable(t("currentValue")).define("currentValue",["clickedSite","tempToShow"],xe),rt.variable(t("yMaxDomainToUse")).define("yMaxDomainToUse",["clickedSite","d3"],ke),rt.variable(t("yValueForLabel")).define("yValueForLabel",["clickedSite","d3"],Se),rt.variable(t("dateForLabel")).define("dateForLabel",["clickedSite","d3","limitsDelayed"],De),rt.variable(t("dateForLabelVal")).define("dateForLabelVal",["clickedSite","d3","limitsDelayed"],Me),rt.variable(t("buoyClicked")).define("buoyClicked",["buoys","siteClicked"],Ce),rt.variable(t()).define(["buoyDailyData"],Ee),rt.variable(t("clickedSite")).define("clickedSite",["buoyDailyData","siteClicked"],He),rt.variable(t("colors")).define("colors",_e),rt.variable(t("buoys")).define("buoys",Oe),rt.variable(t("HWsForDate")).define("HWsForDate",["buoyDailyData","time1"],Te),rt.variable(t("dayBeforeStart")).define("dayBeforeStart",["focus"],We),rt.variable(t("buoyDailyData")).define("buoyDailyData",["dayBeforeStart","limitsDelayed"],Ae),rt.variable(t("height")).define("height",Ie),rt.variable(t("colorMHW")).define("colorMHW",["d3"],Be),rt.variable(t("opacityMHW")).define("opacityMHW",["d3"],Fe),rt.variable(t("numFormat")).define("numFormat",["d3"],je),rt.variable(t("timeFormat")).define("timeFormat",["d3"],Ne),rt.variable(t("d3")).define("d3",["require"],ze),rt.define("initial p",["time1"],Ve),rt.variable(t("mutable p")).define("mutable p",["Mutable","initial p"],((e,t)=>new e(t))),rt.variable(t("p")).define("p",["mutable p"],(e=>e.generator)),rt.variable(t("hwEvent")).define("hwEvent",Ge),rt.variable(t("alldates")).define("alldates",["d3","dateExtent"],Le),rt.variable(t("allmonths")).define("allmonths",["mhwBarData"],$e),rt.variable(t()).define(["monthlyTots"],Pe),rt.variable(t("monthlyTots")).define("monthlyTots",["allmonths","cats","d3","mhwBarData"],Re),rt.variable(t("monthlyGrouped")).define("monthlyGrouped",["groups","cats"],Ue),rt.variable(t()).define(["monthlyGrouped"],Xe),rt.variable(t()).define(["monthlyGrouped"],qe),rt.variable(t()).define(Ye),rt.variable(t("cats")).define("cats",Je),rt.variable(t("groups")).define("groups",["d3","monthlyTots"],Ke),rt.variable(t("mhwBarData")).define("mhwBarData",["tt"],Qe),rt.variable(t("tt")).define("tt",Ze),rt.variable(t()).define(["dataSsta"],et),rt.variable(t()).define(["dataSsta"],tt),rt.variable(t("dataSsta")).define("dataSsta",at),rt.variable(t("dataSstaOld")).define("dataSstaOld",["FileAttachment"],nt);const ot=e.module(n.default);return rt.import("Scrubber",ot),rt}}}]);
//# sourceMappingURL=bundle.c36b6191393a9c3eead3.js.map