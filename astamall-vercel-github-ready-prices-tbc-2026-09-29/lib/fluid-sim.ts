// A compact stable-fluids solver (advection, vorticity, pressure projection) on WebGL2.
// Dye is rendered as a glossy astaxanthin-red liquid: surface normals come from the dye gradient,
// so the ink reads as a lit, three-dimensional material rather than a flat stain.

type Target = { texture: WebGLTexture; fbo: WebGLFramebuffer; width: number; height: number };
type DoubleTarget = { read: Target; write: Target; swap: () => void; width: number; height: number };
type Program = { program: WebGLProgram; uniforms: Record<string, WebGLUniformLocation | null> };

export type FluidOptions = { simResolution?: number; dyeResolution?: number; pixelRatio?: number };

const vertex = `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv; out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
uniform vec2 texelSize;
void main() {
  vUv = aPosition * .5 + .5;
  vL = vUv - vec2(texelSize.x, 0.); vR = vUv + vec2(texelSize.x, 0.);
  vT = vUv + vec2(0., texelSize.y); vB = vUv - vec2(0., texelSize.y);
  gl_Position = vec4(aPosition, 0., 1.);
}`;

const header = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 fragColor;
`;

const shaders = {
  clear: `${header}uniform sampler2D uTexture; uniform float value;
void main() { fragColor = value * texture(uTexture, vUv); }`,
  splat: `${header}uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
void main() {
  vec2 p = vUv - point; p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  fragColor = vec4(texture(uTarget, vUv).xyz + splat, 1.);
}`,
  advection: `${header}uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  fragColor = texture(uSource, coord) / (1. + dissipation * dt);
}`,
  divergence: `${header}uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x; float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y; float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.) L = -C.x; if (vR.x > 1.) R = -C.x; if (vT.y > 1.) T = -C.y; if (vB.y < 0.) B = -C.y;
  fragColor = vec4(.5 * (R - L + T - B), 0., 0., 1.);
}`,
  curl: `${header}uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y; float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x; float B = texture(uVelocity, vB).x;
  fragColor = vec4(.5 * (R - L - T + B), 0., 0., 1.);
}`,
  vorticity: `${header}uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
void main() {
  float L = texture(uCurl, vL).x; float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x; float B = texture(uCurl, vB).x; float C = texture(uCurl, vUv).x;
  vec2 force = .5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + .0001; force *= curl * C; force.y *= -1.;
  vec2 velocity = texture(uVelocity, vUv).xy + force * dt;
  fragColor = vec4(clamp(velocity, -1000., 1000.), 0., 1.);
}`,
  pressure: `${header}uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x; float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x; float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  fragColor = vec4((L + R + B + T - divergence) * .25, 0., 0., 1.);
}`,
  gradient: `${header}uniform sampler2D uPressure; uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x; float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x; float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  fragColor = vec4(velocity, 0., 1.);
}`,
  // Glossy liquid: the dye height field is lit with a key light, a soft fill and a fresnel rim.
  display: `${header}uniform sampler2D uTexture; uniform vec2 dyeTexel;
