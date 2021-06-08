import Layer from "./Layer";

class RectLayer extends Layer {
  constructor(canvas, constants) {
    super(canvas, constants);

    this.p = { ...this.p, color: [255, 255, 255, 255] };
  }

  renderFrame(timestamp, dTimestamp) {
    const ctx = this.canvas.getContext("2d");
    ctx.fillStyle = `rgba(${this.p.color[0]},${this.p.color[1]},${this.p.color[2]},${this.p.color[3]})`;
    ctx.fillRect(0, 0, this.p.size[0], this.p.size[1]);
  }
}

export default RectLayer;