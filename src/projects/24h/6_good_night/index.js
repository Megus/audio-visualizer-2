import Project from "../../../common/Project";
import LayerSystem from "../../../common/LayerSystem";
import ScriptSystem from "../../../common/ScriptSystem";
import AudioAnalyzer from "../../../common/AudioAnalyzer";

import layers from "./layers";

class PGoodNight extends Project {
  constructor(config, canvas) {
    super(config, canvas);
    this.audioPath = `${__dirname}/gn-7.mp3`;
    this.audioUrl = `${this.relativeFolder(__dirname)}gn-7.mp3`;
  }

  async setup() {
    this.audioAnalyzer = new AudioAnalyzer(this.audioPath);
    await this.audioAnalyzer.loadAudio();

    this.layerSystem = new LayerSystem(this.canvas, __dirname);
    await this.layerSystem.buildLayers(layers);

    this.scriptSystem = new ScriptSystem();
    this.scriptSystem.addScript(this.mainScript.bind(this));
  }

  /**
   *
   * @param {ScriptSystem} s
   */
  * mainScript(s) {
    const l = this.layerSystem.layersMap;

  }


  renderFrame(timestamp, dTimestamp) {
    this.scriptSystem.update(timestamp, dTimestamp);

    // Fill pitches
    const ballSizes = this.layerSystem.layersMap.metaballs.p.ballSizes;
    const pitches = this.audioAnalyzer.getPitchArray(timestamp);
    for (let i = 0; i < ballSizes.length; i++) {
      let v = pitches[i + 24];
      v *= 100 * (i + 1) / ballSizes.length;  // Scale factor
      v = Math.min(1, v); // Limiting
      // Smoothing
      if (v > ballSizes[i]) ballSizes[i] = v * 0.9 + ballSizes[i] * 0.1;
      if (v < ballSizes[i]) ballSizes[i] = v * 0.2 + ballSizes[i] * 0.8;
    }

    const ctx = this.canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.layerSystem.renderFrame(timestamp, dTimestamp);
  }
}

export default PGoodNight;