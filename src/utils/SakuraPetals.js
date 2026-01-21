class SakuraPetals {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.animating = true;
        this.animationFrame = null;
        this.sceneReady = false;
        this.timeInfo = { start: 0, prev: 0, delta: 0, elapsed: 0 };
        this.renderSpec = { width: 0, height: 0, aspect: 1, array: new Float32Array(3), halfWidth: 0, halfHeight: 0, halfArray: new Float32Array(3), pointSize: { min: 1, max: 256 } };
        this.projection = { angle: 60, nearfar: new Float32Array([0.1, 100.0]), matrix: new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]) };
        this.camera = { position: { x: 0, y: 0, z: 100 }, lookat: { x: 0, y: 0, z: 0 }, up: { x: 0, y: 1, z: 0 }, dof: { x: 10, y: 4, z: 8, array: new Float32Array(3) }, matrix: new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]) };
        this.pointFlower = { program: null, buffer: null, numFlowers: 800, particles: [], dataArray: null, area: { x: 20, y: 20, z: 20 }, offset: new Float32Array(3), fader: { x: 10, y: 20, z: 0.1, array: new Float32Array(3) } };
        this.effectLib = {};
        this.renderTargets = {};
    }

    init(container) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'sakura-canvas';
        container.appendChild(this.canvas);
        try {
            this.gl = this.canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, powerPreference: 'low-power' }) || this.canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });
        } catch (e) { return false; }
        if (!this.gl) return false;
        this.resize();
        this.createScene();
        this.initScene();
        window.addEventListener('resize', () => this.resize());
        this.timeInfo.start = performance.now();
        this.timeInfo.prev = this.timeInfo.start;
        this.animate();
        return true;
    }

    setRenderSize(w, h) {
        this.renderSpec.width = w; this.renderSpec.height = h; this.renderSpec.aspect = w / h;
        this.renderSpec.array[0] = w; this.renderSpec.array[1] = h; this.renderSpec.array[2] = this.renderSpec.aspect;
        this.renderSpec.halfWidth = Math.floor(w / 2); this.renderSpec.halfHeight = Math.floor(h / 2);
        this.renderSpec.halfArray[0] = this.renderSpec.halfWidth; this.renderSpec.halfArray[1] = this.renderSpec.halfHeight;
        this.renderSpec.halfArray[2] = this.renderSpec.halfWidth / this.renderSpec.halfHeight;
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio, 1.5);
        this.canvas.width = rect.width * dpr; this.canvas.height = rect.height * dpr;
        this.canvas.style.width = '100%'; this.canvas.style.height = '100%';
        this.setRenderSize(this.canvas.width, this.canvas.height);
        this.gl.viewport(0, 0, this.renderSpec.width, this.renderSpec.height);
        this.createRenderTargets();
        if (this.sceneReady) this.initScene();
    }

    createRenderTarget(w, h) {
        const gl = this.gl;
        const ret = { width: w, height: h, sizeArray: new Float32Array([w, h, w/h]), dtxArray: new Float32Array([1/w, 1/h]) };
        ret.frameBuffer = gl.createFramebuffer(); ret.renderBuffer = gl.createRenderbuffer(); ret.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, ret.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.bindFramebuffer(gl.FRAMEBUFFER, ret.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, ret.texture, 0);
        gl.bindRenderbuffer(gl.RENDERBUFFER, ret.renderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, ret.renderBuffer);
        gl.bindTexture(gl.TEXTURE_2D, null); gl.bindRenderbuffer(gl.RENDERBUFFER, null); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return ret;
    }

    deleteRenderTarget(rt) { if (!rt) return; this.gl.deleteFramebuffer(rt.frameBuffer); this.gl.deleteRenderbuffer(rt.renderBuffer); this.gl.deleteTexture(rt.texture); }

    createRenderTargets() {
        ['mainRT', 'wFullRT0', 'wFullRT1', 'wHalfRT0', 'wHalfRT1'].forEach(n => { if (this.renderTargets[n]) this.deleteRenderTarget(this.renderTargets[n]); });
        this.renderTargets.mainRT = this.createRenderTarget(this.renderSpec.width, this.renderSpec.height);
        this.renderTargets.wFullRT0 = this.createRenderTarget(this.renderSpec.width, this.renderSpec.height);
        this.renderTargets.wFullRT1 = this.createRenderTarget(this.renderSpec.width, this.renderSpec.height);
        this.renderTargets.wHalfRT0 = this.createRenderTarget(this.renderSpec.halfWidth, this.renderSpec.halfHeight);
        this.renderTargets.wHalfRT1 = this.createRenderTarget(this.renderSpec.halfWidth, this.renderSpec.halfHeight);
    }

    compileShader(type, src) {
        const gl = this.gl, s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
        return s;
    }

    createShaderProgram(v, f, u, a) {
        const gl = this.gl, vs = this.compileShader(gl.VERTEX_SHADER, v), fs = this.compileShader(gl.FRAGMENT_SHADER, f);
        if (!vs || !fs) return null;
        const p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, fs); gl.deleteShader(vs); gl.deleteShader(fs); gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
        p.uniforms = {}; if (u) u.forEach(n => p.uniforms[n] = gl.getUniformLocation(p, n));
        p.attributes = {}; if (a) a.forEach(n => p.attributes[n] = gl.getAttribLocation(p, n));
        return p;
    }

    createScene() { this.createEffectLib(); this.createPointFlowers(); this.sceneReady = true; }

    createEffectLib() {
        const cv = document.getElementById('fx_common_vsh').textContent;
        this.effectLib.sceneBg = this.createEffectProgram(cv, document.getElementById('bg_fsh').textContent, ['uTimes']);
        this.effectLib.mkBrightBuf = this.createEffectProgram(cv, document.getElementById('fx_brightbuf_fsh').textContent);
        this.effectLib.dirBlur = this.createEffectProgram(cv, document.getElementById('fx_dirblur_r4_fsh').textContent, ['uBlurDir']);
        this.effectLib.finalComp = this.createEffectProgram(document.getElementById('pp_final_vsh').textContent, document.getElementById('pp_final_fsh').textContent, ['uBloom']);
    }

    createEffectProgram(v, f, eu) {
        const gl = this.gl, u = ['uResolution', 'uSrc', 'uDelta']; if (eu) u.push(...eu);
        const ret = { program: this.createShaderProgram(v, f, u, ['aPosition']) };
        ret.dataArray = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
        ret.buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, ret.buffer); gl.bufferData(gl.ARRAY_BUFFER, ret.dataArray, gl.STATIC_DRAW); gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return ret;
    }

    createPointFlowers() {
        const gl = this.gl, pf = this.pointFlower;
        const prm = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE); this.renderSpec.pointSize = { min: prm[0], max: prm[1] };
        pf.program = this.createShaderProgram(document.getElementById('sakura_point_vsh').textContent, document.getElementById('sakura_point_fsh').textContent,
            ['uProjection', 'uModelview', 'uResolution', 'uOffset', 'uDOF', 'uFade'], ['aPosition', 'aEuler', 'aMisc']);
        pf.dataArray = new Float32Array(pf.numFlowers * 8);
        pf.positionOffset = 0; pf.eulerOffset = pf.numFlowers * 3; pf.miscOffset = pf.numFlowers * 6;
        pf.buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, pf.buffer); gl.bufferData(gl.ARRAY_BUFFER, pf.dataArray, gl.DYNAMIC_DRAW); gl.bindBuffer(gl.ARRAY_BUFFER, null);
        for (let i = 0; i < pf.numFlowers; i++) pf.particles.push({ position: [0,0,0], velocity: [0,0,0], euler: [0,0,0], rotation: [0,0,0], size: 1, alpha: 1, zkey: 0 });
    }

    initScene() {
        this.initPointFlowers();
        this.camera.position.z = this.pointFlower.area.z + this.projection.nearfar[0];
        this.projection.angle = Math.atan2(this.pointFlower.area.y, this.camera.position.z + this.pointFlower.area.z) * 180 / Math.PI * 2;
        this.loadProjection();
    }

    initPointFlowers() {
        const pf = this.pointFlower;
        pf.area.x = pf.area.y * this.renderSpec.aspect;
        pf.fader.x = 10; pf.fader.y = pf.area.z; pf.fader.z = 0.1;
        const PI2 = Math.PI * 2, sr = () => Math.random() * 2 - 1;
        for (let i = 0; i < pf.numFlowers; i++) {
            const p = pf.particles[i];
            const vx = sr() * 0.3 + 0.8, vy = sr() * 0.2 - 1, vz = sr() * 0.3 + 0.5;
            const vl = Math.sqrt(vx*vx + vy*vy + vz*vz), sp = 2 + Math.random();
            p.velocity = [(vx/vl)*sp, (vy/vl)*sp, (vz/vl)*sp];
            p.rotation = [sr()*PI2*0.5, sr()*PI2*0.5, sr()*PI2*0.5];
            p.position = [sr()*pf.area.x, sr()*pf.area.y, sr()*pf.area.z];
            p.euler = [Math.random()*PI2, Math.random()*PI2, Math.random()*PI2];
            p.size = 0.9 + Math.random() * 0.1;
        }
    }

    loadProjection() {
        const m = this.projection.matrix, a = this.renderSpec.aspect, ang = this.projection.angle, n = this.projection.nearfar[0], f = this.projection.nearfar[1];
        const h = n * Math.tan(ang * Math.PI / 180 * 0.5) * 2, w = h * a;
        m[0] = 2*n/w; m[1] = 0; m[2] = 0; m[3] = 0; m[4] = 0; m[5] = 2*n/h; m[6] = 0; m[7] = 0;
        m[8] = 0; m[9] = 0; m[10] = -(f+n)/(f-n); m[11] = -1; m[12] = 0; m[13] = 0; m[14] = -2*f*n/(f-n); m[15] = 0;
    }

    loadLookAt() {
        const m = this.camera.matrix, pos = this.camera.position, look = this.camera.lookat, up = this.camera.up;
        let fx = pos.x - look.x, fy = pos.y - look.y, fz = pos.z - look.z, fl = Math.sqrt(fx*fx+fy*fy+fz*fz);
        fx /= fl; fy /= fl; fz /= fl;
        let sx = up.y*fz - up.z*fy, sy = up.z*fx - up.x*fz, sz = up.x*fy - up.y*fx, sl = Math.sqrt(sx*sx+sy*sy+sz*sz);
        sx /= sl; sy /= sl; sz /= sl;
        let tx = fy*sz - fz*sy, ty = fz*sx - fx*sz, tz = fx*sy - fy*sx, tl = Math.sqrt(tx*tx+ty*ty+tz*tz);
        tx /= tl; ty /= tl; tz /= tl;
        m[0]=sx; m[1]=tx; m[2]=fx; m[3]=0; m[4]=sy; m[5]=ty; m[6]=fy; m[7]=0; m[8]=sz; m[9]=tz; m[10]=fz; m[11]=0;
        m[12]=-(pos.x*m[0]+pos.y*m[4]+pos.z*m[8]); m[13]=-(pos.x*m[1]+pos.y*m[5]+pos.z*m[9]); m[14]=-(pos.x*m[2]+pos.y*m[6]+pos.z*m[10]); m[15]=1;
    }

    updateParticles() {
        const pf = this.pointFlower, dt = this.timeInfo.delta, PI2 = Math.PI * 2, lim = [pf.area.x, pf.area.y, pf.area.z];
        for (let i = 0; i < pf.numFlowers; i++) {
            const p = pf.particles[i];
            p.position[0] += p.velocity[0] * dt; p.position[1] += p.velocity[1] * dt; p.position[2] += p.velocity[2] * dt;
            p.euler[0] += p.rotation[0] * dt; p.euler[1] += p.rotation[1] * dt; p.euler[2] += p.rotation[2] * dt;
            for (let c = 0; c < 3; c++) {
                if (Math.abs(p.position[c]) - p.size * 0.5 > lim[c]) p.position[c] += (p.position[c] > 0 ? -2 : 2) * lim[c];
                p.euler[c] = p.euler[c] % PI2; if (p.euler[c] < 0) p.euler[c] += PI2;
            }
            const cm = this.camera.matrix;
            p.zkey = cm[2]*p.position[0] + cm[6]*p.position[1] + cm[10]*p.position[2] + cm[14];
        }
        pf.particles.sort((a, b) => a.zkey - b.zkey);
        let ip = pf.positionOffset, ie = pf.eulerOffset, im = pf.miscOffset;
        for (let i = 0; i < pf.numFlowers; i++) {
            const p = pf.particles[i];
            pf.dataArray[ip++] = p.position[0]; pf.dataArray[ip++] = p.position[1]; pf.dataArray[ip++] = p.position[2];
            pf.dataArray[ie++] = p.euler[0]; pf.dataArray[ie++] = p.euler[1]; pf.dataArray[ie++] = p.euler[2];
            pf.dataArray[im++] = p.size; pf.dataArray[im++] = p.alpha;
        }
    }

    renderPointFlowers() {
        const gl = this.gl, pf = this.pointFlower, prog = pf.program;
        this.updateParticles();
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.useProgram(prog);
        for (const a in prog.attributes) gl.enableVertexAttribArray(prog.attributes[a]);
        gl.uniformMatrix4fv(prog.uniforms.uProjection, false, this.projection.matrix);
        gl.uniformMatrix4fv(prog.uniforms.uModelview, false, this.camera.matrix);
        gl.uniform3fv(prog.uniforms.uResolution, this.renderSpec.array);
        this.camera.dof.array[0] = this.camera.dof.x; this.camera.dof.array[1] = this.camera.dof.y; this.camera.dof.array[2] = this.camera.dof.z;
        gl.uniform3fv(prog.uniforms.uDOF, this.camera.dof.array);
        pf.fader.array[0] = pf.fader.x; pf.fader.array[1] = pf.fader.y; pf.fader.array[2] = pf.fader.z;
        gl.uniform3fv(prog.uniforms.uFade, pf.fader.array);
        gl.bindBuffer(gl.ARRAY_BUFFER, pf.buffer); gl.bufferData(gl.ARRAY_BUFFER, pf.dataArray, gl.DYNAMIC_DRAW);
        const FS = Float32Array.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(prog.attributes.aPosition, 3, gl.FLOAT, false, 0, pf.positionOffset * FS);
        gl.vertexAttribPointer(prog.attributes.aEuler, 3, gl.FLOAT, false, 0, pf.eulerOffset * FS);
        gl.vertexAttribPointer(prog.attributes.aMisc, 2, gl.FLOAT, false, 0, pf.miscOffset * FS);
        pf.offset[0] = 0; pf.offset[1] = 0; pf.offset[2] = 0;
        gl.uniform3fv(prog.uniforms.uOffset, pf.offset);
        gl.drawArrays(gl.POINTS, 0, pf.numFlowers);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        for (const a in prog.attributes) gl.disableVertexAttribArray(prog.attributes[a]);
        gl.useProgram(null); gl.enable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
    }

    useEffect(fx, src) {
        const gl = this.gl, prog = fx.program; gl.useProgram(prog);
        for (const a in prog.attributes) gl.enableVertexAttribArray(prog.attributes[a]);
        gl.uniform3fv(prog.uniforms.uResolution, this.renderSpec.array);
        if (src) { gl.uniform2fv(prog.uniforms.uDelta, src.dtxArray); gl.uniform1i(prog.uniforms.uSrc, 0); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, src.texture); }
    }

    drawEffect(fx) { const gl = this.gl; gl.bindBuffer(gl.ARRAY_BUFFER, fx.buffer); gl.vertexAttribPointer(fx.program.attributes.aPosition, 2, gl.FLOAT, false, 0, 0); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); }
    unuseEffect(fx) { const gl = this.gl; for (const a in fx.program.attributes) gl.disableVertexAttribArray(fx.program.attributes[a]); gl.useProgram(null); }

    renderBackground() { const gl = this.gl; gl.disable(gl.DEPTH_TEST); this.useEffect(this.effectLib.sceneBg, null); gl.uniform2f(this.effectLib.sceneBg.program.uniforms.uTimes, this.timeInfo.elapsed, this.timeInfo.delta); this.drawEffect(this.effectLib.sceneBg); this.unuseEffect(this.effectLib.sceneBg); gl.enable(gl.DEPTH_TEST); }

    renderPostProcess() {
        const gl = this.gl, rt = this.renderTargets; gl.disable(gl.DEPTH_TEST);
        const bindRT = (t, c) => { gl.bindFramebuffer(gl.FRAMEBUFFER, t.frameBuffer); gl.viewport(0, 0, t.width, t.height); if (c) { gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); } };
        bindRT(rt.wHalfRT0, true); this.useEffect(this.effectLib.mkBrightBuf, rt.mainRT); this.drawEffect(this.effectLib.mkBrightBuf); this.unuseEffect(this.effectLib.mkBrightBuf);
        for (let i = 0; i < 2; i++) {
            const p = 1.5 + i, s = 2 + i;
            bindRT(rt.wHalfRT1, true); this.useEffect(this.effectLib.dirBlur, rt.wHalfRT0); gl.uniform4f(this.effectLib.dirBlur.program.uniforms.uBlurDir, p, 0, s, 0); this.drawEffect(this.effectLib.dirBlur); this.unuseEffect(this.effectLib.dirBlur);
            bindRT(rt.wHalfRT0, true); this.useEffect(this.effectLib.dirBlur, rt.wHalfRT1); gl.uniform4f(this.effectLib.dirBlur.program.uniforms.uBlurDir, 0, p, 0, s); this.drawEffect(this.effectLib.dirBlur); this.unuseEffect(this.effectLib.dirBlur);
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, this.renderSpec.width, this.renderSpec.height); gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.useEffect(this.effectLib.finalComp, rt.mainRT); gl.uniform1i(this.effectLib.finalComp.program.uniforms.uBloom, 1); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, rt.wHalfRT0.texture); this.drawEffect(this.effectLib.finalComp); this.unuseEffect(this.effectLib.finalComp); gl.enable(gl.DEPTH_TEST);
    }

    render() {
        const gl = this.gl, rt = this.renderTargets; this.loadLookAt(); gl.enable(gl.DEPTH_TEST);
        gl.bindFramebuffer(gl.FRAMEBUFFER, rt.mainRT.frameBuffer); gl.viewport(0, 0, rt.mainRT.width, rt.mainRT.height); gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.renderBackground(); this.renderPointFlowers(); this.renderPostProcess();
    }

    animate() {
        if (!this.animating) return;
        const now = performance.now();
        this.timeInfo.elapsed = (now - this.timeInfo.start) / 1000;
        this.timeInfo.delta = Math.min((now - this.timeInfo.prev) / 1000, 0.1);
        this.timeInfo.prev = now;
        this.render();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    start() { this.animating = true; this.timeInfo.prev = performance.now(); this.animate(); }
    stop() { this.animating = false; if (this.animationFrame) cancelAnimationFrame(this.animationFrame); }
    destroy() {
        this.stop();
        const gl = this.gl;
        if (gl) {
            Object.values(this.renderTargets).forEach(rt => this.deleteRenderTarget(rt));
            if (this.pointFlower.buffer) gl.deleteBuffer(this.pointFlower.buffer);
            if (this.pointFlower.program) gl.deleteProgram(this.pointFlower.program);
            Object.values(this.effectLib).forEach(fx => { if (fx.buffer) gl.deleteBuffer(fx.buffer); if (fx.program) gl.deleteProgram(fx.program); });
        }
        if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    }
}

export const sakuraPetals = new SakuraPetals();
export default sakuraPetals;
