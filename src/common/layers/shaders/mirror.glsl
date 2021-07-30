#version 300 es

precision mediump float;
in vec2 vTextureCoord;
uniform sampler2D uSampler;
out vec4 fragColor;

void main(void) {
  fragColor = texture(uSampler, vTextureCoord);
}
