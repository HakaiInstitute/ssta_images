import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as d3 from 'd3'
import {Runtime, Library, Inspector} from "./buoyviz/runtime.js";
import buoyViz from "./buoyviz/index.js";


// const runtime = new Runtime() 
 

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
// scene.add(light);
// Object
const geometry = new THREE.SphereGeometry(1, 64, 32)
const material = new THREE.MeshBasicMaterial({
  transparent: true,
  map: earthTexture
});
const sphereBG = new THREE.Mesh(geometry, material)

// scene.add(sphere)
const texture = textureLoader.load('./textures/ct5km_ssta_v3.1_20150101.png')
// console.log(texture)
const materialSSTA = new THREE.MeshBasicMaterial({
  map: texture,
  // color: "white"
});
materialSSTA.needsUpdate = true;

const sphereSSTA = new THREE.Mesh(geometry, materialSSTA);
scene.add(sphereSSTA);


scene.add(sphereBG);



  // scene.position.y = 0.5

  // Sizes
  const sizes = {
    width: 600,
    height: 600
  }
  window.addEventListener('resize', () => {
    // Update sizes
    // sizes.width = window.innerWidth
    // sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
  // Camera
  const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height)
  // camera.position.z = 
  camera.position.set(-1.5, 1.6, 1.2);
  // camera.lookAt(new THREE.Vector3(0, 0, 0));

  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.minDistance = 1.5
  controls.maxDistance = 8
  controls.enableDamping = true

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })

  renderer.setSize(sizes.width, sizes.height)
  renderer.render(scene, camera)

  /**
 * Animate
 */
  //   const clock = new THREE.Clock()

  const tick = () => {
    // const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  tick()


  function delay(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
}


function createWorker(data) {

    return new Promise(function(resolve, reject) {
      // console.log(import.meta.url)
        var v = new Worker(new URL('./for.js', import.meta.url));
        
        v.postMessage(data);
  
        v.onmessage = function(event){
          v.terminate();
            // console.log(new THREE.CanvasTexture( event.data ))
            resolve(new THREE.CanvasTexture( event.data ));
        };
 
        v.onerror = reject; // Rejects the promise if an error is raised by the web worker, passing along the ErrorEvent
      
    })
 
}

let allText = null
let dateFiles = null
d3.csv('./names.csv').then(function (allFiles) {
  console.log(allFiles.length)
    // return just the file names that are dates
    dateFiles = allFiles.filter((d) => {
      if (!isNaN(Number(d.files.slice(-5, -4)))) {
        return d.files;
      }
    }).map((d) => d.files).sort((a, b) => {
      return b - a;
    })
  
  
    let promises = [];
    for(let i = 0; i < 100; i++) {
        promises.push(createWorker('./textures/'+ dateFiles[i]));
    }
    
    Promise.all(promises)
        .then(function(textures) {
          allText = textures
        })
  })

    // runs the animation
    async function printy(text) {
    
      sphereSSTA.material.map = text
      // sphereSSTA.material.color = "white"
      sphereSSTA.material.needsUpdate = true;

    
    }
new Runtime().module(buoyViz, name => {
  // console.log(buoyViz)
  if (name === "globe") return new Inspector(document.querySelector("#observablehq-globe-273ac292"));
  if (name === "viewof time1") return new Inspector(document.querySelector("#observablehq-viewof-time1-273ac292"));
  if (name === "curDate") return new Inspector(document.querySelector("#observablehq-curDate-890dd666"));
  if (name === "leg") return new Inspector(document.querySelector("#observablehq-leg-2162ef11"));
  if (name === "viewof colorView") return new Inspector(document.querySelector("#observablehq-viewof-colorView-5fc774d0"));
  if (name === "viewof limits") return new Inspector(document.querySelector("#observablehq-viewof-limits-5fc774d0"));
  if (name === "minFunc") return true;

  // returns just the scrubber value
  if (name === "time1"){
    // const node = document.querySelector("#observablehq-viewof-time1-273ac292");
    return {
      pending() {
      },
      fulfilled(value) {
        // console.log(value,allText)

        const fileToUse = "ct5km_ssta_v3.1_" + new Date(value).toISOString().substring(0, 10).replaceAll("-", "") + ".png"
        const ind = dateFiles.indexOf(fileToUse)
        const textureToUse = allText[ind]
        // console.log(textureToUse)
        printy(textureToUse)
        // return new Inspector(document.querySelector("#observablehq-viewof-time1-273ac292"))
      },
      rejected(error) {
        node.textContent = error.message;
      }
  }}
  if (name === "ind") return true;
  if (name === "lineChart") return new Inspector(document.querySelector("#observablehq-lineChart-c174eddc"));

  if (name === "viewof map") return new Inspector(document.querySelector("#observablehq-viewof-map-273ac292"));
  return ["update","HWsForDate","hex","hexbyLocation","selected","hexgeo","updateMapbox"].includes(name);
});

