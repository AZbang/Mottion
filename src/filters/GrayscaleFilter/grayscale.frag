precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float x;
uniform float y;
uniform float r;

void main() {
  gl_FragColor = texture2D(uSampler, vTextureCoord);
  vec3 gray = vec3(0.3, 0.59, 0.11);
  float col = dot(gl_FragColor.xyz, gray);

  float dist = distance(vTextureCoord.xy, vec2(x, y));
  gl_FragColor.xyz = mix(gl_FragColor.xyz, vec3(col), min(dist/r, 1.0)-.2);
}
