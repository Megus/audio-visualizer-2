import { rndArrayItem, rndRange } from "../../common/utils";
import Layer from "../../common/layers/Layer";
import { TouchBarScrubber } from "electron";

const gradients = [
  [[0, 0, 0], [0, 0, 255], [0, 255, 255], [255, 255, 255]],
  [[0, 0, 0], [255, 0, 0], [255, 255, 0], [255, 255, 255]],
  [[0, 0, 0], [255, 0, 255], [0, 255, 255], [255, 255, 255]],
  [[0, 0, 0], [0, 255, 0], [255, 255, 0], [255, 255, 255]],
]

class Shape {
  constructor(layer) {
    this.layer = layer;
    this.gradient = rndArrayItem(gradients);
  }

  updateShape(dTimestamp) {}

  drawShape(ctx, level) {}

  moveAndBounce(p, s, dTimestamp) {
    p[0] += s[0] * this.layer.p.speed * dTimestamp;
    p[1] += s[1] * this.layer.p.speed * dTimestamp;

    if (p[0] < 0 || p[0] > this.layer.p.size[0]) s[0] *= rndRange(-0.9, -1.1);
    if (p[1] < 0 || p[1] > this.layer.p.size[1]) s[1] *= rndRange(-0.9, -1.1);
  }

  colorMix(col1, col2, l, h, level) {
    const a = (level - l) / (h - l);
    return [
      col1[0] + (col2[0] - col1[0]) * a,
      col1[1] + (col2[1] - col1[1]) * a,
      col1[2] + (col2[2] - col1[2]) * a,
    ]
  }

