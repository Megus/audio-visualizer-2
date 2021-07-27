import Project from "../../../common/Project";
import LayerSystem from "../../../common/LayerSystem";
import ScriptSystem from "../../../common/ScriptSystem";
import AudioAnalyzer from "../../../common/AudioAnalyzer";

import layers from "./layers";

export default class extends Project {
  constructor(config, canvas) {
    super(config, canvas);
    this.audioPath = `${__dirname}/gn-teaser-fades.wav`;
    this.audioUrl = `${this.relativeFolder(__dirname)}gn-teaser-fades.wav`;
  }

  async setup() {
    this.audioAnalyzer = new AudioAnalyzer(this.audioPath);
    await this.audioAnalyzer.loadAudio();

    this.layerSystem = new LayerSystem(this.canvas, __dirname);
    await this.layerSystem.buildLayers(layers);

    this.scriptSystem = new ScriptSystem();
    this.scriptSystem.addScript(this.mainScript.bind(this));
    this.scriptSystem.addScript(this.timingScript.bind(this));

    this.camera = [0, 0];
  }

  /**
   *
   * @param {ScriptSystem} s
   */
  * mainScript(s) {
    const l = this.layerSystem.layersMap;
    const delay = 4;
    const easing = s.easing.easeInOutSine;

    yield* s.wait(1 + Math.random());
    while (true) {
      const dir = Math.floor(Math.random() * 4);
      if (dir == 0) { // Top
        const tx = Math.random() * 2 - 1;
        s.animate(this, "camera", easing, delay, [tx, -1]);
      } else if (dir == 1) {  // Bottom
        const tx = Math.random() * 2 - 1;
        s.animate(this, "camera", easing, delay, [tx, 1]);
      } else if (dir == 2) {  // Left
        const ty = Math.random() * 2 - 1;
        s.animate(this, "camera", easing, delay, [-1, ty]);
      } else if (dir == 3) {  // Right
        const ty = Math.random() * 2 - 1;
        s.animate(this, "camera", easing, delay, [1, ty]);
      }
      yield* s.wait(delay + 1.5 + Math.random() * delay * 0.5);
    }
  }

  /**
   *
   * @param {ScriptSystem} s
   */
  * timingScript(s) {
   const content = this.layerSystem.layersMap.content;

   content.p.alpha = 0;
   s.animate(content.p, "alpha", s.easing.linear, 2, 1);

   yield* s.wait(50);
   s.animate(content.p, "alpha", s.easing.linear, 10, 0);
  }


  renderFrame(timestamp, dTimestamp) {
    this.scriptSystem.update(timestamp, dTimestamp);

    // Parallax
    const l = this.layerSystem.layersMap;
    const x = this.camera[0] * 3 + Math.sin(timestamp * 0.5 + 0.2) * 0.3;
    const y = this.camera[1] * 1 + Math.cos(timestamp * 0.6) * 0.3;
    const oX = -350;
    l.l1.p.offset = [oX + x * 4, y * 4 - 50]
    l.l2.p.offset = [oX + x * 8, y * 8]
    l.l3.p.offset = [oX + x * 12, y * 12]
    l.l4.p.offset = [oX + x * 25, y * 25 - 25]

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

    this.layerSystem.renderFrame(timestamp, dTimestamp);
  }
}