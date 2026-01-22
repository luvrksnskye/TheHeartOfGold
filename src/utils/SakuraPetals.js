/**
 * SakuraPetals - WebGL Particle System
 * The Heart of Gold
 */

class SakuraPetals {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.animating = false;
        this.animationFrame = null;
        this.sceneReady = false;
        this.isPreloaded = false;
        this.isMobile = false;
        this.isSafari = false;
        
        // Time management
        this.timeInfo = {
            start: 0,
            prev: 0,
            delta: 0,
            elapsed: 0
        };
        
        // Render specifications
        this.renderSpec = {
            width: 0,
            height: 0,
            aspect: 1,
            array: new Float32Array(3),
            halfWidth: 0,
            halfHeight: 0,
            halfArray: new Float32Array(3),
            pointSize: { min: 1, max: 256 }
        };
        
        // Projection matrix
        this.projection = {
            angle: 60,
            nearfar: new Float32Array([0.1, 100.0]),
            matrix: new Float32Array(16)
        };
        this.projection.matrix.set([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
        
        // Camera settings
        this.camera = {
            position: { x: 0, y: 0, z: 100 },
            lookat: { x: 0, y: 0, z: 0 },
            up: { x: 0, y: 1, z: 0 },
            dof: { x: 10, y: 4, z: 8, array: new Float32Array(3) },
            matrix: new Float32Array(16)
        };
        this.camera.matrix.set([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
        
        // Point flower system
        this.pointFlower = {
            program: null,
            buffer: null,
            numFlowers: 800,
            particles: [],
            dataArray: null,
            area: { x: 20, y: 20, z: 20 },
            offset: new Float32Array(3),
            fader: { x: 10, y: 20, z: 0.1, array: new Float32Array(3) }
        };
        
        this.effectLib = {};
        this.renderTargets = {};
        this.shaderSources = {};
        
        // Detect browser
        this.detectBrowser();
    }

    /**
     * Detect browser type for specific optimizations
     */
    detectBrowser() {
        const ua = navigator.userAgent;
        this.isSafari = /^((?!chrome|android).)*safari/i.test(ua);
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(ua) || 
                        (navigator.maxTouchPoints > 0 && /Macintosh/.test(ua));
        
        // Reduce particles on mobile for performance
        if (this.isMobile) {
            this.pointFlower.numFlowers = 400;
        }
    }

    /**
     * Get Safari-compatible WebGL context options
     */
    getContextOptions() {
        const options = {
            alpha: true,
            premultipliedAlpha: false,
            antialias: false,
            depth: true,
            stencil: false,
            preserveDrawingBuffer: false,
            powerPreference: this.isMobile ? 'low-power' : 'default',
            failIfMajorPerformanceCaveat: false
        };
        
        // Safari needs explicit settings
        if (this.isSafari) {
            options.preserveDrawingBuffer = true;
        }
        
        return options;
    }

    /**
     * Preload and compile all shaders before initialization
     * Call this during loading screen
     */
    async preload() {
        if (this.isPreloaded) return true;
        
        try {
            // Collect shader sources from DOM
            this.shaderSources = {
                sakura_point_vsh: this.getShaderSource('sakura_point_vsh'),
                sakura_point_fsh: this.getShaderSource('sakura_point_fsh'),
                fx_common_vsh: this.getShaderSource('fx_common_vsh'),
                bg_fsh: this.getShaderSource('bg_fsh'),
                fx_brightbuf_fsh: this.getShaderSource('fx_brightbuf_fsh'),
                fx_dirblur_r4_fsh: this.getShaderSource('fx_dirblur_r4_fsh'),
                pp_final_vsh: this.getShaderSource('pp_final_vsh'),
                pp_final_fsh: this.getShaderSource('pp_final_fsh')
            };
            
            // Verify all shaders loaded
            for (const [name, source] of Object.entries(this.shaderSources)) {
                if (!source) {
                    console.warn(`Shader ${name} not found`);
                    return false;
                }
            }
            
            this.isPreloaded = true;
            return true;
        } catch (error) {
            console.error('Shader preload failed:', error);
            return false;
        }
    }

    /**
     * Get shader source with Safari compatibility fixes
     */
    getShaderSource(id) {
        const element = document.getElementById(id);
        if (!element) return null;
        
        let source = element.textContent;
        
        // Apply Safari compatibility fixes
        source = this.fixShaderForSafari(source, id.includes('fsh'));
        
        return source;
    }

    /**
     * Fix shader source for Safari compatibility
     */
    fixShaderForSafari(source, isFragment) {
        // Ensure proper precision declaration for fragment shaders
        if (isFragment) {
            // Check if precision is already declared
            if (!source.includes('precision')) {
                // Add precision at the start after any #ifdef
                const lines = source.split('\n');
                let insertIndex = 0;
                
                for (let i = 0; i < lines.length; i++) {
                    const trimmed = lines[i].trim();
                    if (trimmed.startsWith('#ifdef') || trimmed.startsWith('#endif') || 
                        trimmed.startsWith('precision') || trimmed === '') {
                        insertIndex = i + 1;
                    } else {
                        break;
                    }
                }
                
                // Ensure highp precision for Safari
                if (!source.includes('precision highp float')) {
                    const precisionLine = '#ifdef GL_ES\nprecision highp float;\n#endif\n';
                    if (!source.includes('#ifdef GL_ES')) {
                        source = precisionLine + source;
                    }
                }
            }
        }
        
        // Safari-specific intensity adjustments to prevent oversaturation
        if (this.isSafari) {
            // Drastically reduce bloom intensity in final composite
            if (source.includes('bloomcol * 0.5')) {
                source = source.replace('bloomcol * 0.5', 'bloomcol * 0.2');
            }
            
            // Reduce source brightness multiplier significantly
            if (source.includes('texture2D(uSrc, texCoord) * 1.2')) {
                source = source.replace('texture2D(uSrc, texCoord) * 1.2', 'texture2D(uSrc, texCoord) * 0.95');
            }
            
            // Make bright buffer much more selective
            if (source.includes('col.rgb * 2.0 - vec3(0.5)')) {
                source = source.replace('col.rgb * 2.0 - vec3(0.5)', 'max(col.rgb * 1.5 - vec3(0.7), vec3(0.0))');
            }
            
            // Significantly reduce specular contribution on petals
            if (source.includes('col * diffuse + specular')) {
                source = source.replace('col * diffuse + specular', 'col * diffuse + specular * 0.5');
            }
            
            // Reduce background white layer
            if (source.includes('gl_FragColor = vec4(1.0, 1.0, 1.0, 0.001)')) {
                source = source.replace('gl_FragColor = vec4(1.0, 1.0, 1.0, 0.001)', 'gl_FragColor = vec4(1.0, 1.0, 1.0, 0.0005)');
            }
        }
        
        // Fix for Safari's stricter GLSL parsing
        // Ensure all float literals have decimal points
        source = source.replace(/\b(\d+)([+\-*\/\s,\)])/g, (match, num, suffix) => {
            // Only add .0 if it's clearly meant to be a float in context
            if (match.includes('.')) return match;
            return match;
        });
        
        return source;
    }

    /**
     * Initialize the particle system
     */
    init(container) {
        if (!container) {
            console.error('SakuraPetals: No container provided');
            return false;
        }

        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'sakura-canvas';
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: transparent;
        `;
        container.appendChild(this.canvas);

        // Get WebGL context with Safari-compatible options
        const contextOptions = this.getContextOptions();
        
        try {
            this.gl = this.canvas.getContext('webgl', contextOptions) ||
                      this.canvas.getContext('experimental-webgl', contextOptions);
        } catch (e) {
            console.error('WebGL context creation failed:', e);
            return false;
        }

        if (!this.gl) {
            console.error('WebGL not supported');
            return false;
        }

        // Enable required extensions for Safari
        this.enableExtensions();

        // Setup
        this.resize();
        
        // Preload if not already done
        if (!this.isPreloaded) {
            this.preload();
        }
        
        // Create scene
        if (!this.createScene()) {
            console.error('Failed to create scene');
            return false;
        }
        
        this.initScene();
        
        // Setup resize handler with debounce
        let resizeTimeout;
        const resizeHandler = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.resize(), 100);
        };
        window.addEventListener('resize', resizeHandler, { passive: true });
        
        // Handle visibility change to pause/resume
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else if (this.sceneReady) {
                this.start();
            }
        });

        // Start animation
        this.timeInfo.start = performance.now();
        this.timeInfo.prev = this.timeInfo.start;
        this.start();

        return true;
    }

    /**
     * Enable WebGL extensions for broader compatibility
     */
    enableExtensions() {
        const gl = this.gl;
        
        // Try to enable useful extensions
        const extensions = [
            'OES_standard_derivatives',
            'OES_texture_float',
            'OES_texture_float_linear',
            'WEBGL_lose_context'
        ];
        
        extensions.forEach(ext => {
            try {
                gl.getExtension(ext);
            } catch (e) {
                // Extension not available, continue
            }
        });
    }

    /**
     * Set render size with power-of-two handling for Safari
     */
    setRenderSize(w, h) {
        this.renderSpec.width = w;
        this.renderSpec.height = h;
        this.renderSpec.aspect = w / h;
        this.renderSpec.array[0] = w;
        this.renderSpec.array[1] = h;
        this.renderSpec.array[2] = this.renderSpec.aspect;
        
        // Use power of 2 for half sizes (better Safari compatibility)
        this.renderSpec.halfWidth = this.nearestPowerOfTwo(Math.floor(w / 2));
        this.renderSpec.halfHeight = this.nearestPowerOfTwo(Math.floor(h / 2));
        this.renderSpec.halfArray[0] = this.renderSpec.halfWidth;
        this.renderSpec.halfArray[1] = this.renderSpec.halfHeight;
        this.renderSpec.halfArray[2] = this.renderSpec.halfWidth / this.renderSpec.halfHeight;
    }

    /**
     * Get nearest power of two (for texture compatibility)
     */
    nearestPowerOfTwo(n) {
        return Math.pow(2, Math.round(Math.log2(n)));
    }

    /**
     * Handle resize
     */
    resize() {
        if (!this.canvas || !this.canvas.parentElement) return;
        
        const rect = this.canvas.parentElement.getBoundingClientRect();
        
        // Limit DPR for performance, especially on Safari
        const maxDPR = this.isSafari ? 1.5 : 2;
        const dpr = Math.min(window.devicePixelRatio || 1, maxDPR);
        
        const width = Math.floor(rect.width * dpr);
        const height = Math.floor(rect.height * dpr);
        
        // Only resize if dimensions changed
        if (this.canvas.width === width && this.canvas.height === height) {
            return;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        this.setRenderSize(width, height);
        
        if (this.gl) {
            this.gl.viewport(0, 0, this.renderSpec.width, this.renderSpec.height);
            this.createRenderTargets();
            
            if (this.sceneReady) {
                this.initScene();
            }
        }
    }

    /**
     * Create a render target (framebuffer)
     */
    createRenderTarget(w, h) {
        const gl = this.gl;
        
        // Ensure minimum size
        w = Math.max(1, w);
        h = Math.max(1, h);
        
        const ret = {
            width: w,
            height: h,
            sizeArray: new Float32Array([w, h, w / h]),
            dtxArray: new Float32Array([1 / w, 1 / h])
        };

        // Create framebuffer
        ret.frameBuffer = gl.createFramebuffer();
        ret.renderBuffer = gl.createRenderbuffer();
        ret.texture = gl.createTexture();

        // Setup texture
        gl.bindTexture(gl.TEXTURE_2D, ret.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        
        // Use CLAMP_TO_EDGE for non-power-of-two textures (Safari requirement)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        // Setup framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, ret.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, ret.texture, 0);

        // Setup renderbuffer for depth
        gl.bindRenderbuffer(gl.RENDERBUFFER, ret.renderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, ret.renderBuffer);

        // Check framebuffer status
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            console.warn('Framebuffer incomplete:', status);
        }

        // Cleanup bindings
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return ret;
    }

    /**
     * Delete a render target
     */
    deleteRenderTarget(rt) {
        if (!rt || !this.gl) return;
        
        const gl = this.gl;
        if (rt.frameBuffer) gl.deleteFramebuffer(rt.frameBuffer);
        if (rt.renderBuffer) gl.deleteRenderbuffer(rt.renderBuffer);
        if (rt.texture) gl.deleteTexture(rt.texture);
    }

    /**
     * Create all render targets
     */
    createRenderTargets() {
        // Clean up existing targets
        ['mainRT', 'wFullRT0', 'wFullRT1', 'wHalfRT0', 'wHalfRT1'].forEach(name => {
            if (this.renderTargets[name]) {
                this.deleteRenderTarget(this.renderTargets[name]);
            }
        });

        // Create new targets
        this.renderTargets.mainRT = this.createRenderTarget(
            this.renderSpec.width,
            this.renderSpec.height
        );
        this.renderTargets.wFullRT0 = this.createRenderTarget(
            this.renderSpec.width,
            this.renderSpec.height
        );
        this.renderTargets.wFullRT1 = this.createRenderTarget(
            this.renderSpec.width,
            this.renderSpec.height
        );
        this.renderTargets.wHalfRT0 = this.createRenderTarget(
            this.renderSpec.halfWidth,
            this.renderSpec.halfHeight
        );
        this.renderTargets.wHalfRT1 = this.createRenderTarget(
            this.renderSpec.halfWidth,
            this.renderSpec.halfHeight
        );
    }

    /**
     * Compile a shader with error handling
     */
    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            console.error('Shader compilation error:', error);
            console.error('Shader source:', source.substring(0, 200));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    /**
     * Create a shader program
     */
    createShaderProgram(vertexSource, fragmentSource, uniforms, attributes) {
        const gl = this.gl;

        const vs = this.compileShader(gl.VERTEX_SHADER, vertexSource);
        const fs = this.compileShader(gl.FRAGMENT_SHADER, fragmentSource);

        if (!vs || !fs) {
            return null;
        }

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        // Clean up shaders (they're linked now)
        gl.deleteShader(vs);
        gl.deleteShader(fs);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const error = gl.getProgramInfoLog(program);
            console.error('Program link error:', error);
            gl.deleteProgram(program);
            return null;
        }

        // Get uniform locations
        program.uniforms = {};
        if (uniforms) {
            uniforms.forEach(name => {
                program.uniforms[name] = gl.getUniformLocation(program, name);
            });
        }

        // Get attribute locations
        program.attributes = {};
        if (attributes) {
            attributes.forEach(name => {
                program.attributes[name] = gl.getAttribLocation(program, name);
            });
        }

        return program;
    }

    /**
     * Create the scene (shaders and geometry)
     */
    createScene() {
        try {
            this.createEffectLib();
            this.createPointFlowers();
            this.sceneReady = true;
            return true;
        } catch (error) {
            console.error('Scene creation failed:', error);
            return false;
        }
    }

    /**
     * Create effect library (post-processing shaders)
     */
    createEffectLib() {
        const commonVsh = this.shaderSources.fx_common_vsh || 
                          document.getElementById('fx_common_vsh').textContent;

        this.effectLib.sceneBg = this.createEffectProgram(
            commonVsh,
            this.shaderSources.bg_fsh || document.getElementById('bg_fsh').textContent,
            ['uTimes']
        );

        this.effectLib.mkBrightBuf = this.createEffectProgram(
            commonVsh,
            this.shaderSources.fx_brightbuf_fsh || document.getElementById('fx_brightbuf_fsh').textContent
        );

        this.effectLib.dirBlur = this.createEffectProgram(
            commonVsh,
            this.shaderSources.fx_dirblur_r4_fsh || document.getElementById('fx_dirblur_r4_fsh').textContent,
            ['uBlurDir']
        );

        this.effectLib.finalComp = this.createEffectProgram(
            this.shaderSources.pp_final_vsh || document.getElementById('pp_final_vsh').textContent,
            this.shaderSources.pp_final_fsh || document.getElementById('pp_final_fsh').textContent,
            ['uBloom']
        );
    }

    /**
     * Create an effect program with its buffer
     */
    createEffectProgram(vertexSource, fragmentSource, extraUniforms) {
        const gl = this.gl;
        const uniforms = ['uResolution', 'uSrc', 'uDelta'];
        
        if (extraUniforms) {
            uniforms.push(...extraUniforms);
        }

        const ret = {
            program: this.createShaderProgram(vertexSource, fragmentSource, uniforms, ['aPosition'])
        };

        // Create quad buffer
        ret.dataArray = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        ret.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ret.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, ret.dataArray, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return ret;
    }

    /**
     * Create the particle flower system
     */
    createPointFlowers() {
        const gl = this.gl;
        const pf = this.pointFlower;

        // Get point size range
        const pointSizeRange = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
        this.renderSpec.pointSize = {
            min: pointSizeRange[0],
            max: pointSizeRange[1]
        };

        // Create shader program
        pf.program = this.createShaderProgram(
            this.shaderSources.sakura_point_vsh || document.getElementById('sakura_point_vsh').textContent,
            this.shaderSources.sakura_point_fsh || document.getElementById('sakura_point_fsh').textContent,
            ['uProjection', 'uModelview', 'uResolution', 'uOffset', 'uDOF', 'uFade'],
            ['aPosition', 'aEuler', 'aMisc']
        );

        if (!pf.program) {
            throw new Error('Failed to create point flower shader program');
        }

        // Create data array
        pf.dataArray = new Float32Array(pf.numFlowers * 8);
        pf.positionOffset = 0;
        pf.eulerOffset = pf.numFlowers * 3;
        pf.miscOffset = pf.numFlowers * 6;

        // Create buffer
        pf.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pf.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, pf.dataArray, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // Initialize particles
        pf.particles = [];
        for (let i = 0; i < pf.numFlowers; i++) {
            pf.particles.push({
                position: [0, 0, 0],
                velocity: [0, 0, 0],
                euler: [0, 0, 0],
                rotation: [0, 0, 0],
                size: 1,
                alpha: 1,
                zkey: 0
            });
        }
    }

    /**
     * Initialize the scene
     */
    initScene() {
        this.initPointFlowers();
        this.camera.position.z = this.pointFlower.area.z + this.projection.nearfar[0];
        this.projection.angle = Math.atan2(
            this.pointFlower.area.y,
            this.camera.position.z + this.pointFlower.area.z
        ) * 180 / Math.PI * 2;
        this.loadProjection();
    }

    /**
     * Initialize point flowers
     */
    initPointFlowers() {
        const pf = this.pointFlower;
        pf.area.x = pf.area.y * this.renderSpec.aspect;
        pf.fader.x = 10;
        pf.fader.y = pf.area.z;
        pf.fader.z = 0.1;

        const PI2 = Math.PI * 2;
        const sr = () => Math.random() * 2 - 1;

        for (let i = 0; i < pf.numFlowers; i++) {
            const p = pf.particles[i];
            
            const vx = sr() * 0.3 + 0.8;
            const vy = sr() * 0.2 - 1;
            const vz = sr() * 0.3 + 0.5;
            const vl = Math.sqrt(vx * vx + vy * vy + vz * vz);
            const sp = 2 + Math.random();
            
            p.velocity = [(vx / vl) * sp, (vy / vl) * sp, (vz / vl) * sp];
            p.rotation = [sr() * PI2 * 0.5, sr() * PI2 * 0.5, sr() * PI2 * 0.5];
            p.position = [sr() * pf.area.x, sr() * pf.area.y, sr() * pf.area.z];
            p.euler = [Math.random() * PI2, Math.random() * PI2, Math.random() * PI2];
            p.size = 0.9 + Math.random() * 0.1;
        }
    }

    /**
     * Load projection matrix
     */
    loadProjection() {
        const m = this.projection.matrix;
        const aspect = this.renderSpec.aspect;
        const angle = this.projection.angle;
        const near = this.projection.nearfar[0];
        const far = this.projection.nearfar[1];

        const h = near * Math.tan(angle * Math.PI / 180 * 0.5) * 2;
        const w = h * aspect;

        m[0] = 2 * near / w;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = 2 * near / h;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = -(far + near) / (far - near);
        m[11] = -1;
        m[12] = 0;
        m[13] = 0;
        m[14] = -2 * far * near / (far - near);
        m[15] = 0;
    }

    /**
     * Load look-at matrix
     */
    loadLookAt() {
        const m = this.camera.matrix;
        const pos = this.camera.position;
        const look = this.camera.lookat;
        const up = this.camera.up;

        let fx = pos.x - look.x;
        let fy = pos.y - look.y;
        let fz = pos.z - look.z;
        let fl = Math.sqrt(fx * fx + fy * fy + fz * fz);
        fx /= fl;
        fy /= fl;
        fz /= fl;

        let sx = up.y * fz - up.z * fy;
        let sy = up.z * fx - up.x * fz;
        let sz = up.x * fy - up.y * fx;
        let sl = Math.sqrt(sx * sx + sy * sy + sz * sz);
        sx /= sl;
        sy /= sl;
        sz /= sl;

        let tx = fy * sz - fz * sy;
        let ty = fz * sx - fx * sz;
        let tz = fx * sy - fy * sx;
        let tl = Math.sqrt(tx * tx + ty * ty + tz * tz);
        tx /= tl;
        ty /= tl;
        tz /= tl;

        m[0] = sx; m[1] = tx; m[2] = fx; m[3] = 0;
        m[4] = sy; m[5] = ty; m[6] = fy; m[7] = 0;
        m[8] = sz; m[9] = tz; m[10] = fz; m[11] = 0;
        m[12] = -(pos.x * m[0] + pos.y * m[4] + pos.z * m[8]);
        m[13] = -(pos.x * m[1] + pos.y * m[5] + pos.z * m[9]);
        m[14] = -(pos.x * m[2] + pos.y * m[6] + pos.z * m[10]);
        m[15] = 1;
    }

    /**
     * Update particle positions
     */
    updateParticles() {
        const pf = this.pointFlower;
        const dt = this.timeInfo.delta;
        const PI2 = Math.PI * 2;
        const lim = [pf.area.x, pf.area.y, pf.area.z];

        for (let i = 0; i < pf.numFlowers; i++) {
            const p = pf.particles[i];

            // Update position
            p.position[0] += p.velocity[0] * dt;
            p.position[1] += p.velocity[1] * dt;
            p.position[2] += p.velocity[2] * dt;

            // Update rotation
            p.euler[0] += p.rotation[0] * dt;
            p.euler[1] += p.rotation[1] * dt;
            p.euler[2] += p.rotation[2] * dt;

            // Wrap around
            for (let c = 0; c < 3; c++) {
                if (Math.abs(p.position[c]) - p.size * 0.5 > lim[c]) {
                    p.position[c] += (p.position[c] > 0 ? -2 : 2) * lim[c];
                }
                p.euler[c] = p.euler[c] % PI2;
                if (p.euler[c] < 0) p.euler[c] += PI2;
            }

            // Calculate z-key for sorting
            const cm = this.camera.matrix;
            p.zkey = cm[2] * p.position[0] + cm[6] * p.position[1] + 
                     cm[10] * p.position[2] + cm[14];
        }

        // Sort by depth
        pf.particles.sort((a, b) => a.zkey - b.zkey);

        // Update data array
        let ip = pf.positionOffset;
        let ie = pf.eulerOffset;
        let im = pf.miscOffset;

        for (let i = 0; i < pf.numFlowers; i++) {
            const p = pf.particles[i];
            pf.dataArray[ip++] = p.position[0];
            pf.dataArray[ip++] = p.position[1];
            pf.dataArray[ip++] = p.position[2];
            pf.dataArray[ie++] = p.euler[0];
            pf.dataArray[ie++] = p.euler[1];
            pf.dataArray[ie++] = p.euler[2];
            pf.dataArray[im++] = p.size;
            pf.dataArray[im++] = p.alpha;
        }
    }

    /**
     * Render point flowers
     */
    renderPointFlowers() {
        const gl = this.gl;
        const pf = this.pointFlower;
        const prog = pf.program;

        if (!prog) return;

        this.updateParticles();

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(prog);

        // Enable attributes
        for (const attr in prog.attributes) {
            if (prog.attributes[attr] >= 0) {
                gl.enableVertexAttribArray(prog.attributes[attr]);
            }
        }

        // Set uniforms
        gl.uniformMatrix4fv(prog.uniforms.uProjection, false, this.projection.matrix);
        gl.uniformMatrix4fv(prog.uniforms.uModelview, false, this.camera.matrix);
        gl.uniform3fv(prog.uniforms.uResolution, this.renderSpec.array);

        this.camera.dof.array[0] = this.camera.dof.x;
        this.camera.dof.array[1] = this.camera.dof.y;
        this.camera.dof.array[2] = this.camera.dof.z;
        gl.uniform3fv(prog.uniforms.uDOF, this.camera.dof.array);

        pf.fader.array[0] = pf.fader.x;
        pf.fader.array[1] = pf.fader.y;
        pf.fader.array[2] = pf.fader.z;
        gl.uniform3fv(prog.uniforms.uFade, pf.fader.array);

        // Update buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, pf.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, pf.dataArray, gl.DYNAMIC_DRAW);

        const FS = Float32Array.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(prog.attributes.aPosition, 3, gl.FLOAT, false, 0, pf.positionOffset * FS);
        gl.vertexAttribPointer(prog.attributes.aEuler, 3, gl.FLOAT, false, 0, pf.eulerOffset * FS);
        gl.vertexAttribPointer(prog.attributes.aMisc, 2, gl.FLOAT, false, 0, pf.miscOffset * FS);

        pf.offset[0] = 0;
        pf.offset[1] = 0;
        pf.offset[2] = 0;
        gl.uniform3fv(prog.uniforms.uOffset, pf.offset);

        // Draw
        gl.drawArrays(gl.POINTS, 0, pf.numFlowers);

        // Cleanup
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        for (const attr in prog.attributes) {
            if (prog.attributes[attr] >= 0) {
                gl.disableVertexAttribArray(prog.attributes[attr]);
            }
        }
        gl.useProgram(null);
        gl.enable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
    }

    /**
     * Use an effect
     */
    useEffect(fx, src) {
        const gl = this.gl;
        const prog = fx.program;

        if (!prog) return;

        gl.useProgram(prog);

        for (const attr in prog.attributes) {
            if (prog.attributes[attr] >= 0) {
                gl.enableVertexAttribArray(prog.attributes[attr]);
            }
        }

        gl.uniform3fv(prog.uniforms.uResolution, this.renderSpec.array);

        if (src) {
            gl.uniform2fv(prog.uniforms.uDelta, src.dtxArray);
            gl.uniform1i(prog.uniforms.uSrc, 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, src.texture);
        }
    }

    /**
     * Draw an effect
     */
    drawEffect(fx) {
        const gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, fx.buffer);
        gl.vertexAttribPointer(fx.program.attributes.aPosition, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    /**
     * Cleanup after using an effect
     */
    unuseEffect(fx) {
        const gl = this.gl;
        for (const attr in fx.program.attributes) {
            if (fx.program.attributes[attr] >= 0) {
                gl.disableVertexAttribArray(fx.program.attributes[attr]);
            }
        }
        gl.useProgram(null);
    }

    /**
     * Render background
     */
    renderBackground() {
        const gl = this.gl;
        gl.disable(gl.DEPTH_TEST);
        
        this.useEffect(this.effectLib.sceneBg, null);
        gl.uniform2f(
            this.effectLib.sceneBg.program.uniforms.uTimes,
            this.timeInfo.elapsed,
            this.timeInfo.delta
        );
        this.drawEffect(this.effectLib.sceneBg);
        this.unuseEffect(this.effectLib.sceneBg);
        
        gl.enable(gl.DEPTH_TEST);
    }

    /**
     * Render post-processing effects
     */
    renderPostProcess() {
        const gl = this.gl;
        const rt = this.renderTargets;

        gl.disable(gl.DEPTH_TEST);

        const bindRT = (target, clear) => {
            gl.bindFramebuffer(gl.FRAMEBUFFER, target.frameBuffer);
            gl.viewport(0, 0, target.width, target.height);
            if (clear) {
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            }
        };

        // Bright buffer
        bindRT(rt.wHalfRT0, true);
        this.useEffect(this.effectLib.mkBrightBuf, rt.mainRT);
        this.drawEffect(this.effectLib.mkBrightBuf);
        this.unuseEffect(this.effectLib.mkBrightBuf);

        // Blur passes
        for (let i = 0; i < 2; i++) {
            const p = 1.5 + i;
            const s = 2 + i;

            // Horizontal blur
            bindRT(rt.wHalfRT1, true);
            this.useEffect(this.effectLib.dirBlur, rt.wHalfRT0);
            gl.uniform4f(this.effectLib.dirBlur.program.uniforms.uBlurDir, p, 0, s, 0);
            this.drawEffect(this.effectLib.dirBlur);
            this.unuseEffect(this.effectLib.dirBlur);

            // Vertical blur
            bindRT(rt.wHalfRT0, true);
            this.useEffect(this.effectLib.dirBlur, rt.wHalfRT1);
            gl.uniform4f(this.effectLib.dirBlur.program.uniforms.uBlurDir, 0, p, 0, s);
            this.drawEffect(this.effectLib.dirBlur);
            this.unuseEffect(this.effectLib.dirBlur);
        }

        // Final composite
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.renderSpec.width, this.renderSpec.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.useEffect(this.effectLib.finalComp, rt.mainRT);
        gl.uniform1i(this.effectLib.finalComp.program.uniforms.uBloom, 1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, rt.wHalfRT0.texture);
        this.drawEffect(this.effectLib.finalComp);
        this.unuseEffect(this.effectLib.finalComp);

        gl.enable(gl.DEPTH_TEST);
    }

    /**
     * Main render function
     */
    render() {
        if (!this.gl || !this.sceneReady) return;

        const gl = this.gl;
        const rt = this.renderTargets;

        this.loadLookAt();
        gl.enable(gl.DEPTH_TEST);

        // Render to main target
        gl.bindFramebuffer(gl.FRAMEBUFFER, rt.mainRT.frameBuffer);
        gl.viewport(0, 0, rt.mainRT.width, rt.mainRT.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.renderBackground();
        this.renderPointFlowers();
        this.renderPostProcess();
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.animating) return;

        const now = performance.now();
        this.timeInfo.elapsed = (now - this.timeInfo.start) / 1000;
        this.timeInfo.delta = Math.min((now - this.timeInfo.prev) / 1000, 0.1);
        this.timeInfo.prev = now;

        this.render();

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    /**
     * Start animation
     */
    start() {
        if (this.animating) return;
        
        this.animating = true;
        this.timeInfo.prev = performance.now();
        this.animate();
    }

    /**
     * Stop animation
     */
    stop() {
        this.animating = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        this.stop();

        const gl = this.gl;
        if (gl) {
            // Delete render targets
            Object.values(this.renderTargets).forEach(rt => {
                this.deleteRenderTarget(rt);
            });

            // Delete point flower resources
            if (this.pointFlower.buffer) {
                gl.deleteBuffer(this.pointFlower.buffer);
            }
            if (this.pointFlower.program) {
                gl.deleteProgram(this.pointFlower.program);
            }

            // Delete effect resources
            Object.values(this.effectLib).forEach(fx => {
                if (fx.buffer) gl.deleteBuffer(fx.buffer);
                if (fx.program) gl.deleteProgram(fx.program);
            });
        }

        // Remove canvas
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }

        // Reset state
        this.canvas = null;
        this.gl = null;
        this.sceneReady = false;
        this.renderTargets = {};
        this.effectLib = {};
    }
}

export const sakuraPetals = new SakuraPetals();
export default sakuraPetals;
