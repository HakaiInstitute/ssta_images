import * as THREE from 'three'

const loader = new THREE.ImageBitmapLoader();

const minMaxValueToUse = 4
const count = 555976 * 3
// const loadedBuffer = fs.readFileSync('data.dat')
// const newFloat32Array = new Float32Array(loadedBuffer.buffer)
onmessage = function (fileToLoad) {
  console.log()
  loader.load(fileToLoad.data, (imageBitmap) => {
    // console.log(imageBitmap)
    const texture = new THREE.CanvasTexture( imageBitmap );
    // console.log(texture)
    postMessage(texture)
  })
  // d3.csv(fileToLoad.data).then(function (data) {
  //   // console.log(new Float32Array(data.map(d => d.sst)))
  //   postMessage(new Float32Array(data.map(d => d.sst)))
  // })
}
