import * as fs from "fs";

import { Layer } from "../../common/layers";
import ScriptSystem from "../../common/ScriptSystem";

class TrackTitle extends Layer {
  constructor(canvas, c, p) {
    super(canvas, c, p);
  }

  async setup(folderPath) {
    this.scriptSystem = new ScriptSystem();

    // Load font
    const fontPath = `${__dirname}/RobotoCondensed-Bold.ttf`;
    const fontBuffer = fs.readFileSync(fontPath);
    const font = new FontFace("title", fontBuffer);
    await font.load();
    document.fonts.add(font);

    // Setup coords
    this.textPos = [-1, 0];
    this.barPos = [-1, 0];

    this.scriptSystem.addScript(this.mainScript.bind(this));
  }

  * mainScript() {
    const s = this.scriptSystem;
    yield* s.wait(2);
    s.animate(this, "barPos", s.easing.easeOutElastic, 5, [0, 0]);
    yield* s.wait(0.1);
    s.animate(this, "textPos", s.easing.easeOutElastic, 5, [0, 0]);
    yield* s.wait(8);
    s.animate(this, "barPos", s.easing.easeInElastic, 4, [-1, 0]);
    yield* s.wait(0.1);
    s.animate(this, "textPos", s.easing.easeInElastic, 4, [-1, 0]);
  }

  renderFrame(timestamp, dTimestamp) {
    this.scriptSystem.update(timestamp, dTimestamp);

    const ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = "rgba(50,100,160,1)";
    const barX = this.barPos[0] * 500 - 100;
    const barY = this.barPos[1] + 28;
    ctx.beginPath();
    ctx.moveTo(barX, barY);
    ctx.lineTo(barX + 500 + 64, barY);
    ctx.lineTo(barX + 500, barY + 64);
    ctx.lineTo(barX, barY + 64);
    ctx.closePath();
    ctx.fill();


    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = "64px title";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.direction = "ltr";

    const textX = this.textPos[0] * 500 + 50;
    const textY = this.textPos[1];

    ctx.fillText(this.c.title, textX, textY, this.canvas.width);
    ctx.strokeText(this.c.title, textX, textY, this.canvas.width);

  }
}

export default TrackTitle;