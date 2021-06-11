import * as L from "../../../common/layers";

const layers = [
  {
    layer: L.ShadertoyLayer,
    c: {
      shader: "primitives.glsl",
    },
  },
  {
    layer: L.FilterLayer,
    c: {
      shader: "adjustColor.glsl",
      updateParameters: (gl, shaderProgram, p) => {
        const mLocation = gl.getUniformLocation(shaderProgram, "m");
        gl.uniform1fv(mLocation, [0.1,0.5,0,0,0, 0,0.5,0,0,0, 0,0,1,0,0, 0,0,0,1,0]);
      },
    },
    p: {

    },
    children: [
      {
        layer: L.AnimationLayer,
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
  },
];

export default layers;