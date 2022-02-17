import './style.css'
import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'

import * as d3 from 'd3'
import {
    Runtime,
    Library,
    Inspector
} from "./buoyviz/runtime.js";
import buoyViz from "./buoyviz/index.js";
// import { damp } from 'three/src/math/MathUtils';
import * as Plot from "@observablehq/plot";
// console.log(Plot);
// Spinner setup 
import {
    Spinner
} from 'spin.js';
var opts = {
    lines: 13, // The number of lines to draw
    length: 45, // The length of each line
    width: 17, // The line thickness
    radius: 45, // The radius of the inner circle
    scale: 1, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    speed: 1.9, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#d33eed', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 1px transparent', // Box-shadow for the lines
    zIndex: 2000000000, // The z-index (defaults to 2e9)
    className: 'spinner', // The CSS class to assign to the spinner
    position: 'absolute', // Element positioning
};

var target = document.getElementById('charts');


// const runtime = new Runtime() 
//Raycaster
const raycaster = new THREE.Raycaster()



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Textures
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
// const loaderBM = new THREE.ImageBitmapLoader();

const earthTexture = textureLoader.load('./textures/BC_terrain.png')
earthTexture.anisotropy = 16;

// Scene
const scene = new THREE.Scene()
// scene.background = new THREE.Color("white");
// scene.add(light);
// Object
const geometry = new THREE.SphereGeometry(1, 64, 32)
const material = new THREE.MeshBasicMaterial({
    transparent: true,
    map: earthTexture
});
const sphereBG = new THREE.Mesh(geometry, material)

// scene.add(sphere)
//noaa-crw_mhw_v1.0.1_category_20150101
let endDate = d3.utcDay()
let startDate = d3.timeDay.offset(endDate, -10)
const firstDayToLoad = "ct5km_ssta_v3.1_" + d3.timeDay.offset(endDate, -12).toISOString().substring(0, 10).replaceAll("-", "") +
    ".png"
// console.log(firstDayToLoad)
const texture = textureLoader.load('./textures/' + 'ct5km_ssta_v3.1_20220101.png')
// console.log(texture)
const materialSSTA = new THREE.MeshBasicMaterial({
    map: texture,
    // color: "white"
});
materialSSTA.needsUpdate = true;

const sphereSSTA = new THREE.Mesh(geometry, materialSSTA);
scene.add(sphereSSTA);


scene.add(sphereBG);

function latLongToVector3(lat, lon, radius, heigth) {
    var phi = (lat * Math.PI) / 180;
    var theta = ((lon - 180) * Math.PI) / 180;
  
    var x = -(radius + heigth) * Math.cos(phi) * Math.cos(theta);
    var y = (radius + heigth) * Math.sin(phi);
    var z = (radius + heigth) * Math.cos(phi) * Math.sin(theta);
    // console.log(x, y, z);
    return new THREE.Vector3(x, y, z);
  }

// the geometry that will contain all our cubes
//   const totalGeom = new THREE.BufferGeometry();

// add colors relative to the density. Not done here.
const particleTexture = textureLoader.load('./textures/1.png')


