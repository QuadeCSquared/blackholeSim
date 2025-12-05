export default `
  varying vec2 vUv;
  uniform sampler2D uSpaceTexture;
  uniform vec2 uResolution;
  #define MAX_ITERATIONS 200
  #define STEP_SIZE 0.06

  vec3 camPos = vec3(0, 0, -10);
  vec3 blackholePos = vec3(4, 3, 3);

  vec4 raytrace(vec3 rayDir, vec3 rayPos) {
    vec4 color = vec4(0, 0, 0, 1);
    float h2 = pow(length(cross(rayPos, rayDir)), 2.0);
    for (int i = 0; i < MAX_ITERATIONS; i++) {
      float dist = length(rayPos - blackholePos);
      rayDir += -1.5 * h2 * rayPos / pow(pow(dist, 2.0), 2.5) * STEP_SIZE;
      rayPos += rayDir * STEP_SIZE;
    }
    color = texture2D(uSpaceTexture, rayDir.xy);

    return color;
  }
  
  void main() {
    vec2 modUv = (vUv - 0.5) * 2.0 * vec2(uResolution.x / uResolution.y, 1);
    vec3 rayDir = normalize(vec3(modUv, 1));
    vec3 rayPos = camPos;
    gl_FragColor = raytrace(rayDir, rayPos) * 10.0;
  }
`;