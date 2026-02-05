/**
 * OverviewSection - Game Overview with Video Background
 * The Heart of Gold
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';
import coreAnimation from '../utils/CoreAnimation.js';
import gameFeatures from './GameFeatures.js';
import charactersSection from './CharactersSection.js';

gsap.registerPlugin(ScrollTrigger);

class OverviewSection {
    constructor() {
        this.container = null;
        this.video = null;
        this.isVideoPlaying = false;
        this.scrollTriggers = [];
        this.timelines = [];
        
        this.storyContent = [
            { text: 'A <span class="highlight">Bullet Heaven</span> RPG with deep mechanics and high replayability.', position: 'center' },
            { text: 'Each character features a <span class="emphasis">unique combat style</span> with custom stat scaling, two active skills, one passive, and an ultimate ability.', position: 'left' },
            { text: 'Face <span class="highlight">thousands of enemies</span> across maps infested with creatures. Collect weapons, upgrade your equipment, and survive to face the final boss.', position: 'right' },
            { text: 'Between runs, explore <span class="emphasis">turn-based dungeons</span> using up to 14 characters divided into two teams of seven.', position: 'left' },
            { text: 'With <span class="highlight">18 unique characters</span> from different worlds, each with their own stories and voice acting in Spanish, English, and Japanese.', position: 'right' },
            { text: 'Run. Dodge. Fight. <span class="highlight">Survive.</span>', position: 'center' }
        ];
    }

    create(parent) {
        this.container = document.createElement('section');
        this.container.id = 'overview-section';
        this.container.className = 'overview-section';
        
        this.container.innerHTML = `
            <div class="overview-top-fade"></div>
            <div class="overview-video-part">
                <div class="overview-gradient-top"></div>
                <div class="overview-video-container">
                    <video class="overview-video" src="./src/video/first-trailer.mp4" muted loop playsinline preload="metadata"></video>
                    <div class="video-overlay"></div>
                </div>
                <div class="overview-particles">
                    <div class="particle"></div><div class="particle"></div><div class="particle"></div>
                    <div class="particle"></div><div class="particle"></div><div class="particle"></div>
                </div>
                <div class="overview-lines">
                    <div class="floating-line"></div><div class="floating-line"></div>
                    <div class="floating-line"></div><div class="floating-line"></div>
                </div>
                <div class="overview-content">
                    <header class="overview-header">
                        <div class="overview-title-wrapper">
                            <div class="overview-title-glow"></div>
                            <h2 class="overview-title">OVERVIEW</h2>
                        </div>
                        <p class="overview-subtitle">A Bullet Heaven Experience</p>
                    </header>
                    <div class="overview-story">
                        ${this.storyContent.map((block, i) => `
                            <div class="story-block ${block.position}" data-index="${i}">
                                <p class="story-text">${block.text}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="overview-divider">
                <div class="divider-gradient"></div>
            </div>
            <div class="features-wrapper"></div>
            <div class="characters-wrapper"></div>
            <div class="overview-bottom-fade"></div>
        `;
        
        parent.appendChild(this.container);
        this.video = this.container.querySelector('.overview-video');
        
        // Create Game Features
        gameFeatures.create(this.container.querySelector('.features-wrapper'));
        
        // Create Characters Section
        charactersSection.create(this.container.querySelector('.characters-wrapper'));
        
        this.setInitialStates();
        this.initScrollAnimations();
        this.initVideoControl();
        
        return this;
    }

    setInitialStates() {
        const header = this.container.querySelector('.overview-header');
        const storyBlocks = this.container.querySelectorAll('.story-block');
        const divider = this.container.querySelector('.overview-divider');
        
        gsap.set(header, { opacity: 0, y: 50 });
        gsap.set(storyBlocks, { opacity: 0, y: 40 });
        gsap.set(divider, { opacity: 0 });
    }

    initScrollAnimations() {
        const scroller = document.querySelector('.home-scroll-container');
        if (!scroller) return;
        
        const header = this.container.querySelector('.overview-header');
        const storyBlocks = this.container.querySelectorAll('.story-block');
        const divider = this.container.querySelector('.overview-divider');
        
        // Header animation
        const headerTrigger = ScrollTrigger.create({
            trigger: header, 
            scroller: scroller, 
            start: 'top 85%', 
            once: true,
            onEnter: () => {
                coreAnimation.bounceIn(header, { duration: 0.8 });
                const title = header.querySelector('.overview-title');
                if (title) {
                    coreAnimation.animateText(title, { delay: 0.3 });
                }
            }
        });
        this.scrollTriggers.push(headerTrigger);
        
        // Story blocks animation
        storyBlocks.forEach((block, index) => {
            const trigger = ScrollTrigger.create({
                trigger: block, 
                scroller: scroller, 
                start: 'top 80%', 
                once: true,
                onEnter: () => {
                    gsap.to(block, {
                        opacity: 1, 
                        y: 0, 
                        duration: 0.8, 
                        delay: index * 0.08, 
                        ease: 'power2.out',
                        onComplete: () => { 
                            block.classList.add('visible'); 
                            this.animateStoryText(block); 
                        }
                    });
                }
            });
            this.scrollTriggers.push(trigger);
        });
        
        // Divider animation
        const dividerTrigger = ScrollTrigger.create({
            trigger: divider, 
            scroller: scroller, 
            start: 'top 85%', 
            once: true,
            onEnter: () => this.animateDivider(divider)
        });
        this.scrollTriggers.push(dividerTrigger);
        
        // Initialize child component animations
        gameFeatures.initScrollAnimations(scroller);
        charactersSection.initScrollAnimations(scroller);
    }

    animateDivider(divider) {
        const line = divider.querySelector('.divider-line');
        const glow = divider.querySelector('.divider-glow');
        const dots = divider.querySelectorAll('.divider-dot');
        
        gsap.set(line, { scaleX: 0 });
        gsap.set(dots, { scale: 0, opacity: 0 });
        
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
        tl.to(divider, { opacity: 1, duration: 0.3 })
          .to(line, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' })
          .to(glow, { opacity: 1, duration: 0.5 }, '-=0.3')
          .to(dots, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' }, '-=0.3');
    }

    animateStoryText(block) {
        const textElement = block.querySelector('.story-text');
        if (!textElement) return;
        
        const originalHTML = textElement.innerHTML;
        const temp = document.createElement('div');
        temp.innerHTML = originalHTML;
        
        const processNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const words = node.textContent.split(/(\s+)/);
                const fragment = document.createDocumentFragment();
                words.forEach(word => {
                    if (word.trim()) {
                        const span = document.createElement('span');
                        span.className = 'story-word';
                        span.textContent = word;
                        fragment.appendChild(span);
                    } else if (word) {
                        fragment.appendChild(document.createTextNode(word));
                    }
                });
                return fragment;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const clone = node.cloneNode(false);
                Array.from(node.childNodes).forEach(child => {
                    const processed = processNode(child);
                    if (processed) clone.appendChild(processed);
                });
                return clone;
            }
            return null;
        };
        
        const processed = document.createDocumentFragment();
        Array.from(temp.childNodes).forEach(child => {
            const result = processNode(child);
            if (result) processed.appendChild(result);
        });
        
        textElement.innerHTML = '';
        textElement.appendChild(processed);
        
        coreAnimation.stagger(textElement.querySelectorAll('.story-word'), {
            from: { opacity: 0, y: 15 },
            to: { opacity: 1, y: 0 },
            duration: 0.3,
            stagger: 0.025,
            onComplete: () => {
                textElement.querySelectorAll('.story-word').forEach(w => w.classList.add('visible'));
            }
        });
    }

    initVideoControl() {
        const scroller = document.querySelector('.home-scroll-container');
        if (!scroller || !this.video) return;
        
        const videoPart = this.container.querySelector('.overview-video-part');
        const trigger = ScrollTrigger.create({
            trigger: videoPart, 
            scroller: scroller, 
            start: 'top 60%', 
            end: 'bottom 40%',
            onEnter: () => this.playVideo(),
            onLeave: () => this.pauseVideo(),
            onEnterBack: () => this.playVideo(),
            onLeaveBack: () => this.pauseVideo()
        });
        this.scrollTriggers.push(trigger);
    }

    playVideo() {
        if (!this.video || this.isVideoPlaying) return;
        
        this.video.play().then(() => {
            this.isVideoPlaying = true;
            this.video.classList.add('playing');
            coreAnimation.fade(this.video, { to: 0.4, duration: 1.5 });
        }).catch(() => {});
    }

    pauseVideo() {
        if (!this.video || !this.isVideoPlaying) return;
        
        coreAnimation.fade(this.video, { 
            to: 0, 
            duration: 1,
            onComplete: () => { 
                this.video.pause(); 
                this.isVideoPlaying = false; 
                this.video.classList.remove('playing'); 
            }
        });
    }

    destroy() {
        this.scrollTriggers.forEach(st => st.kill());
        this.timelines.forEach(tl => tl && tl.kill && tl.kill());
        
        if (this.video) { 
            this.video.pause(); 
            this.video.src = ''; 
        }
        
        gameFeatures.destroy();
        charactersSection.destroy();
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const overviewSection = new OverviewSection();
export default overviewSection;