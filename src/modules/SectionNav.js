/**
 * SectionNav - Section Navigation Component
 * The Heart of Gold
 * Updated: Properly hidden on mobile devices
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';
import sfxManager from '../utils/SFXManager.js';

gsap.registerPlugin(ScrollTrigger);

class SectionNav {
    constructor() {
        this.container = null;
        this.currentSection = 0;
        this.sections = [
            { id: 'home-hero', number: '01', label: 'Home' },
            { id: 'home-news-section', number: '02', label: 'News' },
            { id: 'overview-section', number: '03', label: 'Overview' },
            { id: 'characters-section', number: '04', label: 'Characters' }
        ];
        this.isAnimating = false;
        this.scrollTriggers = [];
        this.isMobile = false;
    }

    /**
     * Check if device is mobile/tablet
     */
    checkMobile() {
        // Check screen width
        const isSmallScreen = window.innerWidth <= 1023;
        
        // Check for touch capability
        const isTouchDevice = 'ontouchstart' in window || 
                             navigator.maxTouchPoints > 0 ||
                             navigator.msMaxTouchPoints > 0;
        
        // Check media query for coarse pointer (touch)
        const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
        
        this.isMobile = isSmallScreen || (isTouchDevice && isCoarsePointer);
        
        return this.isMobile;
    }

    create(scrollContainer) {
        // Check if mobile - don't create on mobile devices
        if (this.checkMobile()) {
            console.log('SectionNav: Hidden on mobile device');
            return this;
        }
        
        this.scrollContainer = scrollContainer;
        
        this.container = document.createElement('div');
        this.container.className = 'section-nav';
        
        this.container.innerHTML = `
            <div class="section-nav-dots">
                ${this.sections.map((s, i) => `
                    <button class="section-dot clickable ${i === 0 ? 'active' : ''}" 
                            data-index="${i}" 
                            data-section="${s.id}"
                            aria-label="${s.label}">
                        <span class="dot-number">${s.number}</span>
                    </button>
                `).join('')}
            </div>
        `;
        
        document.body.appendChild(this.container);
        this.bindEvents();
        this.initScrollTriggers();
        this.setInitialState();
        
        // Listen for resize to hide/show
        this.handleResize = this.onResize.bind(this);
        window.addEventListener('resize', this.handleResize, { passive: true });
        
        return this;
    }

    /**
     * Handle window resize
     */
    onResize() {
        const wasMobile = this.isMobile;
        this.checkMobile();
        
        if (this.container) {
            if (this.isMobile && !wasMobile) {
                // Became mobile - hide
                gsap.to(this.container, { 
                    opacity: 0, 
                    x: 30, 
                    duration: 0.3,
                    onComplete: () => {
                        this.container.style.display = 'none';
                    }
                });
            } else if (!this.isMobile && wasMobile) {
                // Became desktop - show
                this.container.style.display = 'block';
                gsap.to(this.container, { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.3 
                });
            }
        }
    }

    setInitialState() {
        if (!this.container) return;
        gsap.set(this.container, { opacity: 0, x: 30 });
        gsap.set(this.container.querySelectorAll('.section-dot'), { opacity: 0, scale: 0.5 });
    }

    show() {
        // Don't show on mobile
        if (this.isMobile || !this.container) {
            return gsap.timeline();
        }
        
        const dots = this.container.querySelectorAll('.section-dot');
        const tl = gsap.timeline();
        tl.to(this.container, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' })
          .to(dots, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' }, '-=0.3');
        return tl;
    }

    bindEvents() {
        if (!this.container) return;
        
        this.container.querySelectorAll('.section-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                sfxManager.playCheck1();
                const index = parseInt(dot.dataset.index);
                this.navigateToSection(index);
            });
        });
    }

    initScrollTriggers() {
        if (!this.scrollContainer || this.isMobile) return;
        
        this.sections.forEach((section, index) => {
            const element = document.getElementById(section.id) || document.querySelector(`.${section.id}`);
            if (element) {
                const trigger = ScrollTrigger.create({
                    trigger: element, 
                    scroller: this.scrollContainer,
                    start: 'top center', 
                    end: 'bottom center',
                    onEnter: () => this.setActiveSection(index),
                    onEnterBack: () => this.setActiveSection(index)
                });
                this.scrollTriggers.push(trigger);
            }
        });
    }

    navigateToSection(index) {
        if (this.isAnimating || index === this.currentSection || !this.scrollContainer) return;
        this.isAnimating = true;
        
        const section = this.sections[index];
        const element = document.getElementById(section.id) || document.querySelector(`.${section.id}`);
        
        if (element) {
            gsap.to(this.scrollContainer, {
                scrollTop: element.offsetTop,
                duration: 1,
                ease: 'power2.inOut',
                onComplete: () => { this.isAnimating = false; }
            });
            this.setActiveSection(index);
        } else {
            this.isAnimating = false;
        }
    }

    setActiveSection(index) {
        if (index === this.currentSection || !this.container) return;
        this.currentSection = index;
        
        this.container.querySelectorAll('.section-dot').forEach((dot, i) => {
            const isActive = i === index;
            if (isActive && !dot.classList.contains('active')) {
                dot.classList.add('active');
                gsap.timeline()
                    .to(dot, { scale: 0.85, duration: 0.1, ease: 'power2.in' })
                    .to(dot, { scale: 1.2, duration: 0.2, ease: 'back.out(3)' })
                    .to(dot, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.4)' });
            } else if (!isActive) {
                dot.classList.remove('active');
            }
        });
    }

    addSection(id, number, label) {
        this.sections.push({ id, number, label });
    }

    destroy() {
        this.scrollTriggers.forEach(st => st.kill());
        
        if (this.handleResize) {
            window.removeEventListener('resize', this.handleResize);
        }
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const sectionNav = new SectionNav();
export default sectionNav;
