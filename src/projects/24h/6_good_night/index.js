import Project from "../../../common/Project";
import LayerSystem from "../../../common/LayerSystem";
import ScriptSystem from "../../../common/ScriptSystem";

import layers from "./layers";

class PGoodNight extends Project {
  constructor(config, canvas) {
    super(config, canvas);
    this.audioPath = `${__dirname}/gn-7.mp3`;
    this.audioUrl = `${this.relativeFolder(__dirname)}gn-7.mp3`;
  }

  async setup() {
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

    l.jake.p.fps = 5;
    l.filter.p.pos = [100, 100];
    yield* s.wait(1);
    s.animate(l.filter.p, "pos", s.easing.easeOutElastic, 3, [500, 200]);
    s.animate(l.jake.p, "fps", s.easing.linear, 7, 60);
  }


  renderFrame(timestamp, dTimestamp) {
    this.scriptSystem.update(timestamp, dTimestamp);
    const ctx = this.canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.layerSystem.renderFrame(timestamp, dTimestamp);
  }
}

export default PGoodNight;