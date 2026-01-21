import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';
import audioManager from '../utils/AudioManager.js';
import sakuraPetals from '../utils/SakuraPetals.js';
import newsCarousel from './NewsCarousel.js';

gsap.registerPlugin(ScrollTrigger);

class HomeScreen {
    constructor() { this.container = null; this.animationsStarted = false; this.petalsInitialized = false; }

    create() {
        this.container = document.createElement('div');
        this.container.id = 'home-screen';
        this.container.className = 'home-screen';
        const musicOn = audioManager.isMusicEnabled(), sfxOn = audioManager.isSfxEnabled();
        this.container.innerHTML = `<div class="home-scroll-container"><section class="home-hero"><img src="./src/assets/portada.png" alt="" class="home-bg"><div class="home-audio-toggles"><button class="audio-toggle music-toggle clickable ${musicOn ? 'active' : ''}" data-type="music" aria-label="Toggle Music"><img src="./src/assets/${musicOn ? 'musicon' : 'musicoff'}.png" alt="" class="toggle-icon"></button><button class="audio-toggle sfx-toggle clickable ${sfxOn ? 'active' : ''}" data-type="sfx" aria-label="Toggle Sound Effects"><img src="./src/assets/${sfxOn ? 'soundon' : 'soundoff'}.png" alt="" class="toggle-icon"></button></div><div class="home-content"><div class="logo-wrapper"><div class="logo-container"><img src="./src/assets/Logo_main.svg" alt="The Heart of Gold" class="home-logo"><div class="logo-shimmer"></div></div><div class="shooting-star"><div class="star-core"></div></div></div><p class="home-subtitle"></p></div></section><section class="home-news-section"><div class="news-gradient-overlay"></div><div class="news-content"><h2 class="news-title"><span class="news-arrow news-arrow-left">//</span><span class="news-title-text">Latest News</span><span class="news-arrow news-arrow-right">//</span></h2></div></section></div>`;
        document.body.appendChild(this.container);
        newsCarousel.create(this.container.querySelector('.news-content'));
        gsap.set(this.container, { opacity: 1 });
        this.setInitialStates();
        this.bindAudioToggles();
        return this;
    }

    setInitialStates() {
        const logo = this.container.querySelector('.home-logo'), shimmer = this.container.querySelector('.logo-shimmer'), star = this.container.querySelector('.shooting-star'), toggles = this.container.querySelectorAll('.audio-toggle');
        gsap.set(logo, { opacity: 0, scale: 0.3, y: 50 }); gsap.set(shimmer, { opacity: 0, x: '-120%' }); gsap.set(star, { opacity: 0, scale: 0 }); gsap.set(toggles, { opacity: 0, scale: 0.5, y: -20 });
    }

