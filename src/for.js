import * as THREE from 'three'

const loader = new THREE.ImageBitmapLoader().setOptions( { imageOrientation: 'flipY',premultiplyAlpha: 'none' } );


onmessage = function (fileToLoad) {
  loader.load(fileToLoad.data, function (imageBitmap){
    postMessage(imageBitmap)
  }, undefined, function (e){
    console.error(e);
  }) 


}
