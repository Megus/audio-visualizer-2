import * as fs from "fs";

import * as utils from "../utils";
import Layer from "./Layer";

class MetaBalls extends Layer {
  constructor(canvas, c, p) {
    super(canvas, c, p);

    this.c = { ballsCount: 50 };
    this.p = { blockSize: 10, ballScale: 80, speedScale: 0.1, color: [90, 170, 200, 255], ...this.p };
  }

  async setup(folderPath) {
    this.balls = [];
    this.p.ballSizes = [];

    for (let c = 0; c < this.c.ballsCount; c++) {
      this.balls.push([Math.random(), Math.random(), Math.random() - 0.5, Math.random() - 0.5]);
      this.p.ballSizes.push(0);
    }

    // WebGL setup
    const gl = this.canvas.getContext("webgl2");
    this.gl = gl;
    gl.viewportWidth = this.canvas.width;
    gl.viewportHeight = this.canvas.height;

    // Load shaders
    const shaderText = fs.readFileSync(`${__dirname}/shaders/metaballs.glsl`, "utf-8");
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
    let mLocation = gl.getUniformLocation(this.shaderProgram, "ballScale");
    gl.uniform1f(mLocation, this.p.ballScale);
    mLocation = gl.getUniformLocation(this.shaderProgram, "aspect");
    gl.uniform1f(mLocation, this.p.size[0] / this.p.size[1]);
    mLocation = gl.getUniformLocation(this.shaderProgram, "ballColor");
    gl.uniform4f(mLocation, this.p.color[0] / 255, this.p.color[1] / 255, this.p.color[2] / 255, 1);
    mLocation = gl.getUniformLocation(this.shaderProgram, "balls");
    const b = [];
    for (let i = 0; i < this.balls.length; i++) {
      b.push(this.balls[i][0], this.balls[i][1], this.p.ballSizes[i])
    }
    for (let i = this.balls.length; i < 100; i++) {
      b.push(2, 2, 0);
    }
    gl.uniform1fv(mLocation, b);

    const texLocation = gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(texLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.vertexAttribPointer(texLocation, 2, gl.FLOAT, false, 0, 0);

    const positionLocation = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Render!
    gl.drawArrays(gl.TRIANGLES, 0, 6);


    // Move balls
    for (let i = 0; i < this.balls.length; i++) {
      const b = this.balls[i];

      b[0] += b[2] * dTimestamp * this.p.speedScale;
      b[1] += b[3] * dTimestamp * this.p.speedScale;

      if (b[0] < 0 || b[0] > 1) b[2] *= -(Math.random() * 0.2 + 0.9);
      if (b[1] < 0 || b[1] > 1) b[3] *= -(Math.random() * 0.2 + 0.9);
    }
  }
}

export default MetaBalls;