/**
 *
 */
class Layer {
  /**
   *
   * @param {OffscreenCanvas} canvas
   * @param {object} c
   * @param {object} p
   */
  constructor(canvas, c, p) {
    this.canvas = canvas;
    this.c = c || {};
    this.p = { on: true, alpha: 1, pos: [0, 0], size: [canvas.width, canvas.height], ...(p || {}) };
  }

  /**
   *
   * @param {sting} folderPath
   */
  async setup(folderPath) {};

  /**
   *
   * @param {number} timestamp
   * @param {number} dTimestamp
   */
  renderFrame(timestamp, dTimestamp) {};
}

export default Layer;