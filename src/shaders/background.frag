#version 300 es

precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

// Simplex noise function
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,  // (3.0-sqrt(3.0))/6.0
    0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
    -0.577350269189626, // -1.0 + 2.0 * C.x
    0.024390243902439   // 1.0 / 41.0
  );

  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Fractal brownian motion
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;

  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }

  return value;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;

  // Slow time for subtle animation
  float time = u_time * 0.05;

  // Create flowing noise pattern
  vec2 q = vec2(
    fbm(uv + vec2(0.0, 0.0) + time * 0.1),
    fbm(uv + vec2(5.2, 1.3) + time * 0.15)
  );

  vec2 r = vec2(
    fbm(uv + 4.0 * q + vec2(1.7, 9.2) + time * 0.05),
    fbm(uv + 4.0 * q + vec2(8.3, 2.8) + time * 0.08)
  );

  float f = fbm(uv + 4.0 * r);

  // Color palette - dark blue/purple tones matching the site theme
  vec3 bgColor = vec3(0.094, 0.098, 0.145); // hsl(240, 10%, 15%) approximately
  vec3 accent1 = vec3(0.15, 0.12, 0.2);     // Deep purple
  vec3 accent2 = vec3(0.1, 0.15, 0.2);      // Deep blue
  vec3 highlight = vec3(0.2, 0.18, 0.25);   // Lighter purple

  // Mix colors based on noise
  vec3 color = bgColor;
  color = mix(color, accent1, clamp(f * 0.5, 0.0, 1.0));
  color = mix(color, accent2, clamp(length(q) * 0.3, 0.0, 1.0));
  color = mix(color, highlight, clamp(pow(length(r), 2.0) * 0.15, 0.0, 1.0));

  // Subtle vignette
  vec2 center = v_uv - 0.5;
  float vignette = 1.0 - dot(center, center) * 0.5;
  color *= vignette;

  fragColor = vec4(color, 1.0);
}
