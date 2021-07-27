import { timeStamp } from "console";
import * as fs from "fs";

import * as utils from "../utils";
import Layer from "./Layer";

class ShadertoyLayer extends Layer {
  constructor(canvas, c, p) {
    super(canvas, c, p);
  }

  async setup(folderPath) {
    // Get WebGL context
    const gl = this.canvas.getContext("webgl2");
    this.gl = gl;
    gl.viewportWidth = this.canvas.width;
    gl.viewportHeight = this.canvas.height;

    // Load shaders
    const shaderText = fs.readFileSync(`${__dirname}/shaders/shadertoy_frag_prefix.glsl`, "utf-8") +
      fs.readFileSync(`${folderPath}/${this.c.shader}`, "utf-8") +
      fs.readFileSync(`${__dirname}/shaders/shadertoy_frag_suffix.glsl`, "utf-8");
    const fragmentShader = utils.compileFragmentShader(gl, shaderText);

    const vertexShaderText = fs.readFileSync(`${__dirname}/shaders/shadertoy.glsl`, "utf-8");
    const vertexShader = utils.compileVertexShader(gl, vertexShaderText);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.log("Could not initialise shaders");
      console.log(gl.getProgramInfoLog(shaderProgram));
    }
    gl.useProgram(shaderProgram);
    this.shaderProgram = shaderProgram;

    // 2 triangles to fill the whole canvas
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0]),
      gl.STATIC_DRAW
    );
    this.vertexBuffer = vertexBuffer;

    // Create texture map
    const textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0]),
    gl.STATIC_DRAW);
    this.textureBuffer = textureBuffer;
  }

  renderFrame(timestamp, dTimestamp) {
    const gl = this.gl;
    // Clear the viewport
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set uniforms and attributes
    let mLocation = gl.getUniformLocation(this.shaderProgram, "iTime");
    gl.uniform1f(mLocation, timestamp);
    mLocation = gl.getUniformLocation(this.shaderProgram, "iResolution");
    this.gl.uniform2f(mLocation, this.canvas.width, this.canvas.height);
    mLocation = gl.getUniformLocation(this.shaderProgram, "iFrame");
    this.gl.uniform1f(mLocation, timeStamp * 60);
    mLocation = gl.getUniformLocation(this.shaderProgram, "iMouse");
    this.gl.uniform4f(mLocation, 0, 0, 0, 0);

    const positionLocation = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Render!
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

export default ShadertoyLayer;