  getLevelStrokeStyle(level) {
    let color = [0, 0, 0];
    if (level < 0.5)
      color = this.colorMix(this.gradient[0], this.gradient[1], 0, 0.5, level)
    else if (level < 0.9)
      color = this.colorMix(this.gradient[1], this.gradient[2], 0.5, 0.9, level);
    else
      color = this.colorMix(this.gradient[2], this.gradient[3], 0.9, 1, level);

    const a = Math.sin(level * Math.PI / 2);

    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${a})`;
  }
}

class Line extends Shape {
  constructor(layer) {
    super(layer);
    const w = layer.p.size[0];
    const h = layer.p.size[1];

    this.p1 = [rndRange(0, w), rndRange(0, h)];
    this.p2 = [rndRange(0, w), rndRange(0, h)];
    this.s1 = [rndRange(-1, 1), rndRange(-1, 1)];
    this.s2 = [rndRange(-1, 1), rndRange(-1, 1)];
  }

  updateShape(dTimestamp) {
    this.moveAndBounce(this.p1, this.s1, dTimestamp);
    this.moveAndBounce(this.p2, this.s2, dTimestamp);
  }

  drawShape(ctx, level) {
    ctx.beginPath();
    ctx.strokeStyle = this.getLevelStrokeStyle(level);
    ctx.lineWidth = this.layer.p.lineWidth;
    ctx.moveTo(this.p1[0], this.p1[1]);
    ctx.lineTo(this.p2[0], this.p2[1]);
    ctx.stroke();
  }
}

class Triangle extends Shape {
  constructor(layer) {
    super(layer);
    const w = layer.p.size[0];
    const h = layer.p.size[1];

    this.p1 = [rndRange(0, w), rndRange(0, h)];
    this.p2 = [rndRange(0, w), rndRange(0, h)];
    this.p3 = [rndRange(0, w), rndRange(0, h)];
    this.s1 = [rndRange(-1, 1), rndRange(-1, 1)];
    this.s2 = [rndRange(-1, 1), rndRange(-1, 1)];
    this.s3 = [rndRange(-1, 1), rndRange(-1, 1)];
  }

  updateShape(dTimestamp) {
    this.moveAndBounce(this.p1, this.s1, dTimestamp);
    this.moveAndBounce(this.p2, this.s2, dTimestamp);
    this.moveAndBounce(this.p3, this.s3, dTimestamp);
  }

  drawShape(ctx, level) {
    ctx.beginPath();
    ctx.strokeStyle = this.getLevelStrokeStyle(level);
    ctx.lineWidth = this.layer.p.lineWidth;
    ctx.moveTo(this.p1[0], this.p1[1]);
    ctx.lineTo(this.p2[0], this.p2[1]);
    ctx.lineTo(this.p3[0], this.p3[1]);
    ctx.lineTo(this.p1[0], this.p1[1]);
    ctx.stroke();
  }
}

class Circle extends Shape {
  constructor(layer) {
    super(layer);
    const w = layer.p.size[0];
    const h = layer.p.size[1];

    this.r = rndRange(0, h / 4);
    this.p = [rndRange(this.r, w - this.r), rndRange(this.r, h - this.r)];
    this.sp = [rndRange(-1, 1), rndRange(-1, 1)];
    this.sr = rndRange(-0.5, 0.5);

  }

  updateShape(dTimestamp) {
    this.moveAndBounce(this.p, this.sp, dTimestamp);
    this.r += this.sr * this.layer.p.speed * dTimestamp;
    if (this.r < 0 || this.r > this.layer.p.size[1] / 4) this.sr *= rndRange(-0.9, -1.1);
  }

  drawShape(ctx, level) {
    ctx.beginPath();
    ctx.strokeStyle = this.getLevelStrokeStyle(level);
    ctx.lineWidth = this.layer.p.lineWidth;
    ctx.arc(this.p[0], this.p[1], Math.abs(this.r), 0, 2 * Math.PI);
    ctx.stroke();
  }
}

class Rectangle extends Shape {
  constructor(layer) {
    super(layer);
    const w = layer.p.size[0];
    const h = layer.p.size[1];

    this.p1 = [rndRange(0, w), rndRange(0, h)];
    this.p3 = [rndRange(0, w), rndRange(0, h)];
    this.p2 = [this.p3[0], this.p1[1]];
    this.p4 = [this.p1[0], this.p3[1]];
    this.s1 = [rndRange(-1, 1), rndRange(-1, 1)];
    this.s2 = [rndRange(-1, 1), rndRange(-1, 1)];
    this.s3 = [rndRange(-1, 1), rndRange(-1, 1)];
    this.s4 = [rndRange(-1, 1), rndRange(-1, 1)];
  }

  updateShape(dTimestamp) {
    this.s2[1] = this.s1[1];
    this.s3[0] = this.s2[0];
    this.s4[0] = this.s1[0];
    this.s4[1] = this.s3[1];
    this.moveAndBounce(this.p1, this.s1, dTimestamp);
    this.moveAndBounce(this.p2, this.s2, dTimestamp);
    this.moveAndBounce(this.p3, this.s3, dTimestamp);
    this.moveAndBounce(this.p4, this.s4, dTimestamp);
  }

  drawShape(ctx, level) {
    ctx.beginPath();
    ctx.strokeStyle = this.getLevelStrokeStyle(level);
    ctx.lineWidth = this.layer.p.lineWidth;
    ctx.moveTo(this.p1[0], this.p1[1]);
    ctx.lineTo(this.p2[0], this.p2[1]);
    ctx.lineTo(this.p3[0], this.p3[1]);
    ctx.lineTo(this.p4[0], this.p4[1]);
    ctx.lineTo(this.p1[0], this.p1[1]);
    ctx.stroke();
  }

}

class SongInLines extends Layer {
  constructor(canvas, c, p) {
    super(canvas, c, p);
    this.c = { shapes: 10, ...this.c };
    this.p = { speed: 200, shapeChangePeriod: 2, lineWidth: 8, ...this.p };
    const levels = [];
    for (let c = 0; c < this.c.shapes; c++) {
      levels.push(0);
    }
    this.p.levels = levels;
  }

  async setup(folderPath) {
    this.shapes = [];

    for (let c = 0; c < 10; c++) {
      this.generateShape();
    }

    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  generateShape() {
    const shapes = [Line, Triangle, Circle, Rectangle];
    const shapeClass = rndArrayItem(shapes);
    this.shapes.push(new shapeClass(this));
  }

  renderFrame(timestamp, dTimestamp) {
    const ctx = this.canvas.getContext("2d");
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let c = 0; c < this.shapes.length; c++) {
      const shape = this.shapes[c];
      shape.drawShape(ctx, this.p.levels[c]);
      shape.updateShape(dTimestamp);
    }

    if (this.lastChangeTimestamp === undefined) {
      this.lastChangeTimestamp = timestamp;
    }
    if (timestamp - this.lastChangeTimestamp >= this.p.shapeChangePeriod) {
      this.lastChangeTimestamp = timestamp;
      this.shapes.shift();
      this.generateShape();
    }

  }
}

export default SongInLines;