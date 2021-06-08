import Layer from "./Layer";

class FilterLayer extends Layer {
  constructor(canvas, constants) {
    super(canvas, constants);
  }

  renderFrame(timestamp, dTimestamp) {
    this.children.forEach((layer) => {
      layer.renderFrame(timestamp, dTimestamp);
      ctx.drawImage(layer.canvas, 0, 0, layer.p.size[0], layer.p.size[1], layer.p.pos[0], layer.p.pos[1], layer.p.size[0], layer.p.size[1]);
    });
  }
}

export default FilterLayer;