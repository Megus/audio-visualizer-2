import * as L from "../../../common/layers";

const layers = [
  {
    layer: L.GroupLayer,
    children: [
      {
        layer: L.AnimationLayer,
        c: {
          pattern: "jake/frame_%%_delay-0.08s.png",
          range: [0, 17]
        },
        p: {
          pos: [0, 0],
          size: [1000, 800],
          fps: 30,
        },
      },
    ]
  },

];

export default layers;