const buoys =[
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

const count = buoys.length;
console.log(count)
const positions = new Float32Array(count * 3);
// d3.json("./buoys.json").then(function(buoys) {
// console.log(data[0]);
let allBouys = []


const particlesGeometry = new THREE.SphereGeometry(0.006, 16, 16) //new THREE.BufferGeometry();
for (let i = 0; i < count; i++) {
    const particlesMaterial = new THREE.MeshBasicMaterial({
        color: 'yellow'
    }) //new THREE.PointsMaterial();


    let positions = new Float32Array(3);
    // const i3 = i * 3;

    // Convert from lat long to position on earth
    let positionOnGlobe = latLongToVector3(
        buoys[i].lat,
        buoys[i].lon,
        1,
        0.001
    );
    // positions[0] = positionOnGlobe.x;
    // positions[1] = positionOnGlobe.y;
    // positions[2] = positionOnGlobe.z;
    // console.log(positions)
    // particlesGeometry.setAttribute(
    //     "position",
    //     new THREE.BufferAttribute(positions, 3)
    // );

    let particles = new THREE.Mesh(particlesGeometry, particlesMaterial)
    particles.position.x = positionOnGlobe.x
    particles.position.y = positionOnGlobe.y
    particles.position.z = positionOnGlobe.z
    particles.buoyId = buoys[i].pk
    particles.long_name = buoys[i].long_name
    allBouys.push(particles)
    // scene.add(particles)

}
const group = new THREE.Group();
console.log(allBouys)
group.add(allBouys[0], allBouys[1], allBouys[2], allBouys[3], allBouys[4], allBouys[5], allBouys[6], allBouys[7], allBouys[8], allBouys[9], allBouys[10], allBouys[11], allBouys[12])
scene.add(group);

// particlesMaterial.depthWrite = false;
//    particles = new THREE.Points(particlesGeometry, particlesMaterial);
// const particlesMaterial = new THREE.PointsMaterial()
// particlesMaterial.map = particleTexture
// particlesMaterial.size = 0.05
// particlesMaterial.sizeAttenuation = true
// particlesMaterial.color = new THREE.Color('#ff88cc')

// particles = new THREE.Points(particlesGeometry, particlesMaterial)
// scene.add(allBouys)
// scene.add(particles);
group.visible = false;



// });


// scene.position.y = 0.5

// Sizes
const sizes = {
    width: window.innerWidth * 0.9,
    height: window.innerHeight *0.75
}
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    var rect = renderer.domElement.getBoundingClientRect();
    // console.log(rect)
    // mouse.x = event.clientX / sizes.width * 2 - 1
    // mouse.y = -(event.clientY / sizes.height * 2 - 1)
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;


    mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

})

let clickedSite;
const colors = new Map([
    ["avg", "#5b6187"],
    ["thresh", "#FEDB67"],
    ["below", "#89119c"], // actuals below forecast
    ["above", "pink"], // actuals above forecast
    ["moderate", "#FEDB67"],
    ["Strong", "#f26722"],
    ["Severe", "#cd3728"],
    ["Extreme", "#7E1416"],

    ["seas", "pink"]
])




// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 2
// camera.position.set(-1.5, 1.6, 3);
// camera.lookAt(new THREE.Vector3(0, 0, 0));

scene.add(camera)




// window.addEventListener("click", onDocumentMouseMove, false);
var selectedObject = null;



// Controls
const controls = new OrbitControls(camera, canvas)
controls.minDistance = 1.3
controls.maxDistance = 2.3
controls.enableDamping = true
controls.enablePan = false;
controls.minAzimuthAngle = -1 //left rotate
controls.maxAzimuthAngle = -0.85; // right
controls.minPolarAngle = .7;
controls.maxPolarAngle = .9;
//  controls.enableRotate = false;
// scene.add(group);
controls.addEventListener("change", (event) => {
    controls.object.position.z > 1 ?
        (group.visible = false) :
        (group.visible = true);
});


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
// canvas.appendChild( renderer.domElement );

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// renderer.render(scene, camera)

/**
 * Animate
 */
