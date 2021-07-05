precision mediump float;
varying vec2 vTextureCoord;

#define BALLS_COUNT 100

uniform float balls[BALLS_COUNT * 3];
uniform float ballScale;
uniform vec4 ballColor;
uniform float aspect;

void main(void) {
  vec2 point = vec2(vTextureCoord.x, vTextureCoord.y / aspect);

  float power = 0.;
  for (int i = 0; i < BALLS_COUNT; i++) {
    vec2 ball = vec2(balls[i * 3], balls[i * 3 + 1]);
    float d = distance(point, ball);
    power += balls[i * 3 + 2] * ballScale / d;
  }
  power = clamp(power, 0., 1.);

  //gl_FragColor = vec4(ballColor.x * power, ballColor.y * power, ballColor.z * power, 1.);
  gl_FragColor = ballColor * power;
}
