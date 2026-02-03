/**
 * CoreAnimation - Centralized GPU-Optimized Animation System
 * The Heart of Gold
 * Optimized: Reduced motion support, will-change management, RAF loop
 * */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';

class CoreAnimation {
    constructor() {
        this.activeAnimations = new Map();
        this.willChangeElements = new Set();
        this.rafCallbacks = new Map();
        this.rafId = null;
        this.isRunning = false;
        this.frameCount = 0;
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Performance settings
        this.config = {
            willChangeTimeout: 300,
            maxWillChangeElements: 50,
            enableGPU: true,
            reducedMotion: false
        };
        
        this.init();
    }

    init() {
        // Check for reduced motion preference
        this.config.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Configure GSAP defaults for GPU optimization
        gsap.config({
            force3D: true,
            nullTargetWarn: false
        });
        
        // Set default GSAP properties for GPU acceleration
        gsap.defaults({
            ease: 'power2.out',
            overwrite: 'auto'
        });
        
        // Start RAF loop
        this.startLoop();
        
        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAll();
            } else {
                this.resumeAll();
            }
        });
    }

    /**
     * Prepare element for animation with will-change
     */
    prepareElement(element, properties = ['transform', 'opacity']) {
        if (!element || this.willChangeElements.has(element)) return;
        
        // Limit will-change elements for memory
        if (this.willChangeElements.size >= this.config.maxWillChangeElements) {
            const oldest = this.willChangeElements.values().next().value;
            this.cleanupElement(oldest);
        }
        
        element.style.willChange = properties.join(', ');
        element.style.backfaceVisibility = 'hidden';
        element.style.perspective = '1000px';
        
        this.willChangeElements.add(element);
    }

    /**
     * Clean up will-change after animation
     */
    cleanupElement(element, delay = 0) {
        if (!element) return;
        
        const cleanup = () => {
            element.style.willChange = 'auto';
            this.willChangeElements.delete(element);
        };
        
        if (delay > 0) {
            setTimeout(cleanup, delay);
        } else {
            cleanup();
        }
    }

    /**
     * GPU-optimized fade animation
     */
    fade(element, options = {}) {
        const {
            to = 1,
            duration = 0.4,
            ease = 'power2.out',
            delay = 0,
            onComplete = null
        } = options;
        
        this.prepareElement(element, ['opacity']);
        
        return gsap.to(element, {
            opacity: to,
            duration: this.config.reducedMotion ? 0.01 : duration,
            ease,
            delay,
            onComplete: () => {
                this.cleanupElement(element, this.config.willChangeTimeout);
                if (onComplete) onComplete();
            }
        });
    }

    /**
     * GPU-optimized transform animation
     */
    transform(element, options = {}) {
        const {
            x = 0,
            y = 0,
            scale = 1,
            rotation = 0,
            duration = 0.4,
            ease = 'power2.out',
            delay = 0,
            onComplete = null
        } = options;
        
        this.prepareElement(element, ['transform']);
        
        return gsap.to(element, {
            x,
            y,
            scale,
            rotation,
            duration: this.config.reducedMotion ? 0.01 : duration,
            ease,
            delay,
            force3D: true,
            onComplete: () => {
                this.cleanupElement(element, this.config.willChangeTimeout);
                if (onComplete) onComplete();
            }
        });
    }

    /**
     * Squishy bounce animation (characteristic of the game)
     */
    squish(element, options = {}) {
        const {
            intensity = 1,
            duration = 0.5,
            delay = 0,
            onComplete = null
        } = options;
        
        if (this.config.reducedMotion) {
            if (onComplete) onComplete();
            return gsap.timeline();
        }
        
        this.prepareElement(element, ['transform']);
        
        const tl = gsap.timeline({
            delay,
            onComplete: () => {
                this.cleanupElement(element, this.config.willChangeTimeout);
                if (onComplete) onComplete();
            }
        });
        
        tl.to(element, {
            scaleX: 1 + (0.15 * intensity),
            scaleY: 1 - (0.1 * intensity),
            duration: duration * 0.2,
            ease: 'power2.out',
            force3D: true
        })
        .to(element, {
            scaleX: 1 - (0.1 * intensity),
            scaleY: 1 + (0.12 * intensity),
            duration: duration * 0.15,
            ease: 'power2.in',
            force3D: true
        })
        .to(element, {
            scaleX: 1 + (0.05 * intensity),
            scaleY: 1 - (0.05 * intensity),
            duration: duration * 0.15,
            ease: 'power2.out',
            force3D: true
        })
        .to(element, {
            scaleX: 1,
            scaleY: 1,
            duration: duration * 0.5,
            ease: 'elastic.out(1, 0.4)',
            force3D: true
        });
        
        return tl;
    }

    /**
     * Bounce entrance animation
     */
    bounceIn(element, options = {}) {
        const {
            from = { y: 50, opacity: 0, scale: 0.8 },
            duration = 0.6,
            delay = 0,
            ease = 'back.out(1.7)',
            onComplete = null
        } = options;
        
        this.prepareElement(element, ['transform', 'opacity']);
        
        gsap.set(element, { ...from, force3D: true });
        
        return gsap.to(element, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: this.config.reducedMotion ? 0.01 : duration,
            delay,
            ease,
            force3D: true,
            onComplete: () => {
                this.cleanupElement(element, this.config.willChangeTimeout);
                if (onComplete) onComplete();
            }
        });
    }

    /**
     * Bounce exit animation
     */
    bounceOut(element, options = {}) {
        const {
            to = { y: -30, opacity: 0, scale: 0.9 },
            duration = 0.4,
            delay = 0,
            ease = 'power2.in',
            onComplete = null
        } = options;
        
        this.prepareElement(element, ['transform', 'opacity']);
        
        return gsap.to(element, {
            ...to,
            duration: this.config.reducedMotion ? 0.01 : duration,
            delay,
            ease,
            force3D: true,
            onComplete: () => {
                this.cleanupElement(element, this.config.willChangeTimeout);
                if (onComplete) onComplete();
            }
        });
    }

    /**
     * Stagger animation for multiple elements
     */
    stagger(elements, options = {}) {
        const {
            from = { y: 30, opacity: 0 },
            to = { y: 0, opacity: 1 },
            duration = 0.4,
            stagger = 0.08,
            delay = 0,
            ease = 'power2.out',
            onComplete = null
        } = options;
        
        const els = Array.from(elements);
        els.forEach(el => this.prepareElement(el, ['transform', 'opacity']));
        
        gsap.set(els, { ...from, force3D: true });
        
        return gsap.to(els, {
            ...to,
            duration: this.config.reducedMotion ? 0.01 : duration,
            stagger: this.config.reducedMotion ? 0 : stagger,
            delay,
            ease,
            force3D: true,
            onComplete: () => {
                els.forEach(el => this.cleanupElement(el, this.config.willChangeTimeout));
                if (onComplete) onComplete();
            }
        });
    }

    /**
     * Letter-by-letter text animation
     */
    animateText(element, options = {}) {
        const {
            duration = 0.4,
            stagger = 0.04,
            delay = 0,
            from = { y: 20, opacity: 0, rotateX: -90 },
            ease = 'back.out(1.5)',
            onComplete = null
        } = options;
        
        if (this.config.reducedMotion) {
            if (onComplete) onComplete();
            return gsap.timeline();
        }
        
        const text = element.textContent;
        element.innerHTML = text.split('').map(char => 
            char === ' ' 
                ? '<span class="anim-char space">&nbsp;</span>'
                : `<span class="anim-char">${char}</span>`
        ).join('');
        
        const chars = element.querySelectorAll('.anim-char:not(.space)');
        chars.forEach(char => this.prepareElement(char, ['transform', 'opacity']));
        
        gsap.set(chars, { ...from, force3D: true });
        
        return gsap.to(chars, {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration,
            stagger,
            delay,
            ease,
            force3D: true,
            onComplete: () => {
                chars.forEach(char => this.cleanupElement(char, this.config.willChangeTimeout));
                if (onComplete) onComplete();
            }
        });
    }

    /**
     * Shimmer effect animation
     */
    shimmer(element, options = {}) {
        const {
            duration = 0.7,
            delay = 0,
            onComplete = null
        } = options;
        
        if (this.config.reducedMotion) {
            if (onComplete) onComplete();
            return gsap.timeline();
        }
        
        this.prepareElement(element, ['transform', 'opacity']);
        
        const tl = gsap.timeline({
            delay,
            onComplete: () => {
                this.cleanupElement(element, this.config.willChangeTimeout);
                if (onComplete) onComplete();
            }
        });
        
        tl.set(element, { x: '-120%', opacity: 0 })
          .to(element, { opacity: 1, duration: 0.05 })
          .to(element, { x: '250%', duration, ease: 'power1.in' })
          .to(element, { opacity: 0, duration: 0.1 });
        
        return tl;
    }

    /**
     * Pulse glow effect
     */
    pulseGlow(element, options = {}) {
        const {
            scale = 1.1,
            duration = 2,
            repeat = -1,
            yoyo = true
        } = options;
        
        if (this.config.reducedMotion) return null;
        
        this.prepareElement(element, ['transform', 'filter']);
        
        return gsap.to(element, {
            scale,
            filter: 'brightness(1.2)',
            duration,
            repeat,
            yoyo,
            ease: 'sine.inOut',
            force3D: true
        });
    }

    /**
     * Register RAF callback
     */
    onFrame(id, callback) {
        this.rafCallbacks.set(id, callback);
    }

    /**
     * Remove RAF callback
     */
    offFrame(id) {
        this.rafCallbacks.delete(id);
    }

    /**
     * Start animation loop
     */
    startLoop() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.tick();
    }

    /**
     * Animation tick
     */
    tick() {
        if (!this.isRunning) return;
        
        const now = performance.now();
        this.deltaTime = (now - this.lastTime) / 1000;
        this.lastTime = now;
        this.frameCount++;
        
        // Execute RAF callbacks
        this.rafCallbacks.forEach((callback, id) => {
            try {
                callback(this.deltaTime, this.frameCount);
            } catch (e) {
                console.warn(`Animation callback ${id} error:`, e);
            }
        });
        
        this.rafId = requestAnimationFrame(() => this.tick());
    }

    /**
     * Stop animation loop
     */
    stopLoop() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    /**
     * Pause all animations
     */
    pauseAll() {
        gsap.globalTimeline.pause();
    }

    /**
     * Resume all animations
     */
    resumeAll() {
        gsap.globalTimeline.resume();
    }

    /**
     * Kill all animations on element
     */
    kill(element) {
        gsap.killTweensOf(element);
        this.cleanupElement(element);
    }

    /**
     * Kill all active animations
     */
    killAll() {
        gsap.killTweensOf('*');
        this.willChangeElements.forEach(el => {
            el.style.willChange = 'auto';
        });
        this.willChangeElements.clear();
    }

    /**
     * Create reusable timeline
     */
    createTimeline(options = {}) {
        return gsap.timeline({
            paused: options.paused || false,
            defaults: {
                duration: 0.4,
                ease: 'power2.out',
                force3D: true
            },
            ...options
        });
    }

    /**
     * Get GSAP instance for advanced usage
     */
    getGSAP() {
        return gsap;
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        this.stopLoop();
        this.killAll();
        this.rafCallbacks.clear();
        this.activeAnimations.clear();
    }
}

export const coreAnimation = new CoreAnimation();
export default coreAnimation;