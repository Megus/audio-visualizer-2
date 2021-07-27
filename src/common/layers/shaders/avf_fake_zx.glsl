#version 300 es

precision mediump float;
in vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 iResolution;
out vec4 fragColor;

#define PIXSIZE 4
#define GAMMA 1.2

float tmap[64] = float[64](
  0.,  32., 8.,  40., 2.,  34., 10., 42.,
  48., 16., 56., 24., 50., 18., 58., 26.,
  12., 44., 4.,  36., 14., 46., 6.,  38.,
  60., 28., 52., 20., 62., 30., 54., 22.,
  3.,  35., 11., 43., 1.,  33., 9.,  41.,
  51., 19., 59., 27., 49., 17., 57., 25.,
  15., 47., 7.,  39., 13., 45., 5.,  37.,
  63., 31., 55., 23., 61., 29., 53., 21.
);

vec3 dither(vec3 inColor, vec2 coord) {
  // Color processing
  vec3 color = pow(inColor, vec3(GAMMA, GAMMA, GAMMA));

  // Dithering
  vec3 ditheredColor = vec3(0., 0., 0.);

  int x = int(floor(coord.x)) / PIXSIZE;
  int y = int(floor(coord.y)) / PIXSIZE;
  float threshold = tmap[(x % 8) * 8 + (y % 8)] / 64.;

  ditheredColor.r = (color.r > threshold) ? 1. : 0.;
  ditheredColor.g = (color.g > threshold) ? 1. : 0.;
  ditheredColor.b = (color.b > threshold) ? 1. : 0.;

  return ditheredColor;
}


void main(void) {
  vec2 delta = 1.0 / iResolution;
  vec2 pixCoord = floor(vTextureCoord * iResolution / float(PIXSIZE)) * float(PIXSIZE) / iResolution;

  vec4 col;
  vec4 avg = vec4(0., 0., 0., 0.);
  for (int i = 0; i < PIXSIZE; i++) {
    for (int j = 0; j < PIXSIZE; j++) {
      vec4 c = texture(uSampler, pixCoord + vec2(float(i) * delta.x, float(j) * delta.y));
      c.rgb *= c.a;
      avg += c;
    }
  }
  col = avg / float(PIXSIZE * PIXSIZE);
  col.a = 1.;

  col.rgb = dither(col.rgb, vTextureCoord * iResolution);

  fragColor = col;
}