//   const clock = new THREE.Clock()
// let currentIntersect = null
// let INTERSECTED;
// const threshold = 0.05;
// raycaster.params.Points.threshold = threshold;
let currentIntersect = null
const objectsToTest = allBouys //[allBouys[1],allBouys[2],allBouys[3]]
const tick = () => {


    raycaster.setFromCamera(mouse, camera);
    // const objectsTo = allBouys.push(sphereBG)
    // console.log(objectsTo)

   
    //    console.log(objectsToTest)
    const intersects = raycaster.intersectObjects(objectsToTest)
    //    console.log(intersects.length)

    // for (const object of objectsToTest) {
    //     object.material.color.set("#eeff00")
    // }

    // for (const intersect of intersects) {
    //     intersect.object.material.color.set("#0000ff")
    // }

    if (intersects.length) {
        if (currentIntersect === null) {

        }
        currentIntersect = intersects[0]
    } else {
        if (currentIntersect) {

        }
        currentIntersect = null

    }

   
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()




let allText = null
// let dateFiles = null

// start by loading the last 90 days of anomaly data



// const startDate = d3.timeDay.offset(endDate, -90)
let everyDayBetween = d3.timeDay.range(startDate, endDate)

let dateFiles = everyDayBetween.map((d) => "ct5km_ssta_v3.1_" + d.toISOString().substring(0, 10).replaceAll("-", "") +
    ".png")




// runs the animation
let category = 'Anomaly'
async function printy(text) {

    sphereSSTA.material.map = text
    // sphereSSTA.material.color = "white"
    sphereSSTA.material.needsUpdate = true;


}
let firstLoad = 0,
    prefix = null,
    spinner = null,
    bouyData

function animateImages(){
    everyDayBetween = d3.timeDay.range(startDate, endDate)

    prefix = category === 'Anomaly' ? "ct5km_ssta_v3.1_" : "noaa-crw_mhw_v1.0.1_category_"
    dateFiles = everyDayBetween.map((d) => prefix + d.toISOString().substring(0, 10).replaceAll("-", "") +
        ".png")

    console.log("dateFiles.length", dateFiles.length)

        // try one ww to load them all 
        var spinner = new Spinner(opts).spin(target);
        const loader = new THREE.ImageBitmapLoader().setOptions({
            imageOrientation: 'flipY',
            premultiplyAlpha: 'none'
        });

        function loadImage(file) {

            return new Promise(function(resolve, reject) {
                return loader.load(file, function(imageBitmap) {
                
                    resolve(new THREE.CanvasTexture(imageBitmap))
                    
                }, undefined, function(e) {
                    console.error(e);
                    spinner.stop();
                })
            })
        }
        
        let promises = [];


        for (let i = 0; i < dateFiles.length; i++) {
            // console.log('./textures/' + dateFiles[i]);
            let img = loadImage('./textures/' + dateFiles[i])
            // console.log(img)
            promises.push(img)
        }
        // console.log(promises);
        Promise.all(promises)
            .then(function(textures) {
                // console.log(textures)
                spinner.stop();
                allText = textures
                printy(allText[0])
            })
}

const library = new Library();
// let whatTimeIsit;
// Instantiate the notebook.
const runtime = self.runtime = new Runtime(library);
const main = runtime.module(buoyViz, name => {
    // console.log(buoyViz)
    if (name === "eventText") return new Inspector(document.querySelector("#observablehq-eventText-bf0be2b8"));

    if (name === "globe") return new Inspector(document.querySelector("#observablehq-globe-273ac292"));
    if (name === "viewof time1") return new Inspector(document.querySelector("#observablehq-viewof-time1-273ac292"));
    if (name === "curDate") return new Inspector(document.querySelector("#observablehq-curDate-890dd666"));
    if (name === "leg") return new Inspector(document.querySelector("#observablehq-leg-2162ef11"));
    if (name === "viewof colorView") return new Inspector(document.querySelector("#observablehq-viewof-colorView-5fc774d0"));
    if (name === "viewof limits") return new Inspector(document.querySelector("#observablehq-viewof-limits-5fc774d0"));
    if (name === "minFunc") return true;
    if (name === "viewof datesToPlot") return new Inspector(document.querySelector("#observablehq-viewof-datesToPlot-c8a213a1"));
    if (name === "lineChart") return new Inspector(document.querySelector("#observablehq-lineChart-097224fc"));

    // if first load don't load again below


    // returns just the category selected
    // NEEDS to also trigger loading of all the images in limits.
    if (name === "colorView") {
        // const node = document.querySelector("#observablehq-viewof-time1-273ac292");
        return {
            pending() {},
            fulfilled(value) {
                category = value
                console.log(value, firstLoad)
                animateImages()

            },
            rejected(error) {
                node.textContent = error.message;
            }
        }
    }

    // returns just the brush dates but also loads the images for the interval selected
    if (name === "limits") {
        // const node = document.querySelector("#observablehq-viewof-time1-273ac292");
        return {
            pending() {},
            fulfilled(value) {


                console.log('this is running!', category)
                endDate = value[1]
                startDate = value[0]



            },
            rejected(error) {
                node.textContent = error.message;
            }
        }
    }




    if (name === "datesToPlot") {

        return {
            pending() {},
            fulfilled(value) {
          
                if (value !== null) {

                    animateImages()

                }
            },
            rejected(error) {
                node.textContent = error.message;
            }
        }
    }


    // returns the current play date and then loads the texture for that date (which loaded when limits changed)
    if (name === "time1") {
        return {
            pending() {},
            fulfilled(value) {
                // console.log(value,firstLoad,allText) 
                if (firstLoad !== 0) {
                    // whatTimeIsit = value

                    const fileName = category === 'Anomaly' ? "ct5km_ssta_v3.1_" : "noaa-crw_mhw_v1.0.1_category_"

                    const fileToUse = fileName + new Date(value).toISOString().substring(0, 10).replaceAll("-", "") + ".png"
                    // console.log(fileToUse)
                    const ind = dateFiles.indexOf(fileToUse)
                    // console.log(ind,allText)
                    const textureToUse = allText[ind]
                    // console.log(allText)
                    printy(textureToUse)
                } else {
                    console.log('here')
                    firstLoad = 1
                }
                // return new Inspector(document.querySelector("#observablehq-viewof-time1-273ac292"))
            },
            rejected(error) {
                node.textContent = error.message;
            }
        }
    }
    if (name === "buoyDailyData") {
        return {
            pending() {},
            fulfilled(value) {
                // console.log(value);
                bouyData = value
            },
            rejected(error) {
                node.textContent = error.message;
            }
        }
    }



    if (name === "ind") return true;

    // if (name === "viewof map") return new Inspector(document.querySelector("#observablehq-viewof-map-273ac292"));
    return ["update", "HWsForDate", "hex", "hexbyLocation", "selected", "hexgeo", "updateMapbox"].includes(name);
});
// d3.select("#observablehq-lineChart-097224fc").style("visibility","hidden")
window.addEventListener('click', (event) => {
    console.log(currentIntersect);
    if(currentIntersect === null){
        // currentIntersect.object.material.color.set("yellow")
        // d3.select("#observablehq-lineChart-097224fc").style("visibility","hidden")
    } else {
          for (const object of objectsToTest) {
        object.material.color.set("#eeff00")
    }
        currentIntersect.object.material.color.set("#04ff00")
        currentIntersect.object.material.needsUpdate = true;
        console.log(currentIntersect.object.material.color);
        // d3.select("#observablehq-lineChart-097224fc").style("visibility","visible")
        clickedSite = bouyData.filter(d => d.station === currentIntersect.object.buoyId)
        console.log(clickedSite)
        main.redefine("clickedSite", clickedSite);
    }
    
    
})
// let plotElement = document.querySelector("#observablehq-Plot")

// window.addEventListener('click', (event) => {
//     clickedSite = bouyData.filter(d => d.station === currentIntersect.object.buoyId)
// })
//     console.log(currentIntersect.object.long_name)
//     // mouse.x = event.clientX / sizes.width * 2 - 1
//     // mouse.y = -(event.clientY / sizes.height * 2 - 1)
  
//     if (currentIntersect) {
//         while (plotElement.firstChild) {
//             plotElement.removeChild(plotElement.firstChild)
//         }
//         console.log('here')
//         clickedSite = bouyData.filter(d => d.station === currentIntersect.object.buoyId)
//         plotElement.appendChild(Plot.plot({
//             style: {