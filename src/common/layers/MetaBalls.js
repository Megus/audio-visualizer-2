import Layer from "./Layer";

class MetaBalls extends Layer {
  constructor(canvas, c, p) {
    super(canvas, c, p);

    this.c = { ballsCount: 50 };
    this.p = { blockSize: 10, ballScale: 80, speedScale: 0.1, color: [90, 170, 200, 255], ...this.p };
  }

  async setup(folderPath) {
    this.balls = [];
    this.p.ballSizes = [];

    for (let c = 0; c < this.c.ballsCount; c++) {
      this.balls.push([Math.random(), Math.random(), Math.random() - 0.5, Math.random() - 0.5]);
      this.p.ballSizes.push(0);
    }
  }

  renderFrame(timestamp, dTimestamp) {
    const cW = this.p.size[0];
    const cH = this.p.size[1];
    const scale = 1.1 * Math.max(cW, cH);

    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, cW, cH);

    let x = 0;
    let y = 0;

    // Draw meta balls
    while (y < cH) {
      while (x < cW) {
        let power = 0;
        const nx = x / scale;
        const ny = y / scale;
        for (let i = 0; i < this.balls.length; i++) {
          const b = this.balls[i];
          let d = (b[0] - nx) * (b[0] - nx) + (b[1] - ny) * (b[1] - ny);
          power += this.p.ballSizes[i] * this.p.ballScale / Math.sqrt(d);
        }

        power = Math.min(power, 1);

        ctx.fillStyle = `rgba(${this.p.color[0]},${this.p.color[1]},${this.p.color[2]},${power})`;
        ctx.fillRect(x, y, this.p.blockSize, this.p.blockSize);

        x += this.p.blockSize;
      }
      x = 0;
      y += this.p.blockSize;
    }

    // Move balls
    for (let i = 0; i < this.balls.length; i++) {
      const b = this.balls[i];

      b[0] += b[2] * dTimestamp * this.p.speedScale;
      b[1] += b[3] * dTimestamp * this.p.speedScale;

      if (b[0] < 0 || b[0] > 1) b[2] *= -(Math.random() * 0.2 + 0.9);
      if (b[1] < 0 || b[1] > 1) b[3] *= -(Math.random() * 0.2 + 0.9);
    }

    // Test overlay
    /*ctx.fillStyle = "rgba(255, 0, 0, 1)"
    for (let i = 0; i < this.balls.length; i++) {
      const v = this.p.ballSizes[i] * 100;
      ctx.fillRect(i * 10, 0, 10, v);
    }*/
  }
}

export default MetaBalls;