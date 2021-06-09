import AudioAnalyzer from "../../common/AudioAnalyzer";
import Project from "../../common/Project";
import LayerSystem from "../../common/LayerSystem";

import layers from "./layers";

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

    // Layer system init
    this.layerSystem = new LayerSystem(this.canvas);
    this.layerSystem.buildLayers(layers);
  }

  renderFrame(timestamp, dTimestamp) {
    const ctx = this.canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.layerSystem.renderFrame(timestamp, dTimestamp);
  }
}

export default Project1;