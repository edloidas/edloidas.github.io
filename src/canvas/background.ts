import fragmentShaderSource from '../shaders/background.frag';
import vertexShaderSource from '../shaders/background.vert';

// The background is a soft out-of-focus gradient, so it survives a much smaller
// drawing buffer than the display offers. Fragment cost scales with the product
// of these two, and the shader runs two 3D simplex noise evaluations per pixel.
const MAX_DPR = 1.5;
const RENDER_SCALE = 0.5;

// Movement is slow enough that 30fps is indistinguishable from 60fps here.
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1 / TARGET_FPS;
const FRAME_TOLERANCE = 0.001;

// Guards the phase against long stalls (background tab, sleep) without
// affecting normal frame jitter.
const MAX_FRAME_DELTA = 0.1;

// Continuous decay rates matching the previous per-frame factors at 60fps
// (0.05 and 0.04), so transitions feel the same at any frame rate.
const THEME_DECAY = 3.08;
const DIMNESS_DECAY = 2.45;

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export type BackgroundMode = 'vibrant' | 'dim';

export interface BackgroundController {
  setTheme: (isDark: boolean) => void;
  setMode: (mode: BackgroundMode) => void;
  destroy: () => void;
}

export function initBackground(canvas: HTMLCanvasElement): BackgroundController | null {
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    console.warn('WebGL2 not supported');
    return null;
  }

  // Create shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) {
    console.error('Failed to create shaders');
    return null;
  }

  // Create program
  const program = createProgram(gl, vertexShader, fragmentShader);
  if (!program) {
    console.error('Failed to create program');
    return null;
  }

  // Get attribute and uniform locations
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const phaseLocation = gl.getUniformLocation(program, 'u_phase');
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const themeLocation = gl.getUniformLocation(program, 'u_theme');
  const dimnessLocation = gl.getUniformLocation(program, 'u_dimness');

  // Create fullscreen quad
  const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  // Create VAO
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Theme state (0.0 = light, 1.0 = dark)
  let currentTheme = 0.0;
  let targetTheme = 0.0;

  // Dimness state (0.0 = vibrant, 1.0 = dim)
  let currentDimness = 0.0;
  let targetDimness = 0.0;

  // Detect initial theme from stored preference or system
  const storedTheme = localStorage.getItem('theme-preference');
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

  if (storedTheme === 'dark') {
    targetTheme = 1.0;
  } else if (storedTheme === 'light') {
    targetTheme = 0.0;
  } else {
    // Auto mode - use system preference
    targetTheme = darkModeQuery.matches ? 1.0 : 0.0;
  }
  currentTheme = targetTheme;

  // Resize handler
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const width = Math.round(canvas.clientWidth * dpr * RENDER_SCALE);
    const height = Math.round(canvas.clientHeight * dpr * RENDER_SCALE);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl?.viewport(0, 0, width, height);
    }
  }

  // ? Animation phase is accumulated per frame instead of derived from absolute
  // ? elapsed time. u_dimness scales the animation rate, and scaling absolute
  // ? time rewrites the whole noise history retroactively — after an idle hour
  // ? a view switch would replay minutes of movement in a single transition.

  // Animation loop
  let phase = 0;
  let lastFrameTime = performance.now();
  let animationId: number;
  let isRunning = false;

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function drawFrame() {
    resize();

    gl?.useProgram(program);
    gl?.bindVertexArray(vao);

    gl?.uniform1f(phaseLocation, phase);
    // ? CSS pixels, not the drawing buffer: the shader's ultrawide check uses an
    // ? absolute pixel threshold that must not shift with DPR or RENDER_SCALE.
    gl?.uniform2f(resolutionLocation, canvas.clientWidth, canvas.clientHeight);
    gl?.uniform1f(themeLocation, currentTheme);
    gl?.uniform1f(dimnessLocation, currentDimness);

    gl?.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // Reduced motion keeps the artwork but drops every transition, so state snaps
  // to its target and a single frame is drawn on demand.
  function drawStaticFrame() {
    currentTheme = targetTheme;
    currentDimness = targetDimness;
    drawFrame();
  }

  function render(now: number) {
    if (!isRunning) return;

    animationId = window.requestAnimationFrame(render);

    const elapsed = (now - lastFrameTime) / 1000;
    if (elapsed + FRAME_TOLERANCE < FRAME_INTERVAL) return;

    lastFrameTime = now;
    const delta = Math.min(elapsed, MAX_FRAME_DELTA);

    // Smooth theme transition
    const themeDiff = targetTheme - currentTheme;
    if (Math.abs(themeDiff) > 0.001) {
      currentTheme += themeDiff * (1 - Math.exp(-THEME_DECAY * delta));
    } else {
      currentTheme = targetTheme;
    }

    // Smooth dimness transition
    const dimnessDiff = targetDimness - currentDimness;
    if (Math.abs(dimnessDiff) > 0.001) {
      currentDimness += dimnessDiff * (1 - Math.exp(-DIMNESS_DECAY * delta));
    } else {
      currentDimness = targetDimness;
    }

    // Dimmed views animate at half speed
    phase += delta * (1.0 - currentDimness * 0.5);

    drawFrame();
  }

  function startAnimation() {
    if (isRunning) return;
    isRunning = true;
    lastFrameTime = performance.now();
    animationId = window.requestAnimationFrame(render);
  }

  function stopAnimation() {
    isRunning = false;
    cancelAnimationFrame(animationId);
  }

  function applyMotionPreference() {
    if (reducedMotionQuery.matches) {
      stopAnimation();
      drawStaticFrame();
    } else {
      startAnimation();
    }
  }

  // Start rendering
  applyMotionPreference();

  reducedMotionQuery.addEventListener('change', applyMotionPreference);

  // A resize reallocates the drawing buffer and clears it, so the static frame
  // has to be redrawn; the animation loop repaints on its own.
  function handleResize() {
    if (reducedMotionQuery.matches) drawStaticFrame();
  }

  window.addEventListener('resize', handleResize);

  // Handle visibility change to pause when hidden
  function handleVisibilityChange() {
    if (reducedMotionQuery.matches) return;

    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Handle system theme change (only when in auto mode)
  function handleThemeChange(e: MediaQueryListEvent) {
    const storedTheme = localStorage.getItem('theme-preference');
    // Only react to system changes if in auto mode (or no preference stored)
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      targetTheme = e.matches ? 1.0 : 0.0;
      if (reducedMotionQuery.matches) drawStaticFrame();
    }
  }

  darkModeQuery.addEventListener('change', handleThemeChange);

  // Return controller
  return {
    setTheme(isDark: boolean) {
      targetTheme = isDark ? 1.0 : 0.0;
      if (reducedMotionQuery.matches) drawStaticFrame();
    },
    setMode(mode: BackgroundMode) {
      targetDimness = mode === 'dim' ? 1.0 : 0.0;
      if (reducedMotionQuery.matches) drawStaticFrame();
    },
    destroy() {
      stopAnimation();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      darkModeQuery.removeEventListener('change', handleThemeChange);
      reducedMotionQuery.removeEventListener('change', applyMotionPreference);
      window.removeEventListener('resize', handleResize);

      // Clean up WebGL resources
      gl?.deleteBuffer(positionBuffer);
      gl?.deleteVertexArray(vao);
      gl?.deleteProgram(program);
      gl?.deleteShader(vertexShader);
      gl?.deleteShader(fragmentShader);
    },
  };
}
