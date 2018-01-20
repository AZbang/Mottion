precision mediump float;

varying vec2 vTextureCoord;

uniform vec4 filterArea;
uniform float startGradient;
uniform float endGradient;
uniform sampler2D uSampler;

void main() {
  vec4 color = texture2D(uSampler, vTextureCoord);

  if(vTextureCoord.y > startGradient) gl_FragColor = color;
  else if(vTextureCoord.y < endGradient) gl_FragColor = color*0.0;
  else gl_FragColor = color*(vTextureCoord.y-endGradient)/(startGradient-endGradient);
}
