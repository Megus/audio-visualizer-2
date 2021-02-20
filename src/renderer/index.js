import { ipcRenderer } from 'electron';

import config from '../common/config';

// Create main canvas
const mainCanvas = document.createElement("canvas");
mainCanvas.width = config.width;
mainCanvas.height = config.height;
mainCanvas.style.width = `${config.width / 2}px`;
mainCanvas.style.height = `${config.height / 2}px`;

// Initialize HTML structure
document.body.style.margin = "0px";
document.body.appendChild(mainCanvas);

// Create project
const project = new config.projectClass(config, mainCanvas);

// Animation
let frameNumber = 0;
let oldTimestamp = 0;

function animate(timestampMs) {
  const timestamp = config.renderVideo ? (frameNumber / config.fps) : (timestampMs / 1000);
  const dTimestamp = timestamp - oldTimestamp;

  project.renderFrame(timestamp, dTimestamp);

  frameNumber++;
  oldTimestamp = timestamp;

  if (config.renderVideo) {
    const png = mainCanvas.toDataURL();
    ipcRenderer.sendSync("frame-msg", png);
  }

  requestAnimationFrame(animate);
}

animate(0);