class Project {
  constructor(config, canvas) {
    this.config = config;
    this.canvas = canvas;
    this.audioPath = null;
  }

  async setup() {}

  relativeFolder(dirname) {
    const dirs = dirname.split("/");
    let folder = "";
    let found = false;

    for (let c = 0; c < dirs.length; c++) {
      if (found === true) {
        folder += dirs[c] + "/";
      }
      if (dirs[c] === "projects") {
        found = true;
      }
    }

    return folder;
  }

  renderFrame(timestamp, dTimestamp) {}
}

export default Project;
