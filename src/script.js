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

const earthTexture = textureLoader.load('./textures/BC_terrain.png')
earthTexture.anisotropy = 16;
// earthTexture.minFilter =  THREE.NearestMipmapNearestFilter
// lights
// const light = new THREE.AmbientLight(0x404040, 4);

// console.log(earthTexture)
// earthTexture.needsUpdate = true

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

const materialSSTA = new THREE.MeshBasicMaterial({
  map: texture,
  // color: "white"
});
materialSSTA.needsUpdate = true;

const sphereSSTA = new THREE.Mesh(geometry, materialSSTA);
scene.add(sphereSSTA);

// let sphereSSTA = null
// function addImageBitmap() {

//   new THREE.ImageBitmapLoader()
//     .setOptions( { imageOrientation: 'flipY',premultiplyAlpha: 'none'  } )
//     .load('./textures/ct5km_ssta_v3.1_20150102.png',

// // onLoad callback

// function ( imageBitmap ) {
//   const texture = new THREE.CanvasTexture( imageBitmap );
//   // console.log(texture)
//   const materialSSTA = new THREE.MeshBasicMaterial( { map: texture } );
//   // sphereSSTA.material.map = texture;
//   sphereSSTA = new THREE.Mesh(geometry, materialSSTA);
//   sphereSSTA.material.needsUpdate = true;
// scene.add(sphereSSTA);
// })
// }
// addImageBitmap()
scene.add(sphereBG);
// scene.add(sphereSSTA);

// const materialSSTA = new THREE.MeshBasicMaterial({
//   map: new THREE.CanvasTexture(firstImage)
// });
// materialSSTA.needsUpdate = true;

// const sphere2 = new THREE.Mesh(geometry, materialSSTA);
// scene.add(sphere2);
// temperature Mesh

// console.log('hi')


  // scene.position.y = 0.5

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
      // console.log(import.meta.url)
        var v = new Worker(new URL('./for.js', import.meta.url));
        
        v.postMessage(data);
  
        v.onmessage = function(event){
          
            // console.log(new THREE.CanvasTexture( event.data ))
            resolve(new THREE.CanvasTexture( event.data ));
        };
 
        v.onerror = reject; // Rejects the promise if an error is raised by the web worker, passing along the ErrorEvent
      
    })
 
}

// load dates

d3.csv('./names.csv').then(function (allFiles) {
// console.log(allFiles)
  // return just the file names that are dates
  const dateFiles = allFiles.filter((d) => {
    if (!isNaN(Number(d.files.slice(-5, -4)))) {
      return d.files;
    }
  }).map((d) => d.files).sort((a, b) => {
    return b - a;
  })

  // console.log(dateFiles)

  let promises = [];
  for(let i = 0; i < 30; i++) {
      promises.push(createWorker('./textures/'+ dateFiles[i]));
  }
  
  // runs the animation
  async function printy(text) {
  
    sphereSSTA.material.map = text
    // sphereSSTA.material.color = "white"
    sphereSSTA.material.needsUpdate = true;
  
  
  
  }
  Promise.all(promises)
      .then(function(textures) {
          // console.log(textures)
          async function load () { 
          for(let i = 0; i < textures.length; i++){
            // colorData =  i === 0 ? data[i] : Float32Concat(colorData,data[i])
            await delay(200);
            
            printy(textures[i])
            
          }
        }
        load()
     
  
  
  
  
      })


})


// let files = ['./data/DailyData201501.dat','./data/DailyData201502.dat','./data/DailyData201503.dat']
// const dates = Array.from({length: 30}, (_, i) => {
//   const date = new Date(2015, 0, 1);
//   date.setDate(i + 1);
//   return date;
// })


  



// })
