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

export function initBackground(canvas: HTMLCanvasElement): void {
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    console.warn('WebGL2 not supported');
    return;
  }

  // Create shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) {
    console.error('Failed to create shaders');
    return;
  }

  // Create program
  const program = createProgram(gl, vertexShader, fragmentShader);
  if (!program) {
    console.error('Failed to create program');
    return;
  }

  // Get attribute and uniform locations
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const timeLocation = gl.getUniformLocation(program, 'u_time');
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

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

  function render() {
    resize();

    const time = (performance.now() - startTime) / 1000;

    gl?.useProgram(program);
    gl?.bindVertexArray(vao);

    gl?.uniform1f(timeLocation, time);
    gl?.uniform2f(resolutionLocation, canvas.width, canvas.height);

    gl?.drawArrays(gl.TRIANGLES, 0, 6);

    animationId = window.requestAnimationFrame(render);
  }

  // Start rendering
  render();

  // Handle visibility change to pause when hidden
  let pausedElapsed = 0;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
      pausedElapsed = performance.now() - startTime;
    } else {
      startTime = performance.now() - pausedElapsed;
      render();
    }
  });
}
