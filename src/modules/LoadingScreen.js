/**
 * LoadingScreen - Pantalla de carga con configuracion de audio
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import audioManager from '../utils/AudioManager.js';

class LoadingScreen {
    constructor() {
        this.container = null;
        this.textAnimation = null;
        this.bgAnimation = null;
    }

    create() {
        this.container = document.createElement('div');
        this.container.id = 'loading-screen';
        this.container.className = 'loading-screen';
        
        const text = 'LOADING NOW';
        const letters = text.split('').map((char, i) => {
            if (char === ' ') {
                return `<span class="loading-letter space" data-index="${i}">&nbsp;</span>`;
            }
            return `<span class="loading-letter" data-index="${i}">${char}</span>`;
        }).join('');
        
        const musicEnabled = audioManager.isMusicEnabled();
        const sfxEnabled = audioManager.isSfxEnabled();
        
        this.container.innerHTML = `
            <div class="loading-bg-pattern"></div>
            <div class="loading-audio-toggles">
                <button class="audio-toggle music-toggle ${musicEnabled ? 'active' : ''}" data-type="music" aria-label="Toggle Music">
                    <img src="./src/assets/${musicEnabled ? 'musicon' : 'musicoff'}.png" alt="" class="toggle-icon">
                </button>
                <button class="audio-toggle sfx-toggle ${sfxEnabled ? 'active' : ''}" data-type="sfx" aria-label="Toggle Sound Effects">
                    <img src="./src/assets/${sfxEnabled ? 'soundon' : 'soundoff'}.png" alt="" class="toggle-icon">
                </button>
            </div>
            <div class="loading-corner">
                <div class="loading-text">${letters}</div>
                <img src="./src/assets/loading.gif" alt="" class="loading-gif">
            </div>
            <div class="loading-progress">
                <div class="loading-progress-bar"></div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        this.initAnimations();
        this.bindAudioToggles();
        return this;
    }

    bindAudioToggles() {
        const toggles = this.container.querySelectorAll('.audio-toggle');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const type = toggle.dataset.type;
                const isActive = toggle.classList.contains('active');
                const newState = !isActive;
                
                if (type === 'music') {
                    audioManager.enableMusic(newState);
                    const icon = toggle.querySelector('.toggle-icon');
                    icon.src = `./src/assets/${newState ? 'musicon' : 'musicoff'}.png`;
                } else {
                    audioManager.enableSfx(newState);
                    const icon = toggle.querySelector('.toggle-icon');
                    icon.src = `./src/assets/${newState ? 'soundon' : 'soundoff'}.png`;
                }
                
                toggle.classList.toggle('active', newState);
                
                gsap.fromTo(toggle, 
                    { scale: 0.8 },
                    { 
                        scale: 1,
                        duration: 0.4,
                        ease: 'elastic.out(1, 0.5)'
                    }
                );
            });
        });
    }

    initAnimations() {
        this.animateBackground();
        this.animateText();
        this.animateToggles();
    }

    animateToggles() {
        const toggles = this.container.querySelectorAll('.audio-toggle');
        gsap.fromTo(toggles, 
            { opacity: 0, scale: 0.5, y: -20 },
            { 
                opacity: 1, 
                scale: 1, 
                y: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: 'back.out(1.7)',
                delay: 0.5
            }
        );
    }

    animateBackground() {
        const bg = this.container.querySelector('.loading-bg-pattern');
        
        this.bgAnimation = gsap.to(bg, {
            backgroundPosition: '300px 300px',
            duration: 12,
            ease: 'none',
            repeat: -1
        });
    }

    animateText() {
        const letters = this.container.querySelectorAll('.loading-letter:not(.space)');
        
        this.textAnimation = gsap.timeline({ repeat: -1 });
        
        letters.forEach((letter, index) => {
            this.textAnimation.to(letter, {
                y: -18,
                scaleY: 1.25,
                scaleX: 0.85,
                duration: 0.15,
                ease: 'power2.out'
            }, index * 0.08)
            .to(letter, {
                y: 0,
                scaleY: 0.8,
                scaleX: 1.15,
                duration: 0.1,
                ease: 'power2.in'
            }, index * 0.08 + 0.15)
            .to(letter, {
                y: 0,
                scaleY: 1,
                scaleX: 1,
                duration: 0.25,
                ease: 'elastic.out(1, 0.4)'
            }, index * 0.08 + 0.25);
        });
        
        this.textAnimation.to({}, { duration: 0.8 });
    }

    updateProgress(progress) {
        const progressBar = this.container.querySelector('.loading-progress-bar');
        gsap.to(progressBar, {
            width: `${progress}%`,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    async show() {
        gsap.set(this.container, { opacity: 0 });
        
        return new Promise(resolve => {
            gsap.to(this.container, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
                onComplete: resolve
            });
        });
    }

    async hide() {
        return new Promise(resolve => {
            gsap.to(this.container, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => {
                    this.destroy();
                    resolve();
                }
            });
        });
    }

    destroy() {
        if (this.textAnimation) this.textAnimation.kill();
        if (this.bgAnimation) this.bgAnimation.kill();
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const loadingScreen = new LoadingScreen();
export default loadingScreen;
