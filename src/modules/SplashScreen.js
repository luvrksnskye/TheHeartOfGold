/**
 * SplashScreen - Pantalla inicial con logo de Unity
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import stateManager, { AppStates } from '../utils/StateManager.js';

class SplashScreen {
    constructor() {
        this.container = null;
        this.timeline = null;
    }

    create() {
        this.container = document.createElement('div');
        this.container.id = 'splash-screen';
        this.container.className = 'splash-screen';
        
        this.container.innerHTML = `
            <div class="splash-content">
                <img src="./src/assets/unity.png" alt="Unity" class="unity-logo" id="unity-logo">
                <img src="./src/assets/unity_logo.gif" alt="" class="unity-gif" id="unity-gif">
            </div>
        `;
        
        document.body.appendChild(this.container);
        return this;
    }

    async play() {
        const gif = this.container.querySelector('#unity-gif');
        const logo = this.container.querySelector('#unity-logo');
        
        gsap.set(gif, { opacity: 0, scale: 0.8 });
        gsap.set(logo, { opacity: 0, y: -20 });

        this.timeline = gsap.timeline();

        this.timeline
            .to(gif, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power2.out'
            })
            .to(gif, {
                opacity: 1,
                duration: 2
            })
            .to(logo, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out'
            })
            .to({}, {
                duration: 2
            })
            .to([gif, logo], {
                opacity: 0,
                duration: 0.6,
                ease: 'power2.in'
            });

        return new Promise(resolve => {
            this.timeline.eventCallback('onComplete', () => {
                resolve();
            });
        });
    }

    destroy() {
        if (this.timeline) {
            this.timeline.kill();
        }
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const splashScreen = new SplashScreen();
export default splashScreen;
