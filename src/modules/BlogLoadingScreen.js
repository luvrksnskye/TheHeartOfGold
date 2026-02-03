/**
 * BlogLoadingScreen - Loading screen for blog transitions
 * The Heart of Gold
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import audioManager from '../utils/AudioManager.js';

class BlogLoadingScreen {
    constructor() {
        this.container = null;
        this.animations = [];
        this.messageInterval = null;
        this.minDisplayTime = 40000;
        this.startTime = null;
        this.blogTitle = '';
        
        this.splashMessages = [
            { text: 'Loading awesomeness...', effect: 'normal' },
            { text: 'Shiori is dancing for you!', effect: 'normal' },
            { text: 'Colors!!', effect: 'rainbow' },
            { text: 'Almost there...', effect: 'normal' },
            { text: 'Pixelated perfection!', effect: 'pixel' },
            { text: 'Did you know? Shiori loves to dance!', effect: 'normal' },
            { text: 'SPARKLES', effect: 'sparkle' },
            { text: 'Loading the fun...', effect: 'normal' },
            { text: 'Wooooo!!', effect: 'wave' },
            { text: 'Magic happening...', effect: 'rainbow' },
            { text: 'Grab a snack!', effect: 'normal' },
            { text: 'PARTY TIME', effect: 'bounce' },
            { text: 'Stay awesome!', effect: 'normal' },
            { text: 'Vibing...', effect: 'wave' }
        ];
    }

    create(blogTitle = 'Loading Blog...') {
        // Cleanup any existing instance
        if (this.container) {
            this.destroy();
        }

        this.startTime = Date.now();
        this.blogTitle = blogTitle;
        
        this.container = document.createElement('div');
        this.container.id = 'blog-loading-screen';
        this.container.className = 'blog-loading-screen';
        
        const initialMessage = this.getRandomMessage();
        
        this.container.innerHTML = `
            <div class="blog-loading-bg"></div>
            <div class="blog-loading-content">
                <div class="splash-message-container">
                    <p class="splash-message ${initialMessage.effect}">${this.renderMessage(initialMessage)}</p>
                </div>
                <div class="shiori-dance-container">
                    <img src="./src/characters/shiori-dancing.gif" alt="" class="shiori-dancing">
                    <div class="shiori-shadow"></div>
                </div>
                <div class="blog-loading-text-container">
                    <p class="blog-loading-title">${blogTitle}</p>
                    <p class="blog-loading-dots">
                        <span class="loading-dot">.</span>
                        <span class="loading-dot">.</span>
                        <span class="loading-dot">.</span>
                    </p>
                </div>
            </div>
        `;
        
        // Set initial hidden state
        gsap.set(this.container, { opacity: 0 });
        
        document.body.appendChild(this.container);
        
        this.initAnimations();
        this.startMessageRotation();
        this.playWaitingMusic();
        
        return this;
    }

    getRandomMessage() {
        return this.splashMessages[Math.floor(Math.random() * this.splashMessages.length)];
    }

    renderMessage(message) {
        const { text, effect } = message;
        
        const effectRenderers = {
            rainbow: () => this.createColoredText(text, ['#ff6b6b', '#ffa06b', '#ffd93d', '#6bff6b', '#6bffff', '#6b6bff', '#ff6bff']),
            wave: () => this.createAnimatedText(text, 'wave-letter', 0.08),
            bounce: () => this.createAnimatedText(text, 'bounce-letter', 0.05),
            sparkle: () => this.createAnimatedText(text, 'sparkle-letter', 0.12),
            pixel: () => this.createAnimatedText(text, 'pixel-letter', 0.06),
            normal: () => text
        };
        
        return (effectRenderers[effect] || effectRenderers.normal)();
    }

    createColoredText(text, colors) {
        let html = '';
        let colorIndex = 0;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === ' ') {
                html += '<span class="rainbow-letter space">&nbsp;</span>';
            } else {
                const color = colors[colorIndex % colors.length];
                html += `<span class="rainbow-letter" style="color: ${color}; animation-delay: ${i * 0.1}s;">${char}</span>`;
                colorIndex++;
            }
        }
        return html;
    }

    createAnimatedText(text, className, delay) {
        let html = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === ' ') {
                html += `<span class="${className} space">&nbsp;</span>`;
            } else {
                html += `<span class="${className}" style="animation-delay: ${i * delay}s;">${char}</span>`;
            }
        }
        return html;
    }

    startMessageRotation() {
        this.messageInterval = setInterval(() => {
            this.showNextMessage();
        }, 2500);
    }

    showNextMessage() {
        const messageContainer = this.container?.querySelector('.splash-message');
        if (!messageContainer) return;
        
        const newMessage = this.getRandomMessage();
        
        gsap.to(messageContainer, {
            opacity: 0,
            y: -20,
            scale: 0.8,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                if (!this.container) return; // Check if destroyed
                
                messageContainer.className = `splash-message ${newMessage.effect}`;
                messageContainer.innerHTML = this.renderMessage(newMessage);
                
                gsap.fromTo(messageContainer,
                    { opacity: 0, y: 20, scale: 0.8 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        duration: 0.4, 
                        ease: 'back.out(1.7)'
                    }
                );
            }
        });
    }

    playWaitingMusic() {
        if (audioManager.isMusicEnabled()) {
            audioManager.playMusic('./src/music/waiting_theme.mp3', true);
        }
    }

    initAnimations() {
        this.animateBackground();
        this.animateShiori();
        this.animateDots();
        this.animateEntrance();
    }

    animateBackground() {
        const bg = this.container.querySelector('.blog-loading-bg');
        if (!bg) return;
        
        const anim = gsap.to(bg, {
            backgroundPosition: '200px 200px',
            duration: 15,
            ease: 'none',
            repeat: -1
        });
        this.animations.push(anim);
    }

    animateShiori() {
        const shiori = this.container.querySelector('.shiori-dancing');
        const shadow = this.container.querySelector('.shiori-shadow');
        if (!shiori || !shadow) return;
        
        const tl = gsap.timeline({ repeat: -1 });
        this.animations.push(tl);
        
        tl.to(shiori, {
            y: -8,
            duration: 0.4,
            ease: 'power2.out'
        })
        .to(shadow, {
            scale: 0.85,
            opacity: 0.4,
            duration: 0.4,
            ease: 'power2.out'
        }, '<')
        .to(shiori, {
            y: 0,
            duration: 0.4,
            ease: 'power2.in'
        })
        .to(shadow, {
            scale: 1,
            opacity: 0.6,
            duration: 0.4,
            ease: 'power2.in'
        }, '<');
    }

    animateDots() {
        const dots = this.container.querySelectorAll('.loading-dot');
        if (!dots.length) return;
        
        const tl = gsap.timeline({ repeat: -1 });
        this.animations.push(tl);
        
        dots.forEach((dot, i) => {
            tl.to(dot, {
                y: -8,
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            }, i * 0.15)
            .to(dot, {
                y: 0,
                opacity: 0.4,
                duration: 0.3,
                ease: 'power2.in'
            }, i * 0.15 + 0.3);
        });
        
        tl.to({}, { duration: 0.5 });
    }

    animateEntrance() {
        const content = this.container.querySelector('.blog-loading-content');
        const splashContainer = this.container.querySelector('.splash-message-container');
        const shioriContainer = this.container.querySelector('.shiori-dance-container');
        const textContainer = this.container.querySelector('.blog-loading-text-container');
        
        if (!content) return;
        
        gsap.set(content, { opacity: 0, scale: 0.9 });
        gsap.set(splashContainer, { opacity: 0, y: -30 });
        gsap.set(shioriContainer, { opacity: 0, y: 30, scale: 0.8 });
        gsap.set(textContainer, { opacity: 0, y: 20 });
        
        const tl = gsap.timeline();
        this.animations.push(tl);
        
        tl.to(content, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
        })
        .to(shioriContainer, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.7)'
        }, '-=0.2')
        .to(splashContainer, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'back.out(1.5)'
        }, '-=0.3')
        .to(textContainer, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, '-=0.2');
    }

    async show() {
        if (!this.container) return;
        
        return new Promise(resolve => {
            gsap.to(this.container, {
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out',
                onComplete: resolve
            });
        });
    }

    async hide() {
        if (!this.container) return;
        
        return new Promise(resolve => {
            gsap.to(this.container, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => {
                    this.destroy();
                    resolve();
                }
            });
        });
    }

    async waitMinimumTime() {
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, this.minDisplayTime - elapsed);
        
        if (remaining > 0) {
            await new Promise(resolve => setTimeout(resolve, remaining));
        }
    }

    destroy() {
        // Clear interval
        if (this.messageInterval) {
            clearInterval(this.messageInterval);
            this.messageInterval = null;
        }
        
        // Kill all animations
        this.animations.forEach(anim => anim?.kill?.());
        this.animations = [];
        
        // Remove from DOM
        if (this.container?.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        this.container = null;
        this.startTime = null;
    }
}

export const blogLoadingScreen = new BlogLoadingScreen();
export default blogLoadingScreen;