    bindAudioToggles() {
        this.container.querySelectorAll('.audio-toggle').forEach(t => {
            t.addEventListener('click', (e) => {
                e.stopPropagation();
                const type = t.dataset.type, active = t.classList.contains('active'), newState = !active;
                if (type === 'music') { audioManager.enableMusic(newState); t.querySelector('.toggle-icon').src = `./src/assets/${newState ? 'musicon' : 'musicoff'}.png`; if (newState) audioManager.playMusic('./src/music/day1theme_2.mp3', true); }
                else { audioManager.enableSfx(newState); t.querySelector('.toggle-icon').src = `./src/assets/${newState ? 'soundon' : 'soundoff'}.png`; }
                t.classList.toggle('active', newState);
                gsap.fromTo(t, { scale: 0.85 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

    async show() { if (audioManager.isMusicEnabled()) audioManager.playMusic('./src/music/day1theme_2.mp3', true); return Promise.resolve(); }

    initPetals() { if (this.petalsInitialized) return; const hero = this.container.querySelector('.home-hero'); if (hero && sakuraPetals.init(hero)) this.petalsInitialized = true; }

    startAnimations() {
        if (this.animationsStarted) return; this.animationsStarted = true;
        setTimeout(() => this.initPetals(), 100);
        const logo = this.container.querySelector('.home-logo'), logoC = this.container.querySelector('.logo-container'), shimmer = this.container.querySelector('.logo-shimmer'), star = this.container.querySelector('.shooting-star'), toggles = this.container.querySelectorAll('.audio-toggle');
        logoC.style.webkitMaskImage = `url('${logo.src}')`; logoC.style.maskImage = `url('${logo.src}')`;
        const tl = gsap.timeline({ onComplete: () => this.initScrollAnimations() });
        tl.to(toggles, { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' })
          .to(logo, { opacity: 1, scale: 1.08, y: 0, duration: 0.6, ease: 'back.out(2)' }, '-=0.2')
          .to(logo, { scale: 0.96, duration: 0.12, ease: 'power2.in' })
          .to(logo, { scale: 1.02, duration: 0.1, ease: 'power2.out' })
          .to(logo, { scale: 1, duration: 0.15, ease: 'elastic.out(1, 0.5)' })
          .to(shimmer, { opacity: 1, duration: 0.05 })
          .to(shimmer, { x: '250%', duration: 0.7, ease: 'power1.in' })
          .to(star, { opacity: 1, scale: 1, duration: 0.15, ease: 'back.out(2)' }, '-=0.2')
          .to(shimmer, { opacity: 0, duration: 0.1 }, '-=0.1')
          .to(star, { rotation: 180, scale: 1.5, duration: 0.4, ease: 'power2.out' })
          .to(star, { rotation: 360, scale: 0.8, duration: 0.3, ease: 'power2.in' })
          .to(star, { opacity: 0, scale: 0, duration: 0.2, ease: 'power2.in' })
          .add(() => this.animateSubtitle(), '-=0.1');
    }

    animateSubtitle() {
        const sub = this.container.querySelector('.home-subtitle'), text = 'Demo Available Now';
        sub.innerHTML = text.split('').map(c => c === ' ' ? `<span class="subtitle-letter space">&nbsp;</span>` : `<span class="subtitle-letter">${c}</span>`).join('');
        const letters = sub.querySelectorAll('.subtitle-letter:not(.space)');
        gsap.set(letters, { opacity: 0, y: 40, scaleY: 0.3, scaleX: 1.6, transformOrigin: 'center bottom' });
        letters.forEach((l, i) => {
            const tl = gsap.timeline({ delay: i * 0.05 });
            tl.to(l, { opacity: 1, y: -12, scaleY: 1.35, scaleX: 0.65, duration: 0.14, ease: 'power2.out' })
              .to(l, { y: 6, scaleY: 0.75, scaleX: 1.25, duration: 0.1, ease: 'power2.in' })
              .to(l, { y: -4, scaleY: 1.12, scaleX: 0.88, duration: 0.08, ease: 'power2.out' })
              .to(l, { y: 0, scaleY: 1, scaleX: 1, duration: 0.22, ease: 'elastic.out(1.2, 0.4)' });
        });
    }

    initScrollAnimations() {
        const sc = this.container.querySelector('.home-scroll-container'), news = this.container.querySelector('.home-news-section'), title = this.container.querySelector('.news-title'), arrows = this.container.querySelectorAll('.news-arrow'), cw = this.container.querySelector('.news-carousel-wrapper'), ind = this.container.querySelector('.news-indicators');
        gsap.set([title, cw, ind], { opacity: 0, y: 50 }); gsap.set(arrows, { opacity: 0, x: (i) => i === 0 ? -20 : 20 });
        ScrollTrigger.create({
            trigger: news, scroller: sc, start: 'top 80%',
            onEnter: () => {
                const tl = gsap.timeline();
                tl.to(title, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
                  .to(arrows, { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.3')
                  .to(cw, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
                  .to(ind, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3');
                this.startArrowAnimation();
            }
        });
    }

    startArrowAnimation() {
        gsap.to(this.container.querySelector('.news-arrow-left'), { x: -8, duration: 0.5, ease: 'power1.inOut', repeat: -1, yoyo: true });
        gsap.to(this.container.querySelector('.news-arrow-right'), { x: 8, duration: 0.5, ease: 'power1.inOut', repeat: -1, yoyo: true });
    }

    destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); if (sakuraPetals) sakuraPetals.destroy(); newsCarousel.destroy(); if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container); }
}

export const homeScreen = new HomeScreen();
export default homeScreen;
