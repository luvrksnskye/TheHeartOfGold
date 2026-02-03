/**
 * CoreAnimation - Centralized GPU-Optimized Animation System
 * The Heart of Gold
 * Optimized: Better memory management, animation pooling, cleanup
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';

class CoreAnimation {
    constructor() {
        this.activeAnimations = new Map();
        this.willChangeElements = new WeakSet();
        this.willChangeCleanupTimers = new WeakMap();
        this.rafCallbacks = new Map();
        this.rafId = null;
        this.isRunning = false;
        this.frameCount = 0;
        this.lastTime = 0;
        this.deltaTime = 0;
        
        this.config = {
            willChangeTimeout: 300,
            maxConcurrentAnimations: 100,
            enableGPU: true,
            reducedMotion: false
        };
    }

    init() {
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.config.reducedMotion = mediaQuery.matches;
        
        // Listen for changes
        mediaQuery.addEventListener('change', (e) => {
            this.config.reducedMotion = e.matches;
        });
        
        // Configure GSAP defaults for GPU optimization
        gsap.config({
            force3D: true,
            nullTargetWarn: false
        });
        
        gsap.defaults({
            ease: 'power2.out',
            overwrite: 'auto'
        });
        
        // Start RAF loop
        this.startLoop();
        
        // Handle visibility changes
        this.handleVisibility = this.handleVisibility.bind(this);
        document.addEventListener('visibilitychange', this.handleVisibility);
    }

    handleVisibility() {
        if (document.hidden) {
            this.pauseAll();
        } else {
            this.resumeAll();
        }
    }

    /**
     * Prepare element for animation with will-change
     */
    prepareElement(element, properties = ['transform', 'opacity']) {
        if (!element || this.willChangeElements.has(element)) return;
        
        // Set will-change
        element.style.willChange = properties.join(', ');
        element.style.backfaceVisibility = 'hidden';
        
        this.willChangeElements.add(element);
    }

    /**
     * Clean up will-change after animation
     */
    cleanupElement(element, delay = 0) {
        if (!element) return;
        
        // Clear any existing cleanup timer
        const existingTimer = this.willChangeCleanupTimers.get(element);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }
        
        const cleanup = () => {
            element.style.willChange = 'auto';
            this.willChangeCleanupTimers.delete(element);
        };
        
        if (delay > 0) {
            const timer = setTimeout(cleanup, delay);
            this.willChangeCleanupTimers.set(element, timer);
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
        
        const tween = gsap.to(element, {
            opacity: to,
            duration: this.config.reducedMotion ? 0.01 : duration,
            ease,
            delay,
            onComplete: () => {
                this.cleanupElement(element, this.config.willChangeTimeout);
                onComplete?.();
            }
        });
        
        return tween;
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
                onComplete?.();
            }
        });
    }

    /**
     * Squishy bounce animation
     */
    squish(element, options = {}) {
        const {
            intensity = 1,
            duration = 0.5,
            delay = 0,
            onComplete = null
        } = options;
        
        if (this.config.reducedMotion) {
            onComplete?.();
            return gsap.timeline();
        }
        
        this.prepareElement(element, ['transform']);
        
        const tl = gsap.timeline({
            delay,
            onComplete: () => {
                this.cleanupElement(element, this.config.willChangeTimeout);
                onComplete?.();
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
                onComplete?.();
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
                onComplete?.();
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
                onComplete?.();
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
            onComplete?.();
            return gsap.timeline();
        }
        
        this.prepareElement(element, ['transform', 'opacity']);
        
        const tl = gsap.timeline({
            delay,
            onComplete: () => {
                this.cleanupElement(element, this.config.willChangeTimeout);
                onComplete?.();
            }
        });
        
        tl.set(element, { x: '-120%', opacity: 0 })
          .to(element, { opacity: 1, duration: 0.05 })
          .to(element, { x: '250%', duration, ease: 'power1.in' })
          .to(element, { opacity: 0, duration: 0.1 });
        
        return tl;
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
        this.activeAnimations.clear();
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
     * Get GSAP instance
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
        document.removeEventListener('visibilitychange', this.handleVisibility);
    }
}

export const coreAnimation = new CoreAnimation();
export default coreAnimation;
