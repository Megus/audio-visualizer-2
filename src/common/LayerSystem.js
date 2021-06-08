import Timeline from "./Timeline";

class LayerSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.layers = [];
  }

  async buildLayers(layersInfo) {
    this.layers = await this.buildLayersArray(layersInfo);
  }

  async buildLayersArray(layersInfo) {
    const layers = [];
    for (let i = 0; i < layersInfo.length; i++) {
      const l = layersInfo[i];
      const layerCanvas = new OffscreenCanvas(this.canvas.width, this.canvas.height);
      const layer = new l.layer(layerCanvas, l.c || {});
      if (l.p !== undefined) {
        layer.p = { ...layer.p, ...l.p };
      }
      if (l.update !== undefined) {
        const boundUpdate = l.update.bind(layer);
        const renderFrame = layer.renderFrame.bind(layer);
        layer.renderFrame = (timestamp, dTimestamp) => {
          boundUpdate(timestamp, dTimestamp);
          renderFrame(timestamp, dTimestamp);
        }
      }

      // TODO: Setup timeline

      if (l.children != null) {
        layer.children = await this.buildLayersArray(l.children);
      }

      await layer.setup();
      layers.push(layer);
    }
    return layers;
  }

  addLayer(layer) {
    this.layers.push(layer);
  }

  removeLayer(layer) {
    // TODO
  }

  renderFrame(timestamp, dTimestamp) {
    const ctx = this.canvas.getContext("2d");
    //ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.layers.forEach((layer) => {
      layer.renderFrame(timestamp, dTimestamp);
      ctx.drawImage(layer.canvas, 0, 0, layer.p.size[0], layer.p.size[1], layer.p.pos[0], layer.p.pos[1], layer.p.size[0], layer.p.size[1]);
    });
  }
}

export default LayerSystem;