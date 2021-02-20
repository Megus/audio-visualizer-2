import { ipcRenderer } from 'electron';
import * as THREE from 'three';

import config from '../common/config';

// Initialize HTML
document.body.style.margin = "0px"
const mainCanvas = document.createElement("canvas");
mainCanvas.width = config.width;
mainCanvas.height = config.height;
mainCanvas.style.width = `${config.width / 2}px`;
mainCanvas.style.height = `${config.height / 2}px`;

document.body.appendChild(mainCanvas);

// Initialize ThreeJS Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: mainCanvas,
});

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
	renderer.render(scene, camera);

  if (config.renderVideo == true) {
    const png = mainCanvas.toDataURL();
    ipcRenderer.sendSync("frame-msg", png);
  }

  requestAnimationFrame( animate );
}

animate();