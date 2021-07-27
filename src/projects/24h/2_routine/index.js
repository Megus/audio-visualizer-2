import Project from "../../../common/Project";
import LayerSystem from "../../../common/LayerSystem";
import ScriptSystem from "../../../common/ScriptSystem";
import AudioAnalyzer from "../../../common/AudioAnalyzer";

import layers from "./layers";

export default class extends Project {
  constructor(config, canvas) {
    super(config, canvas);
    this.audioPath = `${__dirname}/r-2.mp3`;
    this.audioUrl = `${this.relativeFolder(__dirname)}r-2.mp3`;
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

    const ctx = this.canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.layerSystem.renderFrame(timestamp, dTimestamp);
  }
}
