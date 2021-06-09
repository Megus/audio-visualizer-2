import * as L from "../../../common/layers";

const layers = [
  {
    layer: L.GroupLayer,
    children: [
      {
        layer: L.ImageLayer,
        c: {
          image: "jake/frame_00_delay-0.08s.png",
        },
        p: {
          pos: [0, 0],
          size: [1000, 800],
        },
      },
    ]
  },

];

export default layers;