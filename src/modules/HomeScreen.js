/**
 * HomeScreen - Pantalla principal del juego
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import audioManager from '../utils/AudioManager.js';

class HomeScreen {
    constructor() {
        this.container = null;
    }

    create() {
        this.container = document.createElement('div');
        this.container.id = 'home-screen';
        this.container.className = 'home-screen';
        
        this.container.innerHTML = `
            <img src="./src/assets/menu_bg2x3.gif" alt="" class="home-bg">
            <div class="home-content">
                <img src="./src/assets/Logo_main.svg" alt="The Heart of Golden" class="home-logo">
                <p class="home-subtitle">Demo Available Now</p>
            </div>
        `;
        
        document.body.appendChild(this.container);
        gsap.set(this.container, { opacity: 0 });
        return this;
    }

    async show() {
        const logo = this.container.querySelector('.home-logo');
        const subtitle = this.container.querySelector('.home-subtitle');
        
        gsap.set(logo, { opacity: 0, scale: 0.3, y: 50 });
        gsap.set(subtitle, { opacity: 0, y: 30 });
        
        if (audioManager.isMusicEnabled()) {
            audioManager.playMusic('./src/music/day2theme.mp3', true);
        }
        
        return new Promise(resolve => {
            const tl = gsap.timeline({ onComplete: resolve });
            
            tl.to(this.container, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            })
            .to(logo, {
                opacity: 1,
                scale: 1.1,
                y: 0,
                duration: 0.5,
                ease: 'back.out(2)'
            }, '-=0.2')
            .to(logo, {
                scale: 0.95,
                duration: 0.15,
                ease: 'power2.in'
            })
            .to(logo, {
                scale: 1.02,
                duration: 0.12,
                ease: 'power2.out'
            })
            .to(logo, {
                scale: 1,
                duration: 0.2,
                ease: 'elastic.out(1, 0.5)'
            })
            .to(subtitle, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.3');
        });
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const homeScreen = new HomeScreen();
export default homeScreen;
