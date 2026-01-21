class CursorManager {
    constructor() {
        this.cursor = null;
        this.particleContainer = null;
        this.isHovering = false;
        this.particles = [];
        this.particlePool = [];
        this.animationFrame = null;
        this.maxParticles = 50;
        this.isActive = false;
    }

    init() {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
        this.createCursor();
        this.createParticleContainer();
        this.bindEvents();
        this.startParticleLoop();
        document.body.classList.add('custom-cursor-active');
        this.isActive = true;
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.innerHTML = '<img src="./src/assets/Cursor.png" alt="" class="cursor-image">';
        document.body.appendChild(this.cursor);
    }

    createParticleContainer() {
        this.particleContainer = document.createElement('div');
        this.particleContainer.className = 'particle-container';
        document.body.appendChild(this.particleContainer);
    }

    bindEvents() {
        document.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });
        document.addEventListener('mouseover', (e) => { if (this.isClickable(e.target)) { this.isHovering = true; this.cursor.classList.add('hovering'); } }, { passive: true });
        document.addEventListener('mouseout', (e) => { if (this.isClickable(e.target)) { this.isHovering = false; this.cursor.classList.remove('hovering'); } }, { passive: true });
    }

    isClickable(el) {
        if (!el) return false;
        const tags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
        const hasClass = el.classList && (el.classList.contains('clickable') || el.classList.contains('audio-toggle') || el.classList.contains('nav-link') || el.classList.contains('news-panel'));
        return tags.includes(el.tagName) || hasClass;
    }

    onMouseMove(e) {
        if (this.cursor) { this.cursor.style.left = `${e.clientX}px`; this.cursor.style.top = `${e.clientY}px`; }
        if (this.isHovering && Math.random() > 0.7 && this.particles.length < this.maxParticles) this.createParticle(e.clientX, e.clientY);
    }

    getParticleFromPool() { return this.particlePool.length > 0 ? this.particlePool.pop() : Object.assign(document.createElement('div'), { className: 'cursor-particle' }); }
    returnParticleToPool(p) { p.style.opacity = '0'; this.particlePool.push(p); }

    createParticle(x, y) {
        const p = this.getParticleFromPool();
        const ox = (Math.random() - 0.5) * 20, oy = (Math.random() - 0.5) * 20, sz = Math.random() * 4 + 2;
        p.style.left = `${x + ox}px`; p.style.top = `${y + oy}px`; p.style.width = `${sz}px`; p.style.height = `${sz}px`; p.style.opacity = '1';
        this.particleContainer.appendChild(p);
        this.particles.push({ element: p, x: x + ox, y: y + oy, life: 1, decay: 0.02 + Math.random() * 0.02, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 2 - 1 });
    }

    startParticleLoop() {
        let last = performance.now();
        const update = (now) => {
            const dt = (now - last) / 16.67; last = now;
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.life -= p.decay * dt;
                if (p.life <= 0) { p.element.remove(); this.returnParticleToPool(p.element); this.particles.splice(i, 1); continue; }
                p.x += p.vx * dt; p.y += p.vy * dt;
                p.element.style.opacity = p.life; p.element.style.left = `${p.x}px`; p.element.style.top = `${p.y}px`;
            }
            this.animationFrame = requestAnimationFrame(update);
        };
        this.animationFrame = requestAnimationFrame(update);
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        if (this.cursor) this.cursor.remove();
        if (this.particleContainer) this.particleContainer.remove();
        document.body.classList.remove('custom-cursor-active');
        this.particles = []; this.particlePool = []; this.isActive = false;
    }
}

export const cursorManager = new CursorManager();
export default cursorManager;
