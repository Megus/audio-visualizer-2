import { ipcMain, app } from 'electron';
import { spawn } from 'child_process';

class VideoRenderer {
  constructor(config) {
    this.config = config;
    this.frameNumber = 0;
    this.framesTotal = config.fps * config.duration;
  }

  start() {
    this.encoder = spawn(
      "ffmpeg",
      ["-y", "-f", "image2pipe", "-r", `${this.config.fps}`, "-i", "-", "-vcodec", "mpeg4", "-r", `${this.config.fps}`, "video.mp4"],
      {stdio: ['pipe', process.stdout, process.stderr]}
    );

    this.encoder.on("exit", (code, signal) => {
      console.log(`FFMPEG exited with code ${code}`);
      app.quit();
    });

    ipcMain.on("frame-msg", (event, dataURL) => {
      if (this.frameNumber < this.framesTotal) {
        const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        this.encoder.stdin.write(buffer);

        this.frameNumber++;
      } else if (this.frameNumber == this.framesTotal) {
        this.encoder.stdin.end();
      }

      event.returnValue = "ok";
    });
  }
}

export default VideoRenderer;
