import Project from "../../../common/Project";
import LayerSystem from "../../../common/LayerSystem";
import ScriptSystem from "../../../common/ScriptSystem";
import AudioAnalyzer from "../../../common/AudioAnalyzer";

import layers from "./layers";
import { rndArrayItem } from "../../../common/utils";

export default class extends Project {
  constructor(config, canvas) {
    super(config, canvas);
    this.audioPath = `${__dirname}/summer-mood.mp3`;
    this.audioUrl = `${this.relativeFolder(__dirname)}summer-mood.mp3`;
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
    const beatDuration = (4 * 6 * (1 / 48));
    const modes = ["h", "v", "hv", "8", "hv", "8", "hv", "8"];

    const l = this.layerSystem.layersMap;
    let oldBeat = 0;

    while (1) {
      const t = Math.floor((s.timestamp - 0.2) / beatDuration);
      const beat = t % 4;
      if (beat == 3 && oldBeat != beat) {
        l.mirror.p.mode = rndArrayItem(modes);
      } else if (beat != 3) {
        l.mirror.p.mode = "off";
      }
      oldBeat = beat;
      yield;
    }

  }


  renderFrame(timestamp, dTimestamp) {
    this.scriptSystem.update(timestamp, dTimestamp);

    const levels = this.layerSystem.layersMap.sil.p.levels;
    const pitches = this.audioAnalyzer.getPitchArray(timestamp);
    for (let i = 0; i < levels.length; i++) {
      let v = pitches[i + 24] + pitches[i + 48];
      v *= 100 * (i + 1) / levels.length;  // Scale factor
      v = Math.min(v, 1); // Limiting
      // Smoothing
      if (v > levels[i]) levels[i] = v * 0.9 + levels[i] * 0.1;
      if (v < levels[i]) levels[i] = v * 0.2 + levels[i] * 0.8;
    }


    const ctx = this.canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.layerSystem.renderFrame(timestamp, dTimestamp);
  }
}