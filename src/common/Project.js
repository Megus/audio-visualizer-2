class Project {
  constructor(config, canvas) {
    this.config = config;
    this.canvas = canvas;
    this.audioPath = null;
  }

  async setup() {}

  renderFrame(timestamp, dTimestamp) {}
}

export default Project;
