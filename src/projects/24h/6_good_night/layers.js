import * as L from "../../../common/layers";
import MegusLogo from "../MegusLogo";
import TrackTitle from "../TrackTitle";

const layers = [
  {
    layer: L.MetaBalls,
    id: "metaballs",
    c: {
      ballsCount: 12*6,
    },
    p: {
      blockSize: 15,
      ballScale: 0.01,
    }
  },
  {
    layer: MegusLogo,
    id: "megus",
  },
  {
    layer: TrackTitle,
    c: {
      title: "Good Night",
    },
    p: {
      pos: [0, 900],
    }
  }
  /*{
    layer: L.FilterLayer,
    id: "filter",
    c: {
      shader: "adjustColor.glsl",
      updateParameters: (gl, shaderProgram, p) => {
        const mLocation = gl.getUniformLocation(shaderProgram, "m");
        gl.uniform1fv(mLocation, [0.1,0.5,0,0,0, 0,0.5,0,0,0, 0,0,1,0,0, 0,0,0,1,0]);
      },
    },
    children: [
      {
        layer: L.AnimationLayer,
        id: "jake",
        c: {
          pattern: "jake/frame_%%_delay-0.08s.png",
          range: [0, 17]
        },
        p: {
          pos: [0, 0],
          size: [500, 500],
          fps: 30,
        },
      },
    ]
  },*/
];

export default layers;