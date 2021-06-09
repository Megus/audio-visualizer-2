import Project from "../../../common/Project";
import LayerSystem from "../../../common/LayerSystem";

import layers from "./layers";

const fftSize = 2048;

class PGoodNight extends Project {
  constructor(config, canvas) {
    super(config, canvas);
    this.audioPath = `${__dirname}/gn-7.mp3`;
    this.audioUrl = `${this.relativeFolder(__dirname)}gn-7.mp3`;
  }

  async setup() {
    this.layerSystem = new LayerSystem(this.canvas, __dirname);
    this.layerSystem.buildLayers(layers);
  }

  renderFrame(timestamp, dTimestamp) {
    const ctx = this.canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.layerSystem.renderFrame(timestamp, dTimestamp);
  }
}

export default PGoodNight;