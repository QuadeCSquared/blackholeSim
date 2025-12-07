export default `
  varying vec2 vUv;
  uniform sampler2D uSpaceTexture;
  uniform vec2 uResolution;
  #define MAX_ITERATIONS 200
  #define STEP_SIZE 0.06

  vec3 camPos = vec3(0, 0, -10);
  vec3 blackholePos = vec3(0, 0, 1);

  

  vec4 raytrace(vec3 rayDir, vec3 rayPos) {
    vec4 color = vec4(0.0);
    float h2 = pow(length(cross(rayPos, rayDir)), 2.0);

    const float EVENT_HORIZON = 1.3;
    const float FAR_CLIP = 200.0;
    float minDist = 1e9;

    for (int i = 0; i < MAX_ITERATIONS; i++) {
      vec3 rel = rayPos - blackholePos;
      float baseStep = STEP_SIZE;
      float dist = length(rel);
      minDist = min(minDist, dist);

      if (dist < EVENT_HORIZON) {
        // swallowed by the black hole
        return vec4(0.0, 0.0, 0.0, 1.0);
      }
      if (dist > FAR_CLIP) {
        break;
      }

      // Modify step size, larger steps away from the blackhole, smaller steps when closer to it
      float localStep = baseStep * clamp(dist * 0.2, 0.1, 4.0);
      rayDir += -1.5 * h2 * rel / pow(pow(dist, 2.0), 2.5) * localStep;
      rayPos += rayDir * localStep;
    }

    // Normalize final direction
    vec3 dir = normalize(rayDir);

    // Spherical coordinates to equirectangular UV
    float PI = 3.141592653589793;
    float theta = atan(dir.z, dir.x);     // -PI .. PI
    float phi   = acos(clamp(dir.y, -1.0, 1.0)); // 0 .. PI

    float u = theta / (2.0 * PI) + 0.5;   // 0 .. 1
    float v = phi / PI;                   // 0 .. 1

    vec2 uv = vec2(u, v);

    

    color = texture2D(uSpaceTexture, uv);
    return color;
  }
  
  void main() {
    vec2 modUv = (vUv - 0.5) * 2.0 * vec2(uResolution.x / uResolution.y, 1);
    vec3 rayDir = normalize(vec3(modUv, 1));
    vec3 rayPos = camPos;
    gl_FragColor = raytrace(rayDir, rayPos);
  }
`;



