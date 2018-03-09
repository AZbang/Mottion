precision mediump float;

varying vec2 vTextureCoord;
uniform float rotation;
uniform sampler2D uSampler;

void main() {
  vec2 uv = vTextureCoord.xy;
  float rot = radians(rotation);
  uv-=.5;
  mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
  uv  = m * uv;
  uv+=.5;

  gl_FragColor = texture2D(uSampler, uv);
}
