#version 300 es

precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_theme; // 0.0 = light, 1.0 = dark
uniform float u_dimness; // 0.0 = vibrant, 1.0 = dimmed

// ============================================
// Simplex 3D Noise
// ============================================

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  // Permutations
  i = mod289(i);
  vec4 p = permute(
    permute(
      permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)
    ) + i.x + vec4(0.0, i1.x, i2.x, 1.0)
  );

  // Gradients
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  // Normalize gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// ============================================
// Main
// ============================================

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 adjustedUV = vec2(uv.x * aspect, uv.y);

  // Center position for the blob (bottom-right in vibrant, more centered when dim)
  // Ultrawide: aspect > 2.0 AND width > 1920px (avoids mobile landscape)
  bool isUltrawide = aspect > 2.0 && u_resolution.x > 1920.0;
  float clampedAspect = isUltrawide ? 2.0 : aspect;

  vec2 centerLight = vec2(clampedAspect * 0.85, 0.05);
  vec2 centerDark = vec2(clampedAspect * 0.9, 0.1);
  vec2 centerVibrant = mix(centerLight, centerDark, u_theme);
  vec2 centerDim = vec2(aspect * 0.5, 0.5); // Screen center (uses real aspect)
  vec2 center = mix(centerVibrant, centerDim, u_dimness);

  // Noise layers - slow down when dimmed
  float timeScale = mix(1.0, 0.5, u_dimness);
  float slowNoise = snoise(vec3(adjustedUV * 1.6, u_time * 0.15 * timeScale));
  float detailNoise = snoise(vec3(adjustedUV * 3.2, u_time * 0.22 * timeScale + 10.0));
  float combinedNoise = slowNoise * 0.6 + detailNoise * 0.4;

  // Distance from center with noise distortion - reduce distortion when dimmed
  float dist = distance(adjustedUV, center);
  float noiseAmount = mix(0.12, 0.06, u_dimness);
  float distortedDist = dist + combinedNoise * noiseAmount;

  // Masks for main blob and core
  float mainMask = smoothstep(0.65, 0.23, distortedDist);
  float coreMask = smoothstep(0.4, 0.02, distortedDist);

  // ============================================
  // Color Palettes
  // ============================================

  // Light theme: Orange/Peach on white
  vec3 bgLight = vec3(1.0, 1.0, 1.0);
  vec3 deepOrange = vec3(1.0, 0.35, 0.0);
  vec3 softPeach = vec3(1.0, 0.7, 0.45);
  vec3 mutedOrange = vec3(1.0, 0.55, 0.3);

  // Dark theme: Crimson/Scarlet on near-black
  vec3 bgDark = vec3(0.012, 0.012, 0.012);
  vec3 crimson = vec3(0.55, 0.0, 0.05);
  vec3 scarlet = vec3(0.92, 0.08, 0.08);

  // ============================================
  // Color Mixing
  // ============================================

  // Light theme fluid
  vec3 fluidBaseLight = mix(softPeach, mutedOrange, detailNoise * 0.4 + 0.6);
  vec3 compositeFluidLight = mix(fluidBaseLight, deepOrange, coreMask);
  vec3 colorLight = mix(bgLight, compositeFluidLight, mainMask);
  colorLight += (detailNoise * 0.01) * mainMask;

  // Dark theme fluid
  vec3 fluidDark = mix(crimson, scarlet, coreMask + detailNoise * 0.2);
  vec3 colorDark = mix(bgDark, fluidDark, mainMask);
  // Additive glow for dark theme (bloom simulation)
  colorDark += (scarlet * 0.08) * pow(mainMask, 3.0);

  // Mix based on theme
  vec3 vibrantColor = mix(colorLight, colorDark, u_theme);

  // Apply dimness - reduce saturation and move toward background
  vec3 bgColor = mix(bgLight, bgDark, u_theme);
  float dimFactor = u_dimness * 0.7; // Max 70% dim
  vec3 finalColor = mix(vibrantColor, bgColor, dimFactor);

  fragColor = vec4(finalColor, 1.0);
}
