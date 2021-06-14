import * as fs from "fs";

import * as utils from "../utils";

import Layer from "./Layer";

class FilterLayer extends Layer {
  constructor(canvas, c, p) {
    super(canvas, c, p);

    this.filterCanvas = new OffscreenCanvas(this.canvas.width, this.canvas.height);
  }

  async setup(folderPath) {
    // Get WebGL context
    const gl = this.canvas.getContext("webgl");
    this.gl = gl;
    gl.viewportWidth = this.canvas.width;
    gl.viewportHeight = this.canvas.height;

    // Load shaders
    const shaderText = fs.readFileSync(`${folderPath}/${this.c.shader}`, "utf-8");
    const fragmentShader = utils.compileFragmentShader(gl, shaderText);

    const vertexShaderText = fs.readFileSync(`${__dirname}/shaders/simple_vertex.glsl`, "utf-8");
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
    const ctx = this.filterCanvas.getContext("2d");
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.children.forEach((layer) => {
      layer.renderFrame(timestamp, dTimestamp);
      ctx.drawImage(layer.canvas, 0, 0, layer.p.size[0], layer.p.size[1], layer.p.pos[0], layer.p.pos[1], layer.p.size[0], layer.p.size[1]);
    });

    const gl = this.gl;

    // Clear the viewport
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Update the texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.filterCanvas);

    // Set uniforms and attributes
    this.c.updateParameters(gl, this.shaderProgram, this.p);

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
  }
}

export default FilterLayer;