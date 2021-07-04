import GroupLayer from "./layers/GroupLayer";

class LayerSystem {
  constructor(canvas, folderPath) {
    this.canvas = canvas;
    this.folderPath = folderPath;
    this.layers = [];
    this.layersMap = {};
    this.groupLayer = new GroupLayer(this.canvas);
  }

  async buildLayers(layersInfo) {
    this.layers = await this.buildLayersArray(layersInfo);
    this.groupLayer.children = this.layers;
  }

  async buildLayersArray(layersInfo) {
    const layers = [];
    for (let i = 0; i < layersInfo.length; i++) {
      const l = layersInfo[i];
      const layerCanvas = new OffscreenCanvas(this.canvas.width, this.canvas.height);
      const layer = new l.layer(layerCanvas, l.c, l.p);
      if (l.id !== undefined) {
        this.layersMap[l.id] = layer;
      }

      let boundUpdate = null;
      if (l.update !== undefined) {
        boundUpdate = l.update.bind(layer);
      }
      const boundRenderFrame = layer.renderFrame.bind(layer);

      layer.renderFrame = function(timestamp, dTimestamp) {
        if (boundUpdate !== null) boundUpdate(timestamp, dTimestamp);
        if (this.p.on === true) {
          boundRenderFrame(timestamp, dTimestamp);
        }
      }.bind(layer);

      if (l.children != null) {
        layer.children = await this.buildLayersArray(l.children);
      }

      await layer.setup(this.folderPath);
      layers.push(layer);
    }
    return layers;
  }

  renderFrame(timestamp, dTimestamp) {
    this.groupLayer.renderFrame(timestamp, dTimestamp);
  }
}

export default LayerSystem;