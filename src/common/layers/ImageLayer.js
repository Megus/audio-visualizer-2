import * as fs from "fs";

import * as utils from "../utils";
import Layer from "./Layer";

class ImageLayer extends Layer {
  constructor(canvas, c, p) {
    super(canvas, c, p);
    this.c = { fit: "aspectFit", ...this.c };
    this.p = { offset: [0, 0], ...this.p };
  }

  async setup(folderPath) {
    const imagePath = `${folderPath}/${this.c.image}`;
    const imageBlob = new Blob([fs.readFileSync(imagePath)], {"type": "image/png"});
    this.image = await createImageBitmap(imageBlob);
  }

  renderFrame(timestamp, dTimestamp) {
    const cW = this.p.size[0];
    const cH = this.p.size[1];
    const imgW = this.image.width;
    const imgH = this.image.height;

    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, cW, cH);

    const {x, y, w, h, sx, sy, sw, sh} = utils.scaleImageInFrame(this.c.fit, imgW, imgH, cW, cH);
    ctx.drawImage(this.image, sx, sy, sw, sh, x + this.p.offset[0], y + this.p.offset[1], w, h);
  }
}

export default ImageLayer;