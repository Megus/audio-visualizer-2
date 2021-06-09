import * as L from "../../common/layers";
import CustomLayer from "./CustomLayer";

const layers = [
  {
    layer: L.GroupLayer,
    children: [
      {
        layer: CustomLayer,
      },
      {
        layer: L.ImageLayer,
        p: {
          pos: [0, 0],
          size: [100, 200],
        },
        timeline: {
          pos: [

          ],
        }
      },
      {
        layer: L.RectLayer,
        p: {
          pos: [300, 30],
          size: [100, 200],
          color: [255,0,255,255],
        },
        update: function(timestamp, dTimestamp) {
          this.p.pos[0] = 100 + 50 * Math.sin(timestamp * 4);
        },
      },
    ]
  },

];

export default layers;