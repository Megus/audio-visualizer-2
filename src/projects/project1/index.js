import * as THREE from 'three';

import AudioAnalyzer from "../../common/AudioAnalyzer";
import Project from "../../common/Project";

const fftSize = 2048;

class Project1 extends Project {
  constructor(config, canvas) {
    super(config, canvas);
    const dirs = __dirname.split("/");
    console.log(dirs[dirs.length - 1]);
    this.audioPath = "project1/piotr-3.mp3";
  }

  async setup() {
    this.audioAnalyzer = new AudioAnalyzer(`${__static}/${this.audioPath}`, fftSize);
    await this.audioAnalyzer.loadAudio();

    // Initialize ThreeJS
    const scene = new THREE.Scene();
    this.scene = scene;
    const camera = new THREE.PerspectiveCamera(75, this.config.width / this.config.height, 0.1, 1000);
    this.camera = camera;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.renderer.setClearColor(new THREE.Color(0x000000));
    this.renderer.shadowMap.enabled = true;

    // Build a scene
    let axes = new THREE.AxesHelper(20); scene.add(axes);
    var planeGeometry = new THREE.PlaneGeometry(60, 20);
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xAAAAAA});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, -1, 0);
    plane.receiveShadow = true;
    scene.add(plane);
    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xFF0000,
    });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    cube.castShadow = true;
    scene.add(cube);
    // create a sphere
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777FF,
    });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    sphere.castShadow = true;
    scene.add(sphere);

    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40, 40, -15);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    scene.add(spotLight);

    // position and point the camera to the center of the scene
    camera.position.set(-20, 20, 10);
    camera.lookAt(scene.position);


    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;
  }

  renderFrame(timestamp, dTimestamp) {
    this.renderer.render(this.scene, this.camera);
  }
}

export default Project1;