import { ipcRenderer } from 'electron';

import config from '../main/config';

// Create main canvas
const mainCanvas = document.createElement("canvas");
mainCanvas.width = config.width;
mainCanvas.height = config.height;
mainCanvas.style.width = `${config.width / 2}px`;
mainCanvas.style.height = `${config.height / 2}px`;

// Create project
const project = new config.projectClass(config, mainCanvas);

ipcRenderer.sendSync("audio-path", project.audioPath);

// Create audio
const audio = document.createElement("audio");
audio.src = project.audioUrl;
audio.loop = true;

if (config.muteAudio) {
  audio.volume = 0;
} else {
  audio.volume = 1;
}

// Initialize HTML structure
document.body.style.margin = "0px";
document.body.appendChild(mainCanvas);
document.body.appendChild(audio);

// Animation
let frameNumber = 0;
let oldTimestamp = 0;

function animate(timestampMs) {
  const timestamp = config.renderVideo ? (frameNumber / config.fps) : (audio.currentTime);
  const dTimestamp = timestamp - oldTimestamp;

  project.renderFrame(timestamp, dTimestamp);

  frameNumber++;
  oldTimestamp = timestamp;

  if (config.renderVideo) {
    const png = mainCanvas.toDataURL("image/jpeg", 1);
    ipcRenderer.sendSync("frame-msg", png);
  }

  requestAnimationFrame(animate);
}

project.setup().then(() => {
  audio.play();
  animate(0);
});