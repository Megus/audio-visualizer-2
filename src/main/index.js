import { app, BrowserWindow } from "electron";

import config from "../common/config";
import VideoRenderer from "./VideoRenderer";

if (module.hot) {
  module.hot.accept();
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;
let videoRenderer;

function createMainWindow() {
  if (config.renderVideo == true) {
    videoRenderer = new VideoRenderer(config);
    videoRenderer.start();
  }

  const window = new BrowserWindow({
    width: config.width / 2,
    height: config.height / 2,
    webPreferences: {
      nodeIntegration: true
    }
  });

  window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);

  window.on("closed", () => {
    mainWindow = null;
  });

  return window;
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
  app.quit();
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  mainWindow = createMainWindow();
});
