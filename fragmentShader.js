export default `
  varying vec2 vUv;
  uniform sampler2D uSpaceTexture;
  uniform vec2 uResolution;
  uniform float uTime;
  #define MAX_ITERATIONS 500
  #define STEP_SIZE 0.05
  #define PI 3.1415926535897932384626433832795
  #define TAU 6.283185307179586476925286766559

  vec3 camPos = vec3(0, 2, -10);
  vec3 blackholePos = vec3(0, 0, 1);
  const float innerDiskRadius = 2.0;
  const float outerDiskRadius = 5.0;
  const float diskTwist = 10.0;
  const float flowRate = 0.6;

  float hash(float n) { 
        return fract(sin(n) * 753.5453123);
  }

  float noise(vec3 x) {
        vec3 p = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        float n = p.x + p.y * 157.0 + 113.0 * p.z;

        return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
            mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y),
            mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
            mix(hash(n + 270.0), hash(n + 271.0), f.x), f.y), f.z);
  }

  // https://iquilezles.org/articles/fbm/
  float fbm(vec3 pos, const int numOctaves, const float iterScale, const float detail, const float weight) {
        float mul = weight;
        float add = 1.0 - 0.5 * mul;
        float t = noise(pos) * mul + add;

        for (int i = 1; i < numOctaves; ++i) {
            pos *= iterScale;
            mul = exp2(log2(weight) - float(i) / detail);
            add = 1.0 - 0.5 * mul;
            t *= noise(pos) * mul + add;
        }
        
        return t;
  }

  vec4 raytrace(vec3 rayDir, vec3 rayPos) {
    vec4 color = vec4(0.0);
    float h2 = pow(length(cross(rayPos, rayDir)), 2.0);

    const float EVENT_HORIZON = 1.3;
    const float FAR_CLIP = 200.0;

    for (int i = 0; i < MAX_ITERATIONS; i++) {
      vec3 rel = rayPos - blackholePos;
      float dist = length(rel);

      if (dist < EVENT_HORIZON) {
        // swallowed by the black hole
        return vec4(0.0, 0.0, 0.0, 1.0);
      }

      rayDir += -1.5 * h2 * rel / pow(pow(dist, 2.0), 2.5) * STEP_SIZE;
      vec3 steppedRayPos = rayPos + rayDir * STEP_SIZE;
      if (dist > innerDiskRadius && dist < outerDiskRadius && rayPos.y * steppedRayPos.y < pow(STEP_SIZE, 3.0)) {
        float deltaDiskRadius = outerDiskRadius - innerDiskRadius;
        float diskDist = dist - innerDiskRadius;

        vec3 uvw = vec3(
          (atan(steppedRayPos.z, abs(steppedRayPos.x)) / TAU) - (diskTwist / sqrt(dist)), 
          pow(diskDist * noise(vec3(uTime, uTime, uTime)) * 0.3 / deltaDiskRadius, 2.0) + ((flowRate * noise(vec3(uTime, uTime, uTime)) / TAU) / deltaDiskRadius),
          steppedRayPos.y * 0.5 + 0.5
        ) / 2.0;

        float diskDensity = 1.0 - length(steppedRayPos / vec3(outerDiskRadius, 1.0, outerDiskRadius));
        diskDensity *= smoothstep(innerDiskRadius, innerDiskRadius + 1.0, dist);
        float densityVariation = fbm(2.0 * uvw, 5, 2.0, 1.0, 1.0);
        diskDensity *= inversesqrt(dist) * densityVariation;
        float opticalDepth = STEP_SIZE * 50.0 * diskDensity;
        vec3 shiftVector = 0.6 * cross(normalize(steppedRayPos), vec3(0.0, 1.0, 0.0));
        float velocity = dot(rayDir, shiftVector);
        float dopplerShift = sqrt((1.0 - velocity) / (1.0 + velocity));
        float gravitationalShift = sqrt((1.0 - 2.0 / dist) / (1.0 - 2.0 / length(camPos)));
        return vec4(vec3(1) * dopplerShift * gravitationalShift * opticalDepth, 1.0);
      }
      rayPos = steppedRayPos;
    }

    // Normalize final direction
    vec3 dir = normalize(rayDir);

    // Spherical coordinates to equirectangular UV
    float theta = atan(dir.z, dir.x);     // -PI .. PI
    float phi   = acos(clamp(dir.y, -1.0, 1.0)); // 0 .. PI

    float u = theta / (2.0 * PI) + 0.5;   // 0 .. 1
    float v = phi / PI;                   // 0 .. 1

    vec2 uv = vec2(u, v);

    uv.x = fract(uv.x + uTime * 0.005);
    uv.y - fract(uv.y + uTime * 0.01);

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



