import { Layer, ImageLayer } from "../../common/layers";

class MegusLogo extends Layer {
  constructor(canvas, c, p) {
    super(canvas, c, p);

    this.imageLayer = new ImageLayer(canvas, { image: "logo.png" }, { size: [150, 150] });
  }

  async setup(folderPath) {
    await this.imageLayer.setup(__dirname);
  }

  renderFrame(timestamp, dTimestamp) {
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