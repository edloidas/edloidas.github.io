import fragmentShaderSource from '../shaders/background.frag';
import vertexShaderSource from '../shaders/background.vert';

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
  const timeLocation = gl.getUniformLocation(program, 'u_time');
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
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth * dpr;
    const height = canvas.clientHeight * dpr;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl?.viewport(0, 0, width, height);
    }
  }

  // Animation loop
  let startTime = performance.now();
  let animationId: number;
  let isRunning = true;

  function render() {
    if (!isRunning) return;

    resize();

    // Smooth theme transition
    const themeDiff = targetTheme - currentTheme;
    if (Math.abs(themeDiff) > 0.001) {
      currentTheme += themeDiff * 0.05; // Smooth interpolation
    } else {
      currentTheme = targetTheme;
    }

    // Smooth dimness transition
    const dimnessDiff = targetDimness - currentDimness;
    if (Math.abs(dimnessDiff) > 0.001) {
      currentDimness += dimnessDiff * 0.04; // Slower to avoid chaotic shaking
    } else {
      currentDimness = targetDimness;
    }

    const time = (performance.now() - startTime) / 1000;

    gl?.useProgram(program);
    gl?.bindVertexArray(vao);

    gl?.uniform1f(timeLocation, time);
    gl?.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl?.uniform1f(themeLocation, currentTheme);
    gl?.uniform1f(dimnessLocation, currentDimness);

    gl?.drawArrays(gl.TRIANGLES, 0, 6);

    animationId = window.requestAnimationFrame(render);
  }

  // Start rendering
  render();

  // Handle visibility change to pause when hidden
  let pausedElapsed = 0;

  function handleVisibilityChange() {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
      pausedElapsed = performance.now() - startTime;
    } else if (isRunning) {
      startTime = performance.now() - pausedElapsed;
      render();
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Handle system theme change
  function handleThemeChange(e: MediaQueryListEvent) {
    targetTheme = e.matches ? 1.0 : 0.0;
  }

  darkModeQuery.addEventListener('change', handleThemeChange);

  // Return controller
  return {
    setTheme(isDark: boolean) {
      targetTheme = isDark ? 1.0 : 0.0;
    },
    setMode(mode: BackgroundMode) {
      targetDimness = mode === 'dim' ? 1.0 : 0.0;
    },
    destroy() {
      isRunning = false;
      cancelAnimationFrame(animationId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      darkModeQuery.removeEventListener('change', handleThemeChange);

      // Clean up WebGL resources
      gl?.deleteBuffer(positionBuffer);
      gl?.deleteVertexArray(vao);
      gl?.deleteProgram(program);
      gl?.deleteShader(vertexShader);
      gl?.deleteShader(fragmentShader);
    },
  };
}
