#ifdef GL_ES
precision mediump float;
#endif

uniform float pixelSize;

// variables set by filterShader library
varying vec2 pos;
uniform sampler2D filter_background;
uniform vec2 filter_res;


void main() {
  vec2 pixelatedCoord = floor(pos * filter_res / pixelSize) * pixelSize / filter_res;
  vec4 col = texture2D(filter_background, pixelatedCoord);
  gl_FragColor = col;
}
