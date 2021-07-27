#version 300 es

in vec2 aVertexPosition;
in vec2 aTextureCoord;
out vec2 vTextureCoord;

void main(void) {
  vTextureCoord = aTextureCoord;
  gl_Position = vec4(aVertexPosition, 0, 1);
}
