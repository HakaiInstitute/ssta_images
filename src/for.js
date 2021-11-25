import * as THREE from 'three'

const loader = new THREE.ImageBitmapLoader().setOptions( { imageOrientation: 'flipY'  } );


onmessage = function (fileToLoad) {
  // console.log()
  loader.load(fileToLoad.data, (imageBitmap) => {
    // console.log(imageBitmap)
    const texture = new THREE.CanvasTexture( imageBitmap );
    // console.log(imageBitmap)
    postMessage(imageBitmap)
  })

}