void main() {
  float d = min(texture(uTexture, vUv).r, 2.2);
  float l = min(texture(uTexture, vUv - vec2(dyeTexel.x * 3.5, 0.)).r, 2.2);
  float r = min(texture(uTexture, vUv + vec2(dyeTexel.x * 3.5, 0.)).r, 2.2);
  float b = min(texture(uTexture, vUv - vec2(0., dyeTexel.y * 3.5)).r, 2.2);
  float t = min(texture(uTexture, vUv + vec2(0., dyeTexel.y * 3.5)).r, 2.2);
  float alpha = smoothstep(.1, .145, d);
  if (alpha < .002) { fragColor = vec4(0.); return; }
  vec3 n = normalize(vec3((l - r) * 1.5, (b - t) * 1.5, 1.));
  vec3 key = normalize(vec3(-.45, .55, .85));
  vec3 h = normalize(key + vec3(0., 0., 1.));
  float diffuse = clamp(dot(n, key), 0., 1.);
  float spec = pow(max(dot(n, h), 0.), 90.);
  float sheen = pow(max(dot(n, normalize(vec3(.5, -.4, .9))), 0.), 14.) * .18;
  float fresnel = pow(1. - n.z, 1.6);
  vec3 deep = vec3(.25, .02, .06);
  vec3 body = vec3(.62, .05, .12);
  vec3 bright = vec3(.93, .27, .25);
  vec3 color = mix(body * .82, body, smoothstep(.1, .9, d));
  color = mix(deep, color, smoothstep(-.2, .6, n.y + .4));
  color *= .5 + .75 * diffuse;
  color = mix(color, bright, fresnel * .55);
  color += vec3(1., .92, .9) * (spec * 1.1 + sheen);
  fragColor = vec4(color * alpha, alpha);
}`,
};

export class FluidSim {
  private gl: WebGL2RenderingContext;
  private programs: Record<keyof typeof shaders, Program>;
  private velocity!: DoubleTarget;
  private dye!: DoubleTarget;
  private pressure!: DoubleTarget;
  private divergenceTarget!: Target;
  private curlTarget!: Target;
  private buffer: WebGLBuffer;
  private halfFloat: number;
  private formats: { rgba: number; rg: number; r: number; rgFormat: number; rFormat: number };
  private options: Required<FluidOptions>;
  readonly ok: boolean;
  /** Dye decay per second; raise it to clear the surface faster. */
  dyeDissipation = 1.35;

  constructor(private canvas: HTMLCanvasElement, options: FluidOptions = {}) {
    this.options = { simResolution: 128, dyeResolution: 640, pixelRatio: 1.5, ...options };
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false });
    if (!gl || !gl.getExtension('EXT_color_buffer_float')) throw new Error('WebGL2 float render targets are unavailable');
    gl.getExtension('OES_texture_float_linear');
    this.gl = gl;
    this.halfFloat = gl.HALF_FLOAT;
    this.formats = { rgba: gl.RGBA16F, rg: gl.RG16F, r: gl.R16F, rgFormat: gl.RG, rFormat: gl.RED };
    const vs = this.compile(gl.VERTEX_SHADER, vertex);
    this.programs = Object.fromEntries(Object.entries(shaders).map(([name, source]) => [name, this.link(vs, this.compile(gl.FRAGMENT_SHADER, source))])) as Record<keyof typeof shaders, Program>;
    this.buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const index = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    this.resize();
    this.ok = true;
  }

  private compile(type: number, source: string) {
    const gl = this.gl, shader = gl.createShader(type)!;
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile failed');
    return shader;
  }

  private link(vs: WebGLShader, fs: WebGLShader): Program {
    const gl = this.gl, program = gl.createProgram()!;
    gl.attachShader(program, vs); gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, 'aPosition');
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Program link failed');
    const uniforms: Program['uniforms'] = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) { const name = gl.getActiveUniform(program, i)!.name; uniforms[name] = gl.getUniformLocation(program, name); }
    return { program, uniforms };
  }

  private target(width: number, height: number, internal: number, format: number): Target {
    const gl = this.gl;
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, width, height, 0, format, this.halfFloat, null);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    return { texture, fbo, width, height };
  }

  private double(width: number, height: number, internal: number, format: number): DoubleTarget {
    const pair = { read: this.target(width, height, internal, format), write: this.target(width, height, internal, format), width, height,
      swap() { const t = pair.read; pair.read = pair.write; pair.write = t; } };
    return pair;
  }

  private release(target?: Target) {
    if (!target) return;
    this.gl.deleteTexture(target.texture); this.gl.deleteFramebuffer(target.fbo);
  }

  private grid(resolution: number) {
    const aspect = this.canvas.width / Math.max(1, this.canvas.height);
    const min = Math.round(resolution), max = Math.round(resolution * Math.max(aspect, 1 / aspect));
    return aspect > 1 ? { width: max, height: min } : { width: min, height: max };
  }

  resize() {
    const { canvas } = this;
    const ratio = Math.min(window.devicePixelRatio || 1, this.options.pixelRatio);
    const width = Math.max(1, Math.round(canvas.clientWidth * ratio)), height = Math.max(1, Math.round(canvas.clientHeight * ratio));
    if (canvas.width === width && canvas.height === height && this.velocity) return;
    canvas.width = width; canvas.height = height;
    [this.velocity, this.dye, this.pressure].forEach(pair => { if (pair) { this.release(pair.read); this.release(pair.write); } });
    this.release(this.divergenceTarget); this.release(this.curlTarget);
    const sim = this.grid(this.options.simResolution), dye = this.grid(this.options.dyeResolution);
    const f = this.formats;
    this.velocity = this.double(sim.width, sim.height, f.rg, f.rgFormat);
    this.dye = this.double(dye.width, dye.height, f.rgba, this.gl.RGBA);
    this.pressure = this.double(sim.width, sim.height, f.r, f.rFormat);
    this.divergenceTarget = this.target(sim.width, sim.height, f.r, f.rFormat);
    this.curlTarget = this.target(sim.width, sim.height, f.r, f.rFormat);
  }

  private use(name: keyof typeof shaders) {
    const p = this.programs[name];
    this.gl.useProgram(p.program);
    return p.uniforms;
  }

  private blit(target: Target | null) {
    const gl = this.gl;
    if (target) { gl.viewport(0, 0, target.width, target.height); gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); }
    else { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  private bind(unit: number, texture: WebGLTexture) {
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    return unit;
  }

  /** x, y in 0..1 from the top-left; dx, dy in pixels per frame of pointer travel. */
  splat(x: number, y: number, dx: number, dy: number, amount = .8, radius = .012) {
    const gl = this.gl, aspect = this.canvas.width / Math.max(1, this.canvas.height);
    let u = this.use('splat');
    gl.uniform2f(u.texelSize, 1 / this.velocity.width, 1 / this.velocity.height);
    gl.uniform1i(u.uTarget, this.bind(0, this.velocity.read.texture));
    gl.uniform1f(u.aspectRatio, aspect);
    gl.uniform2f(u.point, x, 1 - y);
    gl.uniform3f(u.color, dx, -dy, 0);
    gl.uniform1f(u.radius, radius * (aspect > 1 ? aspect : 1));
    this.blit(this.velocity.write); this.velocity.swap();
    u = this.use('splat');
    gl.uniform2f(u.texelSize, 1 / this.dye.width, 1 / this.dye.height);
    gl.uniform1i(u.uTarget, this.bind(0, this.dye.read.texture));
    gl.uniform1f(u.aspectRatio, aspect);
    gl.uniform2f(u.point, x, 1 - y);
    gl.uniform3f(u.color, amount, amount, amount);
    gl.uniform1f(u.radius, radius * (aspect > 1 ? aspect : 1));
    this.blit(this.dye.write); this.dye.swap();
  }

  /** dt drives motion (capped for stability); decayDt is real elapsed time, so ink clears on time even on slow devices. */
  step(dt: number, decayDt = dt) {
    const gl = this.gl, v = this.velocity, simTexel = [1 / v.width, 1 / v.height] as const;
    gl.disable(gl.BLEND);
    let u = this.use('curl');
    gl.uniform2f(u.texelSize, ...simTexel); gl.uniform1i(u.uVelocity, this.bind(0, v.read.texture));
    this.blit(this.curlTarget);

    u = this.use('vorticity');
    gl.uniform2f(u.texelSize, ...simTexel);
    gl.uniform1i(u.uVelocity, this.bind(0, v.read.texture)); gl.uniform1i(u.uCurl, this.bind(1, this.curlTarget.texture));
    gl.uniform1f(u.curl, 10); gl.uniform1f(u.dt, dt);
    this.blit(v.write); v.swap();

    u = this.use('divergence');
    gl.uniform2f(u.texelSize, ...simTexel); gl.uniform1i(u.uVelocity, this.bind(0, v.read.texture));
    this.blit(this.divergenceTarget);

    u = this.use('clear');
    gl.uniform2f(u.texelSize, ...simTexel); gl.uniform1i(u.uTexture, this.bind(0, this.pressure.read.texture)); gl.uniform1f(u.value, .8);
    this.blit(this.pressure.write); this.pressure.swap();

    u = this.use('pressure');
    gl.uniform2f(u.texelSize, ...simTexel); gl.uniform1i(u.uDivergence, this.bind(0, this.divergenceTarget.texture));
    for (let i = 0; i < 18; i++) { gl.uniform1i(u.uPressure, this.bind(1, this.pressure.read.texture)); this.blit(this.pressure.write); this.pressure.swap(); }

    u = this.use('gradient');
    gl.uniform2f(u.texelSize, ...simTexel);
    gl.uniform1i(u.uPressure, this.bind(0, this.pressure.read.texture)); gl.uniform1i(u.uVelocity, this.bind(1, v.read.texture));
    this.blit(v.write); v.swap();

    u = this.use('advection');
    gl.uniform2f(u.texelSize, ...simTexel);
    gl.uniform1i(u.uVelocity, this.bind(0, v.read.texture)); gl.uniform1i(u.uSource, this.bind(0, v.read.texture));
    gl.uniform1f(u.dt, dt); gl.uniform1f(u.dissipation, .55);
    this.blit(v.write); v.swap();

    gl.uniform1i(u.uVelocity, this.bind(0, v.read.texture)); gl.uniform1i(u.uSource, this.bind(1, this.dye.read.texture));
    gl.uniform1f(u.dissipation, this.dyeDissipation * decayDt / dt);
    this.blit(this.dye.write); this.dye.swap();
  }

  render() {
    const gl = this.gl;
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    const u = this.use('display');
    gl.uniform2f(u.texelSize, 1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight);
    gl.uniform2f(u.dyeTexel, 1 / this.dye.width, 1 / this.dye.height);
    gl.uniform1i(u.uTexture, this.bind(0, this.dye.read.texture));
    this.blit(null);
  }

  dispose() {
    [this.velocity, this.dye, this.pressure].forEach(pair => { this.release(pair.read); this.release(pair.write); });
    this.release(this.divergenceTarget); this.release(this.curlTarget);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
