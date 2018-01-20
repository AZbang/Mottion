precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float blurRadius;

vec2 random(vec2 p) {
	p = fract(p * vec2(443.897, 441.423));
    p += dot(p, p.yx+19.91);
    return fract((p.xx+p.yx)*p.xy);
}

void main() {
  vec2 r = random(vTextureCoord);
  r.x *= 6.28305308;
  vec2 cr = vec2(sin(r.x),cos(r.x))*sqrt(r.y);

	gl_FragColor = texture2D(uSampler, vTextureCoord+cr*blurRadius);
}
