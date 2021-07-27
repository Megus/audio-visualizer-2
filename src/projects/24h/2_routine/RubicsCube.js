import * as THREE from 'three';

import { Layer } from "../../../common/layers";

class RubicsCube extends Layer {
  constructor(canvas, c, p) {
    super(canvas, c, p);
  }

  async setup(folderPath) {
    // Initialize ThreeJS
    const scene = new THREE.Scene();
    this.scene = scene;
    const camera = new THREE.PerspectiveCamera(75, this.canvas.width / this.canvas.height, 0.1, 1000);
    this.camera = camera;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.renderer.setClearColor(new THREE.Color(0x000000));
    this.renderer.shadowMap.enabled = true;

    // Build a scene
    const cube = this.createCube();
    scene.add(cube);
    this.cube = cube;

    var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-50, 40, -15);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    scene.add(spotLight);

    // position and point the camera to the center of the scene
    camera.position.set(-1, 3, 2);
    camera.lookAt(scene.position);

    /*const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);*/

    this.camera.position.z = 5;
  }

  createCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    var cubeMaterial = new THREE.MeshStandardMaterial({color: 0xFF8000, metalness: 0.5});
    const cube = new THREE.Mesh(geometry, cubeMaterial);
    cube.position.set(1, -1, 1);
    cube.castShadow = true;

    return cube;
  }

  renderFrame(timestamp, dTimestamp) {
    this.renderer.render(this.scene, this.camera);
    this.cube.rotateX(0.01);
  }
}

export default RubicsCube;