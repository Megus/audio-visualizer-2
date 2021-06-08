import Layer from "./Layer";

class ImageLayer extends Layer {
  constructor(canvas, constants) {
    super(canvas, constants);
  }

  renderFrame(timestamp, dTimestamp) {
    const ctx = this.canvas.getContext("2d");

    // Set line width
    ctx.strokeStyle = "white";
    ctx.lineWidth = 10;

    // Wall
    ctx.strokeRect(75, 140, 150, 110);

    // Door
    ctx.fillRect(130, 190, 40, 60);

    // Roof
    ctx.beginPath();
    ctx.moveTo(50, 140);
    ctx.lineTo(150, 60);
    ctx.lineTo(250, 140);
    ctx.closePath();
    ctx.stroke();
  }
}

export default ImageLayer;