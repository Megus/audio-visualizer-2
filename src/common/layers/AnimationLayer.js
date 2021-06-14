import * as fs from "fs";

import * as utils from "../utils";
import Layer from "./Layer";

class AnimationLayer extends Layer {
  constructor(canvas, c, p) {
    super(canvas, c, p);
    this.c = { ...this.c, fit: "aspectFit" };
    this.p = { ...this.p, frame: 0, fps: 30 };
    this.frames = [];
  }

  async setup(folderPath) {
    const pattern = this.c.pattern;
    const frameNumberIdx = pattern.indexOf("%");
    let frameNumberLength = 1;
    for (let i = frameNumberIdx + 1; i < pattern.length; i++) {
      if (pattern.charAt(i) == "%") {
        frameNumberLength++;
      } else {
        break;
      }
    }

    const patternPrefix = pattern.substring(0, frameNumberIdx);
    const patternSuffix = pattern.substring(frameNumberIdx + frameNumberLength);

    for (let i = this.c.range[0]; i <= this.c.range[1]; i++) {
      const imagePath = folderPath + "/" + patternPrefix + i.toString().padStart(frameNumberLength, "0") + patternSuffix;
      const imageBlob = new Blob([fs.readFileSync(imagePath)], {"type": "image/png"});
      const image = await createImageBitmap(imageBlob);
      this.frames.push(image);
    }
  }

  renderFrame(timestamp, dTimestamp) {
    const frame = Math.floor(this.p.frame) % this.frames.length;
    const image = this.frames[frame];

    const cW = this.p.size[0];
    const cH = this.p.size[1];
    const imgW = image.width;
    const imgH = image.height;

    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, cW, cH);

    const {x, y, w, h, sx, sy, sw, sh} = utils.scaleImageInFrame(this.c.fit, imgW, imgH, cW, cH);
    ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);

    this.p.frame += dTimestamp * this.p.fps;
  }
}

export default AnimationLayer;