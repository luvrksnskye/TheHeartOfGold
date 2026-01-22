/**
 * HomeScreen - Main Home Screen Module
 * The Heart of Gold
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';
import audioManager from '../utils/AudioManager.js';
import sakuraPetals from '../utils/SakuraPetals.js';
import newsCarousel from './NewsCarousel.js';

gsap.registerPlugin(ScrollTrigger);

class HomeScreen {
    constructor() { 
        this.container = null; 
        this.animationsStarted = false; 
        this.petalsInitialized = false;
        this.logoAnimating = false;
        this.subtitleAnimating = false;
        this.steamAnimating = false;
    }

    create() {
        this.container = document.createElement('div');
        this.container.id = 'home-screen';
        this.container.className = 'home-screen';
        const musicOn = audioManager.isMusicEnabled(), sfxOn = audioManager.isSfxEnabled();
        this.container.innerHTML = `
            <div class="home-scroll-container">
                <section class="home-hero">
                    <img src="./src/assets/portada.png" alt="" class="home-bg">
                    <div class="home-audio-toggles">
                        <button class="audio-toggle music-toggle clickable ${musicOn ? 'active' : ''}" data-type="music" aria-label="Toggle Music">
                            <img src="./src/assets/${musicOn ? 'musicon' : 'musicoff'}.png" alt="" class="toggle-icon">
                        </button>
                        <button class="audio-toggle sfx-toggle clickable ${sfxOn ? 'active' : ''}" data-type="sfx" aria-label="Toggle Sound Effects">
                            <img src="./src/assets/${sfxOn ? 'soundon' : 'soundoff'}.png" alt="" class="toggle-icon">
                        </button>
                    </div>
                    <div class="home-content">
                        <div class="logo-wrapper clickable">
                            <div class="logo-container">
                                <img src="./src/assets/Logo_main.svg" alt="The Heart of Gold" class="home-logo">
                                <div class="logo-shimmer"></div>
                            </div>
                            <div class="shooting-star"><div class="star-core"></div></div>
                        </div>
                        <div class="subtitle-container">
                            <p class="home-subtitle clickable"></p>
                            <div class="steam-badge clickable">
                                <img src="./src/assets/steam-icon.png" alt="" class="steam-icon">
                                <div class="steam-text-container">
                                    <span class="steam-letter">S</span><span class="steam-letter">T</span><span class="steam-letter">E</span><span class="steam-letter">A</span><span class="steam-letter">M</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="home-news-section">
                    <div class="news-gradient-overlay"></div>
                    <div class="news-bg-text news-bg-text-1">NEWS AND INFO</div>
                    <div class="news-bg-text news-bg-text-2">NEWS AND INFO</div>
                    <div class="news-bg-text news-bg-text-3">NEWS AND INFO</div>
                    <div class="news-content"></div>
                </section>
            </div>
        `;
        document.body.appendChild(this.container);
        newsCarousel.create(this.container.querySelector('.news-content'));
        gsap.set(this.container, { opacity: 1 });
        this.setInitialStates();
        this.setupSubtitleText();
        this.bindAudioToggles();
        this.bindClickAnimations();
        return this;
    }

    setupSubtitleText() {
        const sub = this.container.querySelector('.home-subtitle');
        const text = 'Demo Available Now';
        sub.innerHTML = text.split('').map(c => c === ' ' ? `<span class="subtitle-letter space">&nbsp;</span>` : `<span class="subtitle-letter">${c}</span>`).join('');
    }

    setInitialStates() {
        const logoContainer = this.container.querySelector('.logo-container');
        const shimmer = this.container.querySelector('.logo-shimmer');
        const star = this.container.querySelector('.shooting-star');
        const toggles = this.container.querySelectorAll('.audio-toggle');
        const steamBadge = this.container.querySelector('.steam-badge');
        gsap.set(logoContainer, { opacity: 0, scale: 0.5, rotate: -5 });
        gsap.set(shimmer, { opacity: 0, x: '-120%' });
        gsap.set(star, { opacity: 0, scale: 0 });
        gsap.set(toggles, { opacity: 0, scale: 0.5, y: -20 });
        gsap.set(steamBadge, { opacity: 0, y: 20, scale: 0.8 });
    }

    bindAudioToggles() {
        this.container.querySelectorAll('.audio-toggle').forEach(t => {
            t.addEventListener('click', (e) => {
                e.stopPropagation();
                const type = t.dataset.type, active = t.classList.contains('active'), newState = !active;
                if (type === 'music') { 
                    audioManager.enableMusic(newState); 
                    t.querySelector('.toggle-icon').src = `./src/assets/${newState ? 'musicon' : 'musicoff'}.png`;
                    if (newState) audioManager.playMusic('./src/music/day1theme_2.mp3', true);
                } else { 
                    audioManager.enableSfx(newState); 
                    t.querySelector('.toggle-icon').src = `./src/assets/${newState ? 'soundon' : 'soundoff'}.png`;
                }
                t.classList.toggle('active', newState);
                gsap.timeline().to(t, { scale: 0.85, duration: 0.15 }).to(t, { scale: 1.1, duration: 0.2 }).to(t, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

    bindClickAnimations() {
        this.container.querySelector('.logo-wrapper').addEventListener('click', (e) => { e.stopPropagation(); if (!this.logoAnimating) this.animateLogo(); });
        this.container.querySelector('.home-subtitle').addEventListener('click', (e) => { e.stopPropagation(); if (!this.subtitleAnimating) this.animateSubtitle(); });
        this.container.querySelector('.steam-badge').addEventListener('click', (e) => { e.stopPropagation(); if (!this.steamAnimating) this.animateSteamFlip(); });
    }

    async show() { if (audioManager.isMusicEnabled()) audioManager.playMusic('./src/music/day1theme_2.mp3', true); return Promise.resolve(); }

    initPetals() { if (this.petalsInitialized) return; const hero = this.container.querySelector('.home-hero'); if (hero && sakuraPetals.init(hero)) this.petalsInitialized = true; }

    startAnimations() {
        if (this.animationsStarted) return; 
        this.animationsStarted = true;
        setTimeout(() => this.initPetals(), 100);
        const toggles = this.container.querySelectorAll('.audio-toggle');
        const tl = gsap.timeline({ onComplete: () => this.initScrollAnimations() });
        tl.to(toggles, { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' });
        tl.add(() => this.animateLogo(), '-=0.2');
        tl.add(() => this.animateSubtitle(), '-=0.3').add(() => this.animateSteamBadge(), '-=0.5');
    }

    animateLogo() {
        if (this.logoAnimating) return;
        this.logoAnimating = true;
        const logo = this.container.querySelector('.home-logo'), logoContainer = this.container.querySelector('.logo-container');
        const shimmer = this.container.querySelector('.logo-shimmer'), star = this.container.querySelector('.shooting-star');
        logoContainer.style.webkitMaskImage = `url('${logo.src}')`;
        logoContainer.style.maskImage = `url('${logo.src}')`;
        const tl = gsap.timeline({ onComplete: () => { this.logoAnimating = false; } });
        tl.to(logoContainer, { opacity: 1, scale: 1.15, rotate: 3, duration: 0.7, ease: 'back.out(2.5)' })
          .to(logoContainer, { scale: 0.92, rotate: -2, duration: 0.2 })
          .to(logoContainer, { scale: 1.05, rotate: 1, duration: 0.25 })
          .to(logoContainer, { scale: 1, rotate: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
        tl.set(shimmer, { x: '-120%', opacity: 0 }, '-=0.6').to(shimmer, { opacity: 1, duration: 0.05 }).to(shimmer, { x: '250%', duration: 0.7 }).to(shimmer, { opacity: 0, duration: 0.1 });
        tl.to(star, { opacity: 1, scale: 1, duration: 0.15, ease: 'back.out(2)' }, '-=0.8')
          .to(star, { rotation: 180, scale: 1.5, duration: 0.4 }).to(star, { rotation: 360, scale: 0.8, duration: 0.3 }).to(star, { opacity: 0, scale: 0, duration: 0.2 });
    }

    animateSubtitle() {
        if (this.subtitleAnimating) return;
        this.subtitleAnimating = true;
        const letters = this.container.querySelectorAll('.subtitle-letter:not(.space)');
        if (letters.length === 0) { this.subtitleAnimating = false; return; }
        gsap.set(letters, { opacity: 0, y: 50, scaleY: 0.2, scaleX: 1.8, transformOrigin: 'center bottom' });
        let completed = 0;
        letters.forEach((l, i) => {
            gsap.timeline({ delay: i * 0.04, onComplete: () => { completed++; if (completed === letters.length) this.subtitleAnimating = false; } })
                .to(l, { opacity: 1, y: -15, scaleY: 1.45, scaleX: 0.55, duration: 0.15 })
                .to(l, { y: 8, scaleY: 0.7, scaleX: 1.3, duration: 0.12 })
                .to(l, { y: -5, scaleY: 1.15, scaleX: 0.85, duration: 0.1 })
                .to(l, { y: 0, scaleY: 1, scaleX: 1, duration: 0.25, ease: 'elastic.out(1.2, 0.4)' });
        });
    }

    animateSteamBadge() {
        const badge = this.container.querySelector('.steam-badge'), icon = this.container.querySelector('.steam-icon');
        gsap.timeline().to(badge, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' })
            .fromTo(icon, { scale: 0, rotate: -45 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, '-=0.3')
            .add(() => this.animateSteamFlip(), '-=0.2');
    }

    animateSteamFlip() {
        if (this.steamAnimating) return;
        this.steamAnimating = true;
        const letters = this.container.querySelectorAll('.steam-letter');
        gsap.set(letters, { opacity: 0, y: '100%', rotateX: -90 });
        let completed = 0;
        letters.forEach((letter, i) => {
            gsap.timeline({ delay: i * 0.1, onComplete: () => { completed++; if (completed === letters.length) this.steamAnimating = false; } })
                .to(letter, { opacity: 1, y: '0%', rotateX: 0, duration: 0.5, ease: 'back.out(1.5)' });
        });
    }

    initScrollAnimations() {
        const sc = this.container.querySelector('.home-scroll-container');
        const news = this.container.querySelector('.home-news-section');
        const newsWrapper = this.container.querySelector('.news-section-wrapper');
        const bgTexts = this.container.querySelectorAll('.news-bg-text');
        gsap.set(newsWrapper, { opacity: 0, y: 50 });
        gsap.set(bgTexts, { opacity: 0 });
        ScrollTrigger.create({
            trigger: news, scroller: sc, start: 'top 85%',
            onEnter: () => {
                gsap.timeline()
                    .to(bgTexts, { opacity: 1, duration: 1, stagger: 0.2 })
                    .to(newsWrapper, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');
            }
        });
        ScrollTrigger.create({
            trigger: news, scroller: sc, start: 'top bottom', end: 'bottom top', scrub: 1,
            onUpdate: (self) => {
                const p = self.progress;
                gsap.set(bgTexts[0], { x: p * -100 });
                gsap.set(bgTexts[1], { x: p * 80 });
                gsap.set(bgTexts[2], { x: p * -60 });
            }
        });
    }

    destroy() { 
        ScrollTrigger.getAll().forEach(st => st.kill()); 
        if (sakuraPetals) sakuraPetals.destroy(); 
        newsCarousel.destroy(); 
        if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container); 
    }
}

export const homeScreen = new HomeScreen();
export default homeScreen;
