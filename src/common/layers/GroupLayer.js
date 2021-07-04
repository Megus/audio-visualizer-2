import Layer from "./Layer";

class GroupLayer extends Layer {
  constructor(canvas, c, p) {
    super(canvas, c, p);
  }

  renderFrame(timestamp, dTimestamp) {
    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.p.size[0], this.p.size[1]);

    this.children.forEach((layer) => {
      layer.renderFrame(timestamp, dTimestamp);
      ctx.globalAlpha = layer.p.alpha;
      ctx.drawImage(layer.canvas, 0, 0, layer.p.size[0], layer.p.size[1], layer.p.pos[0], layer.p.pos[1], layer.p.size[0], layer.p.size[1]);
    });
  }
}

export default GroupLayer;