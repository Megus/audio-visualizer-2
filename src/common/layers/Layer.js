class Layer {
  constructor(canvas, c, p) {
    this.canvas = canvas;
    this.c = c || {};
    this.p = { on: true, pos: [0, 0], size: [canvas.width, canvas.height], ...(p || {}) };
  }

  async setup(folderPath) {};

  renderFrame(timestamp, dTimestamp) {};
}

export default Layer;