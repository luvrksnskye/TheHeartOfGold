/**
 * OverviewSection - Game Overview with Video Background
 * The Heart of Gold
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';

gsap.registerPlugin(ScrollTrigger);

class OverviewSection {
    constructor() {
        this.container = null;
        this.video = null;
        this.isVideoPlaying = false;
        this.scrollTriggers = [];
        this.wordAnimations = [];
        
        this.storyContent = [
            {
                text: 'A <span class="highlight">Bullet Heaven</span> RPG with deep mechanics and high replayability.',
                position: 'center',
                delay: 0
            },
            {
                text: 'Each character features a <span class="emphasis">unique combat style</span> with custom stat scaling, two active skills, one passive, and an ultimate ability.',
                position: 'left',
                delay: 0.2
            },
            {
                text: 'Face <span class="highlight">thousands of enemies</span> across maps infested with creatures. Collect weapons, upgrade your equipment, and survive to face the final boss.',
                position: 'right',
                delay: 0.2
            },
            {
                text: 'Between runs, explore <span class="emphasis">turn-based dungeons</span> using up to 14 characters divided into two teams of seven.',
                position: 'left',
                delay: 0.2
            },
            {
                text: 'With <span class="highlight">18 unique characters</span> from different worlds, each with their own stories and voice acting in Spanish, English, and Japanese.',
                position: 'right',
                delay: 0.2
            },
            {
                text: 'Run. Dodge. Fight. <span class="highlight">Survive.</span>',
                position: 'center',
                delay: 0.3
            }
        ];
    }

    create(parent) {
        this.container = document.createElement('section');
        this.container.id = 'overview-section';
        this.container.className = 'overview-section';
        
        this.container.innerHTML = `
            <div class="overview-gradient-top"></div>
            
            <div class="overview-video-container">
                <video 
                    class="overview-video" 
                    src="./src/video/first-trailer.mp4" 
                    muted 
                    loop 
                    playsinline
                    preload="metadata"
                ></video>
                <div class="video-overlay"></div>
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
            
            <div class="overview-gradient-bottom"></div>
        `;
        
        parent.appendChild(this.container);
        
        this.video = this.container.querySelector('.overview-video');
        
        this.setInitialStates();
        this.initScrollAnimations();
        this.initVideoControl();
        
        return this;
    }

    setInitialStates() {
        const header = this.container.querySelector('.overview-header');
        const storyBlocks = this.container.querySelectorAll('.story-block');
        const featureCards = this.container.querySelectorAll('.feature-card');
        
        gsap.set(header, { opacity: 0, y: 50 });
        gsap.set(storyBlocks, { opacity: 0, y: 40 });
        gsap.set(featureCards, { opacity: 0, y: 30, scale: 0.95 });
    }

    initScrollAnimations() {
        const scroller = document.querySelector('.home-scroll-container');
        if (!scroller) return;
        
        const header = this.container.querySelector('.overview-header');
        const storyBlocks = this.container.querySelectorAll('.story-block');
        const featureCards = this.container.querySelectorAll('.feature-card');
        
        // Header animation
        const headerTrigger = ScrollTrigger.create({
            trigger: header,
            scroller: scroller,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(header, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power2.out'
                });
                
                // Animate title letters
                const title = header.querySelector('.overview-title');
                if (title) {
                    this.animateTitle(title);
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
                onEnter: () => {
                    const delay = index * 0.1;
                    
                    gsap.to(block, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: delay,
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
        
        // Feature cards animation
        featureCards.forEach((card, index) => {
            const trigger = ScrollTrigger.create({
                trigger: card,
                scroller: scroller,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        delay: index * 0.15,
                        ease: 'back.out(1.5)',
                        onComplete: () => {
                            card.classList.add('visible');
                        }
                    });
                }
            });
            this.scrollTriggers.push(trigger);
        });
        
        // Parallax effect for decorative elements
        ScrollTrigger.create({
            trigger: this.container,
            scroller: scroller,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const particles = this.container.querySelectorAll('.particle');
                const lines = this.container.querySelectorAll('.floating-line');
                
                particles.forEach((p, i) => {
                    gsap.set(p, { 
                        y: (progress - 0.5) * (100 + i * 20)
                    });
                });
                
                lines.forEach((l, i) => {
                    gsap.set(l, { 
                        y: (progress - 0.5) * (80 + i * 15)
                    });
                });
            }
        });
    }

    animateTitle(titleElement) {
        const text = titleElement.textContent;
        titleElement.innerHTML = text.split('').map((char, i) => {
            if (char === ' ') return '<span class="title-char space">&nbsp;</span>';
            return `<span class="title-char" style="animation-delay: ${i * 0.05}s">${char}</span>`;
        }).join('');
        
        const chars = titleElement.querySelectorAll('.title-char:not(.space)');
        
        gsap.fromTo(chars, 
            { 
                opacity: 0, 
                y: 30, 
                rotateX: -90,
                transformOrigin: 'center bottom'
            },
            { 
                opacity: 1, 
                y: 0, 
                rotateX: 0,
                duration: 0.6, 
                stagger: 0.04,
                ease: 'back.out(1.7)'
            }
        );
    }

    animateStoryText(block) {
        const textElement = block.querySelector('.story-text');
        if (!textElement) return;
        
        // Store original HTML with highlights
        const originalHTML = textElement.innerHTML;
        
        // Create a temporary element to parse the HTML
        const temp = document.createElement('div');
        temp.innerHTML = originalHTML;
        
        // Process text nodes and wrap words while preserving span tags
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
        
        // Animate words
        const words = textElement.querySelectorAll('.story-word');
        
        gsap.fromTo(words,
            { opacity: 0, y: 15 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.3, 
                stagger: 0.03,
                ease: 'power2.out',
                onComplete: () => {
                    words.forEach(w => w.classList.add('visible'));
                }
            }
        );
    }

    initVideoControl() {
        const scroller = document.querySelector('.home-scroll-container');
        if (!scroller || !this.video) return;
        
        // Create scroll trigger for video playback
        ScrollTrigger.create({
            trigger: this.container,
            scroller: scroller,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => this.playVideo(),
            onLeave: () => this.pauseVideo(),
            onEnterBack: () => this.playVideo(),
            onLeaveBack: () => this.pauseVideo()
        });
        
        // Handle video loading
        this.video.addEventListener('loadeddata', () => {
            this.video.style.opacity = '0';
        });
        
        this.video.addEventListener('canplay', () => {
            // Video is ready to play
        });
    }

    playVideo() {
        if (!this.video || this.isVideoPlaying) return;
        
        this.video.play().then(() => {
            this.isVideoPlaying = true;
            this.video.classList.add('playing');
            
            gsap.to(this.video, {
                opacity: 0.25,
                duration: 1.5,
                ease: 'power2.out'
            });
        }).catch(err => {
            console.warn('Video autoplay failed:', err);
        });
    }

    pauseVideo() {
        if (!this.video || !this.isVideoPlaying) return;
        
        gsap.to(this.video, {
            opacity: 0,
            duration: 1,
            ease: 'power2.in',
            onComplete: () => {
                this.video.pause();
                this.isVideoPlaying = false;
                this.video.classList.remove('playing');
            }
        });
    }

    destroy() {
        this.scrollTriggers.forEach(st => st.kill());
        this.wordAnimations.forEach(tl => tl.kill());
        
        if (this.video) {
            this.video.pause();
            this.video.src = '';
        }
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const overviewSection = new OverviewSection();
export default overviewSection;
