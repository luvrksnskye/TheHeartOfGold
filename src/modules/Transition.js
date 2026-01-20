/**
 * Transition - Sistema de transiciones entre pantallas
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';

class Transition {
    constructor() {
        this.container = null;
        this.isTransitioning = false;
    }

    init() {
        this.container = document.createElement('div');
        this.container.id = 'transition-overlay';
        this.container.className = 'transition-overlay';
        
        this.container.innerHTML = `
            <div class="transition-slice transition-slice-1"></div>
            <div class="transition-slice transition-slice-2"></div>
            <div class="transition-slice transition-slice-3"></div>
            <div class="transition-slice transition-slice-4"></div>
            <div class="transition-slice transition-slice-5"></div>
            <div class="transition-slice transition-slice-6"></div>
        `;
        
        document.body.appendChild(this.container);
        
        gsap.set('.transition-slice', { 
            xPercent: -100,
            transformOrigin: 'left center'
        });
        
        return this;
    }

    async transitionIn() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const slices = this.container.querySelectorAll('.transition-slice');
        
        return new Promise(resolve => {
            gsap.to(slices, {
                xPercent: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power3.inOut',
                onComplete: () => {
                    resolve();
                }
            });
        });
    }

    async transitionOut() {
        const slices = this.container.querySelectorAll('.transition-slice');
        
        return new Promise(resolve => {
            gsap.to(slices, {
                xPercent: 100,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power3.inOut',
                onComplete: () => {
                    gsap.set(slices, { xPercent: -100 });
                    this.isTransitioning = false;
                    resolve();
                }
            });
        });
    }

    async fullTransition(onMiddle) {
        await this.transitionIn();
        if (onMiddle) await onMiddle();
        await this.transitionOut();
    }
}

export const transition = new Transition();
export default transition;
