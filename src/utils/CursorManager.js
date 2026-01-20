/**
 * CursorManager - Cursor personalizado con efectos de particulas
 */

class CursorManager {
    constructor() {
        this.cursor = null;
        this.particleContainer = null;
        this.isHovering = false;
        this.particles = [];
        this.animationFrame = null;
    }

    init() {
        this.createCursor();
        this.createParticleContainer();
        this.bindEvents();
        this.startParticleLoop();
        document.body.classList.add('custom-cursor-active');
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.innerHTML = `<img src="./src/assets/Cursor.png" alt="" class="cursor-image">`;
        document.body.appendChild(this.cursor);
    }

    createParticleContainer() {
        this.particleContainer = document.createElement('div');
        this.particleContainer.className = 'particle-container';
        document.body.appendChild(this.particleContainer);
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            if (this.isClickable(target)) {
                this.isHovering = true;
                this.cursor.classList.add('hovering');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target;
            if (this.isClickable(target)) {
                this.isHovering = false;
                this.cursor.classList.remove('hovering');
            }
        });
    }

    isClickable(element) {
        if (!element) return false;
        const clickableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
        const hasClickableClass = element.classList && (
            element.classList.contains('clickable') ||
            element.classList.contains('audio-toggle') ||
            element.classList.contains('nav-link')
        );
        const hasOnClick = element.onclick !== null;
        const isClickableTag = clickableTags.includes(element.tagName);
        const hasPointerCursor = window.getComputedStyle(element).cursor === 'pointer';
        
        return isClickableTag || hasClickableClass || hasOnClick || hasPointerCursor;
    }

    onMouseMove(e) {
        if (this.cursor) {
            this.cursor.style.left = `${e.clientX}px`;
            this.cursor.style.top = `${e.clientY}px`;
        }

        if (this.isHovering && Math.random() > 0.6) {
            this.createParticle(e.clientX, e.clientY);
        }
    }

    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        const size = Math.random() * 4 + 2;
        
        particle.style.left = `${x + offsetX}px`;
        particle.style.top = `${y + offsetY}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        this.particleContainer.appendChild(particle);
        
        const particleData = {
            element: particle,
            life: 1,
            decay: 0.02 + Math.random() * 0.02,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 2 - 1
        };
        
        this.particles.push(particleData);
    }

    startParticleLoop() {
        const update = () => {
            this.particles = this.particles.filter(p => {
                p.life -= p.decay;
                p.element.style.opacity = p.life;
                
                const currentX = parseFloat(p.element.style.left);
                const currentY = parseFloat(p.element.style.top);
                p.element.style.left = `${currentX + p.vx}px`;
                p.element.style.top = `${currentY + p.vy}px`;
                
                if (p.life <= 0) {
                    p.element.remove();
                    return false;
                }
                return true;
            });
            
            this.animationFrame = requestAnimationFrame(update);
        };
        
        update();
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.cursor) this.cursor.remove();
        if (this.particleContainer) this.particleContainer.remove();
        document.body.classList.remove('custom-cursor-active');
    }
}

export const cursorManager = new CursorManager();
export default cursorManager;
