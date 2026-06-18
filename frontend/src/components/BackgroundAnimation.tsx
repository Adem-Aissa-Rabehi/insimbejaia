import React, { useEffect, useRef } from 'react';

const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      // Fallback to 2D Canvas if WebGL is not supported
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      let animationFrame: number;
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      const drawFallback = () => {
        ctx.clearRect(0, 0, width, height);
        // Draw simple slow moving color gradients for 3D look
        const gradient = ctx.createRadialGradient(
          width / 2 + Math.sin(Date.now() * 0.0005) * 200,
          height / 2 + Math.cos(Date.now() * 0.0003) * 200,
          50,
          width / 2,
          height / 2,
          width
        );
        gradient.addColorStop(0, 'rgba(42, 170, 225, 0.05)'); // Light blue
        gradient.addColorStop(0.5, 'rgba(19, 75, 126, 0.02)'); // Deep blue
        gradient.addColorStop(1, 'rgba(248, 250, 252, 0)'); // Bg color
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        animationFrame = requestAnimationFrame(drawFallback);
      };
      drawFallback();
      return () => cancelAnimationFrame(animationFrame);
    }

    // WebGL Shaders for high-performance interactive 3D waves background
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      // 3D-like sin/cos grid wave shader
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        
        // Mouse influence
        float mouseDist = length(p - u_mouse);
        float mouseAtt = smoothstep(0.8, 0.0, mouseDist) * 0.15;
        
        // 3D Wave computation
        float z = sin(p.x * 4.0 + u_time * 0.5) * cos(p.y * 4.0 + u_time * 0.4);
        z += sin(p.x * 8.0 - u_time * 0.8) * cos(p.y * 6.0 + u_time * 0.6) * 0.5;
        z = z * 0.4 + mouseAtt;
        
        // Grid pattern
        float gridX = abs(sin(p.x * 25.0 + z * 10.0));
        float gridY = abs(sin(p.y * 25.0 + z * 10.0));
        float grid = smoothstep(0.97, 0.99, max(gridX, gridY));
        
        // Dynamic grid colors matching the brand (Inverted to white/cyan for visibility in dark blue sections)
        vec3 primaryColor = vec3(1.0, 1.0, 1.0);       // White
        vec3 cyanColor = vec3(0.164, 0.666, 0.882);    // Cyan (#2aaae1)
        vec3 mixedColor = mix(primaryColor, cyanColor, sin(u_time * 0.25) * 0.5 + 0.5);
        
        // Background glow
        vec3 waveColor = mixedColor * (0.04 + 0.12 * (z + 0.5)) + mixedColor * grid * 0.35;
        
        // Blend with transparent alpha
        gl_FragColor = vec4(waveColor, 0.08 + grid * 0.14);
      }
    `;

    // Compile helper
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
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
    };

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Set geometry (full-screen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Get uniforms
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    gl.viewport(0, 0, width, height);

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      gl.viewport(0, 0, width, height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse to -1.0 to 1.0 range
      const ratio = min(width, height);
      mouse.targetX = ((e.clientX * 2.0) - width) / ratio;
      mouse.targetY = -( ((e.clientY * 2.0) - height) / ratio );
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const min = (a: number, b: number) => (a < b ? a : b);

    let animationFrame: number;
    const startTime = Date.now();

    const render = () => {
      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const elapsed = (Date.now() - startTime) / 1000;

      gl.uniform2f(resolutionLoc, width, height);
      gl.uniform1f(timeLoc, elapsed);
      gl.uniform2f(mouseLoc, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default BackgroundAnimation;
