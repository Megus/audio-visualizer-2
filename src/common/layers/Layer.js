class Layer {
  constructor(canvas, constants) {
    this.canvas = canvas;
    this.c = constants || {};
    this.p = {
      on: true,
      pos: [0, 0],
      size: [canvas.width, canvas.height],
    };
    this.children = [];
  }

  async setup() {};

  addChild(child) {
    this.children.push(child);
  }

  removeChild(child) {
    // TODO
  }

  renderFrame(timestamp, dTimestamp) {};
}

export default Layer;