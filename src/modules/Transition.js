/**
 * Transition - Screen transition system
 * The Heart of Gold
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';

class Transition {
    constructor() {
        this.container = null;
        this.slices = null;
        this.isTransitioning = false;
        this.transitionPromise = null;
        this.currentTimeline = null;
    }

    init() {
        // Prevent double initialization
        if (this.container) return this;
        
        this.container = document.createElement('div');
        this.container.id = 'transition-overlay';
        this.container.className = 'transition-overlay';
        
        // Create slices
        const sliceCount = 6;
        let html = '';
        for (let i = 1; i <= sliceCount; i++) {
            html += `<div class="transition-slice transition-slice-${i}"></div>`;
        }
        this.container.innerHTML = html;
        
        document.body.appendChild(this.container);
        
        this.slices = this.container.querySelectorAll('.transition-slice');
        
        // Set initial state with GPU-optimized properties
        gsap.set(this.slices, { 
            xPercent: -100,
            transformOrigin: 'left center',
            force3D: true,
            willChange: 'transform'
        });
        
        // Ensure container doesn't block interactions when not transitioning
        gsap.set(this.container, { 
            pointerEvents: 'none',
            visibility: 'visible'
        });
        
        return this;
    }

    async transitionIn() {
        // Prevent overlapping transitions
        if (this.isTransitioning) {
            console.warn('Transition already in progress');
            return this.transitionPromise;
        }
        
        this.isTransitioning = true;
        
        // Kill any existing timeline
        if (this.currentTimeline) {
            this.currentTimeline.kill();
        }
        
        // Enable pointer events during transition
        gsap.set(this.container, { pointerEvents: 'all' });
        
        this.transitionPromise = new Promise(resolve => {
            this.currentTimeline = gsap.timeline({
                onComplete: () => {
                    resolve();
                }
            });
            
            this.currentTimeline.to(this.slices, {
                xPercent: 0,
                duration: 0.5,
                stagger: 0.06,
                ease: 'power3.inOut',
                force3D: true
            });
        });
        
        return this.transitionPromise;
    }

    async transitionOut() {
        if (!this.isTransitioning) {
            console.warn('No transition in progress to complete');
            return Promise.resolve();
        }
        
        // Kill any existing timeline
        if (this.currentTimeline) {
            this.currentTimeline.kill();
        }
        
        return new Promise(resolve => {
            this.currentTimeline = gsap.timeline({
                onComplete: () => {
                    // Reset slices position for next transition
                    gsap.set(this.slices, { 
                        xPercent: -100,
                        force3D: true
                    });
                    
                    // Disable pointer events when done
                    gsap.set(this.container, { pointerEvents: 'none' });
                    
                    this.isTransitioning = false;
                    this.transitionPromise = null;
                    this.currentTimeline = null;
                    
                    resolve();
                }
            });
            
            this.currentTimeline.to(this.slices, {
                xPercent: 100,
                duration: 0.5,
                stagger: 0.06,
                ease: 'power3.inOut',
                force3D: true
            });
        });
    }

    async fullTransition(onMiddle) {
        await this.transitionIn();
        
        if (onMiddle) {
            try {
                await onMiddle();
            } catch (e) {
                console.error('Error during transition callback:', e);
            }
        }
        
        await this.transitionOut();
    }

    // Force complete any pending transition
    forceComplete() {
        if (this.currentTimeline) {
            this.currentTimeline.progress(1);
            this.currentTimeline.kill();
        }
        
        gsap.set(this.slices, { 
            xPercent: -100,
            force3D: true
        });
        
        gsap.set(this.container, { pointerEvents: 'none' });
        
        this.isTransitioning = false;
        this.transitionPromise = null;
        this.currentTimeline = null;
    }

    isActive() {
        return this.isTransitioning;
    }

    destroy() {
        this.forceComplete();
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        this.container = null;
        this.slices = null;
    }
}

export const transition = new Transition();
export default transition;
