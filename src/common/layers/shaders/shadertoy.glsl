#version 300 es

in vec2 aVertexPosition;
out vec2 fragCoord;

void main(void) {
  fragCoord = aVertexPosition;
  gl_Position = vec4(aVertexPosition, 0, 1);
}
