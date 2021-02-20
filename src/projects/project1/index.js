import * as THREE from 'three';

import AudioAnalyzer from "../../common/AudioAnalyzer";
import Project from "../../common/Project";

const fftSize = 2048;

class Project1 extends Project {
  constructor(config, canvas) {
    super(config, canvas);

    this.audioPath = "piotr-3.mp3";
  }

  async setup() {
    this.audioAnalyzer = new AudioAnalyzer(`${__static}/${this.audioPath}`, fftSize);
    await this.audioAnalyzer.loadAudio();

    // Initialize ThreeJS Scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.config.width / this.config.height, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;
  }

  renderFrame(timestamp, dTimestamp) {
    const power = this.audioAnalyzer.getPower(timestamp) * 10;

    this.cube.scale.x = power;
    this.cube.scale.y = power;
    this.cube.scale.z = power;
    this.cube.rotation.x += dTimestamp;
    this.cube.rotation.y += dTimestamp;
    this.renderer.render(this.scene, this.camera);
  }
}

export default Project1;