import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as d3 from 'd3'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Textures
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const loaderBM = new THREE.ImageBitmapLoader();

const earthTexture = textureLoader.load('./textures/2k_earth_daymap.jpg')
// console.log(earthTexture)
// earthTexture.needsUpdate = true

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.SphereGeometry(1, 64, 32)
const material = new THREE.MeshBasicMaterial({ map: earthTexture })
const sphere = new THREE.Mesh(geometry, material)

scene.add(sphere)
let sphere2 = null
function addImageBitmap() {

  new THREE.ImageBitmapLoader()
    .setOptions( { imageOrientation: 'flipY'  } )
    .load('./textures/ct5km_ssta_v3.1_20150510.png',

// onLoad callback

function ( imageBitmap ) {
  const texture = new THREE.CanvasTexture( imageBitmap );
  console.log(texture)
  const materialSSTA = new THREE.MeshBasicMaterial( {transparent: true, map: texture } );
   sphere2 = new THREE.Mesh(geometry, materialSSTA);
  sphere2.material.needsUpdate = true;
scene.add(sphere2);
})
}
addImageBitmap()

// const materialSSTA = new THREE.MeshBasicMaterial({
//   map: new THREE.CanvasTexture(firstImage)
// });
// materialSSTA.needsUpdate = true;

// const sphere2 = new THREE.Mesh(geometry, materialSSTA);
// scene.add(sphere2);
// temperature Mesh

console.log('hi')


  scene.position.y = 0.5

  // Sizes
  const sizes = {
    width: 900,
    height: 900
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
  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
  camera.position.z = 3
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

//   function animate() {
//     // console.log(scene)
//     scene.rotation.y += 0.04;
//     requestAnimationFrame(animate);
//     renderer.render(scene, camera);
//     // labelRenderer.render(scene, camera);
//   }
//   function animate() {
//     // resize();
//     scene.rotation.y += 0.005;
//     renderer.render(scene, camera);
//     requestAnimationFrame(animate);
//   }
//   animate()
  // all the rest of the data
  

  
  
  
  



  function delay(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
}




function createWorker(data) {
    return new Promise(function(resolve, reject) {
        var v = new Worker(new URL('./for.js', import.meta.url));
        v.postMessage(data);
        v.onmessage = function(event){
            // console.log(new THREE.CanvasTexture( event.data ))
            resolve(new THREE.CanvasTexture( event.data ));
        };
 
        v.onerror = reject; // Rejects the promise if an error is raised by the web worker, passing along the ErrorEvent
      
    });
}

// let files = ['./data/DailyData201501.dat','./data/DailyData201502.dat','./data/DailyData201503.dat']
const dates = Array.from({length: 10}, (_, i) => {
  const date = new Date(2015, 0, 1);
  date.setDate(i + 1);
  return date;
})

let promises = [];
for(let i = 0; i < dates.length; i++) {
    promises.push(createWorker('./textures/ct5km_ssta_v3.1_'+ dates[i].toISOString().slice(0, 10).replaceAll('-','')+ '.png'));
}

// runs the animation
async function printy(text) {
  console.log(text)
  // function addImageBitmap() {

  //   new THREE.ImageBitmapLoader()
  //     .setOptions( { imageOrientation: 'flipY'  } )
  //     .load('./textures/ct5km_ssta_v3.1_20150510.png',
  
  // onLoad callback
  // function ( imageBitmap ) {
  //   const texture = new THREE.CanvasTexture( imageBitmap );
    // const materialSSTA = new THREE.MeshBasicMaterial( {transparent: true, map: text } );
    sphere2.material.map = text
    // const sphere2 = new THREE.Mesh(geometry, materialSSTA);
    sphere2.material.needsUpdate = true;
  // scene.add(sphere2);
  // })
  // }
  // addImageBitmap()
  
    // console.log('tick')
    // const count = 555976 * 3 //size of each grid
    // for (let i = 0; i < v.length; i += count) {
        // await delay(1000);
        // console.log('tick')
        // sphere2.material.map = text;
        // sphere2.material.needsUpdate = true;
        // renderer.render(scene, camera)
        // animateFiles(dayofData)
        
    // }


}
Promise.all(promises)
    .then(function(textures) {
      let colorData = null
        console.log(textures)
        async function load () { 
        for(let i = 0; i < textures.length; i++){
          // colorData =  i === 0 ? data[i] : Float32Concat(colorData,data[i])
          await delay(100);
          
          printy(textures[i])
          
        }
      }
      load()
        // let c = new Float32Array(data.length * 555976 * 3);

        // let colorData = Float32Concat(data[0],data[1])
        //  colorData = Float32Concat(colorData,data[2])
        //  colorData = Float32Concat(colorData,data[3])
        // console.log(colorData.length)
        // 
        // for(j = 0; j < data.length; j++){
            // printy(data[0])
        // }

        // animate();

// printy(colorData)
// test additional web workers


    })
    .catch(function(error) {
        // something went wrong
    });



// })
