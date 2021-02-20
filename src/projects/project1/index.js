import * as THREE from 'three';

import Project from "../../common/Project";

class Project1 extends Project {
  constructor(config, canvas) {
    super(config, canvas);

    // Initialize ThreeJS Scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, config.width / config.height, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;
  }

  renderFrame(timestamp, dTimestamp) {
    this.cube.rotation.x += dTimestamp;
    this.cube.rotation.y += dTimestamp;
    this.renderer.render(this.scene, this.camera);
  }
}

export default Project1;