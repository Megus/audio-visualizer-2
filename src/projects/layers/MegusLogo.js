import { Layer, ImageLayer } from "../../common/layers";
import ScriptSystem from "../../common/ScriptSystem";

class MegusLogo extends Layer {
  constructor(canvas, c, p) {
    super(canvas, c, p);

    this.imageLayer = new ImageLayer(canvas, { image: "logo.png" }, { size: [150, 150] });
  }

  async setup(folderPath) {
    await this.imageLayer.setup(__dirname);
    this.scriptSystem = new ScriptSystem();
    this.scriptSystem.addScript(this.mainScript.bind(this));
  }

  * mainScript(s) {
    yield* s.wait(12);
    s.animate(this.p, "alpha", s.easing.linear, 2, 0);
  }

  renderFrame(timestamp, dTimestamp) {
    this.scriptSystem.update(timestamp, dTimestamp);

    const ctx = this.canvas.getContext("2d");
    ctx.resetTransform();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.translate(40, 30);
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;

    this.imageLayer.renderFrame(timestamp, dTimestamp);
  }
}

export default MegusLogo;