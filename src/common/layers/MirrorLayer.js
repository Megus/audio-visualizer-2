import * as fs from "fs";

import * as utils from "../utils";
import GroupLayer from "./GroupLayer";

import Layer from "./Layer";

class MirrorLayer extends Layer {
  constructor(canvas, c, p) {
    super(canvas, c, p);

    this.p = { mode: "off", ...this.p };

    this.filterCanvas = new OffscreenCanvas(this.canvas.width, this.canvas.height);
    this.group = new GroupLayer(this.filterCanvas);
  }

  async setup(folderPath) {
    this.group.children = this.children;
    this.group.setup(folderPath);

    // Get WebGL context
    const gl = this.canvas.getContext("webgl2");
    this.gl = gl;
    gl.viewportWidth = this.canvas.width;
    gl.viewportHeight = this.canvas.height;

    // Load shaders
    const shaderText = fs.readFileSync(`${__dirname}/shaders/mirror.glsl`, "utf-8");
    const fragmentShader = utils.compileFragmentShader(gl, shaderText);

    const vertexShaderText = fs.readFileSync(`${__dirname}/shaders/simple_vertex.glsl`, "utf-8");
    const vertexShader = utils.compileVertexShader(gl, vertexShaderText);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
    gl.useProgram(shaderProgram);
    this.shaderProgram = shaderProgram;

    // Create texture from canvas
    const texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.filterCanvas);
    gl.bindTexture(gl.TEXTURE_2D, null);
    this.texture = texture;
  }

  renderFrame(timestamp, dTimestamp) {
    this.group.renderFrame(timestamp, dTimestamp);

    const gl = this.gl;

    // Clear the viewport
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Update the texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.filterCanvas);

    // 2 triangles to fill the whole canvas
    let vertexBuffer;
    let textureBuffer;
    let count;

    // Create buffers based on the mirror mode

    // No mirroring
    if (this.p.mode == "off") {
      vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,  1, -1,  -1, 1,
        -1,  1,  1, -1,  1, 1,
      ]), gl.STATIC_DRAW);

      textureBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0,  1, 0,  0, 1,
        0, 1,  1, 0,  1, 1,
      ]),
      gl.STATIC_DRAW);
      count = 2 * 3;

    // Horizontal mirroring
    } else if (this.p.mode == "h") {
      vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,  0, -1,  -1,  1,
        -1,  1,  0, -1,   0,  1,
         1, -1,  0, -1,   1,  1,
         1,  1,  0, -1,   0,  1
      ]), gl.STATIC_DRAW);

      textureBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0,  .5, 0,  0, 1,
        0, 1,  .5, 0,  .5, 1,
        0, 0,  .5, 0,  0, 1,
        0, 1,  .5, 0,  .5, 1
      ]),
      gl.STATIC_DRAW);
      count = 4 * 3;

    // Vertical mirroring
    } else if (this.p.mode == "v") {
      vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, 0,  1, 0,  -1, 1,
        -1,  1,  1, 0,  1, 1,
        -1, 0,  1, 0,  -1, -1,
        -1,  -1,  1, 0,  1, -1,
      ]), gl.STATIC_DRAW);

      textureBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0.5,  1, 0.5,  0, 1,
        0, 1,  1, .5,  1, 1,
        0, 0.5,  1, 0.5,  0, 1,
        0, 1,  1, 0.5,  1, 1,
      ]),
      gl.STATIC_DRAW);
      count = 4 * 3;

    // Both horizontal and vertical mirroring
    } else if (this.p.mode == "hv") {
      vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, 0,  0, 0,  -1, 1,
        -1,  1,  0, 0,  0, 1,
        1, 0,  0, 0,  1, 1,
        1,  1,  0, 0,  0, 1,
        -1, 0,  0, 0,  -1, -1,
        -1,  -1,  0, 0,  0, -1,
        1, 0,  0, 0,  1, -1,
        1,  -1,  0, 0,  0, -1,
      ]), gl.STATIC_DRAW);

      textureBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, .5,  .5, .5,  0, 1,
        0, 1,  .5, .5,  .5, 1,
        0, .5,  .5, .5,  0, 1,
        0, 1,  .5, .5,  .5, 1,
        0, .5,  .5, .5,  0, 1,
        0, 1,  .5, .5,  .5, 1,
        0, .5,  .5, .5,  0, 1,
        0, 1,  .5, .5,  .5, 1,
      ]),
      gl.STATIC_DRAW);

      count = 8 * 3;
    } else if (this.p.mode == "8") {
      vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, 0,  0, 0,  -1, 1,
        -1,  1,  0, 0,  0, 1,
        1, 0,  0, 0,  1, 1,
        1,  1,  0, 0,  0, 1,
        -1, 0,  0, 0,  -1, -1,
        -1,  -1,  0, 0,  0, -1,
        1, 0,  0, 0,  1, -1,
        1,  -1,  0, 0,  0, -1,
      ]), gl.STATIC_DRAW);

      textureBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, .5,  .5, .5,  0, 1,
        0, 1,   .5, .5,  0, .5,
        0, .5,  .5, .5,  0, 1,
        0, 1,   .5, .5,  0, .5,
        0, .5,  .5, .5,  0, 1,
        0, 1,   .5, .5,  0, .5,
        0, .5,  .5, .5,  0, 1,
        0, 1,   .5, .5,  0, .5,
      ]),
      gl.STATIC_DRAW);

      count = 8 * 3;

    }

    // Set uniforms and attributes
    if (this.c.updateParameters !== undefined) {
      this.c.updateParameters(gl, this.shaderProgram, this.p);
    }

    const texLocation = gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(texLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.vertexAttribPointer(texLocation, 2, gl.FLOAT, false, 0, 0);

    const positionLocation = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const mLocation = gl.getUniformLocation(this.shaderProgram, "iResolution");
    this.gl.uniform2f(mLocation, this.canvas.width, this.canvas.height);

    // Render!
    gl.drawArrays(gl.TRIANGLES, 0, count);
  }
}

export default MirrorLayer;