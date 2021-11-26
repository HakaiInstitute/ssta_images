import * as THREE from 'three'

const loader = new THREE.ImageBitmapLoader().setOptions( { imageOrientation: 'flipY'  } );


onmessage = function (fileToLoad) {
  // console.log(fileToLoad)
  loader.load(fileToLoad.data, function (imageBitmap){
    const texture = new THREE.CanvasTexture( imageBitmap );
    // console.log(imageBitmap)
    postMessage(imageBitmap)
  }, undefined, function (e){
    console.error(e);
    

  }) 
  // => {
  //   // console.log(imageBitmap)
    
   
  // })

}
