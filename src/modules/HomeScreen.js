/**
 * HomeScreen - Main Home Screen Module
 * The Heart of Gold
 * Updated: Core Animation integration
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';
import coreAnimation from '../utils/CoreAnimation.js';
import audioManager from '../utils/AudioManager.js';
import sakuraPetals from '../utils/SakuraPetals.js';
import newsCarousel from './NewsCarousel.js';
import overviewSection from './OverviewSection.js';
import soundtrackSection from './SoundtrackSection.js';
import sectionNav from './SectionNav.js';

gsap.registerPlugin(ScrollTrigger);

class HomeScreen {
    constructor() { 
        this.container = null; 
        this.animationsStarted = false; 
        this.petalsInitialized = false;
        this.logoAnimating = false;
        this.subtitleAnimating = false;
        this.scrollTriggers = [];
        this.timelines = [];
        
        this.links = {
            steam: 'https://store.steampowered.com/app/3915280/The_Heart_of_Gold/',
            kickstarter: 'https://www.kickstarter.com/projects/j3f33m1/project-gs-a-2d-survivors-like-game-with-rpg-elements'
        };
    }

    create() {
        this.container = document.createElement('div');
        this.container.id = 'home-screen';
        this.container.className = 'home-screen';
        
        const musicOn = audioManager.isMusicEnabled();
        const sfxOn = audioManager.isSfxEnabled();
        
        this.container.innerHTML = `
            <div class="home-scroll-container">
                <section class="home-hero" id="home-hero">
                    <img src="./src/assets/portada.png" alt="" class="home-bg" loading="eager">
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
                            <div class="platform-badges">
                                <a href="${this.links.kickstarter}" target="_blank" rel="noopener noreferrer" class="platform-badge kickstarter-badge clickable" data-platform="kickstarter">
                                    <div class="platform-text-container">
                                        ${this.createLetterSpans('KICKSTARTER')}
                                    </div>
                                </a>
                                <a href="${this.links.steam}" target="_blank" rel="noopener noreferrer" class="platform-badge steam-badge clickable" data-platform="steam">
                                    <img src="./src/assets/steam-icon.png" alt="" class="platform-icon steam-icon">
                                    <div class="platform-text-container">
                                        ${this.createLetterSpans('STEAM')}
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="home-news-section" id="home-news-section">
                    <div class="news-bg-base"></div>
                    <div class="news-pattern-overlay"></div>
                    <div class="news-content"></div>
                    <div class="news-bottom-fade"></div>
                </section>
            </div>
        `;
        
        document.body.appendChild(this.container);
        
        // Create News Carousel
        newsCarousel.create(this.container.querySelector('.news-content'));
        
        // Create Overview Section (includes Game Features and Characters)
        const scrollContainer = this.container.querySelector('.home-scroll-container');
        overviewSection.create(scrollContainer);
        soundtrackSection.create(scrollContainer);
        
        sectionNav.sections = [
    { id: 'home-hero', number: '01', label: 'Home' },
    { id: 'home-news-section', number: '02', label: 'News' },
    { id: 'overview-section', number: '03', label: 'Overview' },
    { id: 'characters-section', number: '04', label: 'Characters' },
    { id: 'soundtrack-section', number: '05', label: 'Soundtrack' } 
];
        sectionNav.create(scrollContainer);
        
        gsap.set(this.container, { opacity: 1 });
        this.setInitialStates();
        this.setupSubtitleText();
        this.bindEvents();
        
        return this;
    }

    createLetterSpans(text) {
        return text.split('').map(char => 
            `<span class="platform-letter">${char}</span>`
        ).join('');
    }

    setupSubtitleText() {
        const sub = this.container.querySelector('.home-subtitle');
        const text = 'Demo Available Now';
        sub.innerHTML = text.split('').map(c => 
            c === ' ' 
                ? '<span class="subtitle-letter space">&nbsp;</span>' 
                : `<span class="subtitle-letter">${c}</span>`
        ).join('');
    }

    setInitialStates() {
        const logoContainer = this.container.querySelector('.logo-container');
        const shimmer = this.container.querySelector('.logo-shimmer');
        const star = this.container.querySelector('.shooting-star');
        const toggles = this.container.querySelectorAll('.audio-toggle');
        const badges = this.container.querySelectorAll('.platform-badge');
        
        gsap.set(logoContainer, { opacity: 0, scale: 0.5, rotate: -5 });
        gsap.set(shimmer, { opacity: 0, x: '-120%' });
        gsap.set(star, { opacity: 0, scale: 0 });
        gsap.set(toggles, { opacity: 0, scale: 0.5, y: -20 });
        gsap.set(badges, { opacity: 0, y: 20, scale: 0.8 });
    }

    bindEvents() {
        // Audio toggles
        this.container.querySelectorAll('.audio-toggle').forEach(t => {
            t.addEventListener('click', this.handleAudioToggle.bind(this));
        });
        
        // Logo click
        this.container.querySelector('.logo-wrapper').addEventListener('click', (e) => { 
            e.stopPropagation(); 
            if (!this.logoAnimating) this.animateLogo(); 
        });
        
        // Subtitle click
        this.container.querySelector('.home-subtitle').addEventListener('click', (e) => { 
            e.stopPropagation(); 
            if (!this.subtitleAnimating) this.animateSubtitle(); 
        });
        
        // Badge hover
        this.container.querySelectorAll('.platform-badge').forEach(badge => {
            badge.addEventListener('mouseenter', () => this.animateBadgeHover(badge));
        });
    }

    handleAudioToggle(e) {
        e.stopPropagation();
        const t = e.currentTarget;
        const type = t.dataset.type;
        const active = t.classList.contains('active');
        const newState = !active;
        
        if (type === 'music') { 
            audioManager.enableMusic(newState); 
            t.querySelector('.toggle-icon').src = `./src/assets/${newState ? 'musicon' : 'musicoff'}.png`;
            if (newState) audioManager.playMusic('./src/music/day1theme_2.mp3', true);
        } else { 
            audioManager.enableSfx(newState); 
            t.querySelector('.toggle-icon').src = `./src/assets/${newState ? 'soundon' : 'soundoff'}.png`;
        }
        
        t.classList.toggle('active', newState);
        coreAnimation.squish(t, { intensity: 0.6, duration: 0.4 });
    }

    async show() { 
        if (audioManager.isMusicEnabled()) {
            audioManager.playMusic('./src/music/day1theme_2.mp3', true);
        }
        return Promise.resolve(); 
    }

    initPetals() { 
        if (this.petalsInitialized) return; 
        const hero = this.container.querySelector('.home-hero'); 
        if (hero && sakuraPetals.init(hero)) {
            this.petalsInitialized = true;
        }
    }

    startAnimations() {
        if (this.animationsStarted) return; 
        this.animationsStarted = true;
        
        // Defer petals initialization
        requestAnimationFrame(() => this.initPetals());
        
        const toggles = this.container.querySelectorAll('.audio-toggle');
        
        coreAnimation.stagger(toggles, {
            from: { opacity: 0, scale: 0.5, y: -20 },
            to: { opacity: 1, scale: 1, y: 0 },
            duration: 0.5,
            stagger: 0.1,
            onComplete: () => this.initScrollAnimations()
        });
        
        // Sequence animations
        setTimeout(() => this.animateLogo(), 200);
        setTimeout(() => this.animateSubtitle(), 500);
        setTimeout(() => this.animatePlatformBadges(), 800);
        setTimeout(() => sectionNav.show(), 1000);
    }

    animateLogo() {
        if (this.logoAnimating) return;
        this.logoAnimating = true;
        
        const logo = this.container.querySelector('.home-logo');
        const logoContainer = this.container.querySelector('.logo-container');
        const shimmer = this.container.querySelector('.logo-shimmer');
        const star = this.container.querySelector('.shooting-star');
        
        logoContainer.style.webkitMaskImage = `url('${logo.src}')`;
        logoContainer.style.maskImage = `url('${logo.src}')`;
        
        coreAnimation.prepareElement(logoContainer, ['transform', 'opacity']);
        
        const tl = coreAnimation.createTimeline({ 
            onComplete: () => { 
                this.logoAnimating = false;
                coreAnimation.cleanupElement(logoContainer, 300);
            }
        });
        this.timelines.push(tl);
        
        tl.to(logoContainer, { opacity: 1, scale: 1.15, rotate: 3, duration: 0.7, ease: 'back.out(2.5)' })
          .to(logoContainer, { scale: 0.92, rotate: -2, duration: 0.2, ease: 'power2.in' })
          .to(logoContainer, { scale: 1.05, rotate: 1, duration: 0.25, ease: 'power2.out' })
          .to(logoContainer, { scale: 1, rotate: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
        
        // Shimmer effect
        coreAnimation.shimmer(shimmer, { duration: 0.7, delay: 0.4 });
        
        // Star animation
        tl.to(star, { opacity: 1, scale: 1, duration: 0.15, ease: 'back.out(2)' }, '-=0.8')
          .to(star, { rotation: 180, scale: 1.5, duration: 0.4, ease: 'power2.out' })
          .to(star, { rotation: 360, scale: 0.8, duration: 0.3, ease: 'power2.in' })
          .to(star, { opacity: 0, scale: 0, duration: 0.2, ease: 'power2.in' });
    }

    animateSubtitle() {
        if (this.subtitleAnimating) return;
        this.subtitleAnimating = true;
        
        const letters = this.container.querySelectorAll('.subtitle-letter:not(.space)');
        if (letters.length === 0) { 
            this.subtitleAnimating = false; 
            return; 
        }
        
        gsap.set(letters, { 
            opacity: 0, 
            y: 50, 
            scaleY: 0.2, 
            scaleX: 1.8, 
            transformOrigin: 'center bottom' 
        });
        
        letters.forEach(l => coreAnimation.prepareElement(l, ['transform', 'opacity']));
        
        let completed = 0;
        const total = letters.length;
        
        letters.forEach((l, i) => {
            const tl = coreAnimation.createTimeline({ 
                delay: i * 0.04, 
                onComplete: () => { 
                    completed++; 
                    if (completed === total) {
                        this.subtitleAnimating = false;
                        letters.forEach(letter => coreAnimation.cleanupElement(letter, 300));
                    }
                } 
            });
            this.timelines.push(tl);
            
            tl.to(l, { opacity: 1, y: -15, scaleY: 1.45, scaleX: 0.55, duration: 0.15, ease: 'power2.out' })
              .to(l, { y: 8, scaleY: 0.7, scaleX: 1.3, duration: 0.12, ease: 'power2.in' })
              .to(l, { y: -5, scaleY: 1.15, scaleX: 0.85, duration: 0.1, ease: 'power2.out' })
              .to(l, { y: 0, scaleY: 1, scaleX: 1, duration: 0.25, ease: 'elastic.out(1.2, 0.4)' });
        });
    }

    animatePlatformBadges() {
        const badges = this.container.querySelectorAll('.platform-badge');
        
        badges.forEach((badge, index) => {
            const icon = badge.querySelector('.platform-icon');
            const letters = badge.querySelectorAll('.platform-letter');
            
            coreAnimation.bounceIn(badge, { 
                from: { y: 20, opacity: 0, scale: 0.8 },
                delay: index * 0.15,
                duration: 0.6
            });
            
            if (icon) {
                gsap.fromTo(icon, 
                    { scale: 0, rotate: -45 }, 
                    { scale: 1, rotate: 0, duration: 0.5, delay: (index * 0.15) + 0.3, ease: 'elastic.out(1, 0.5)' }
                );
            }
            
            gsap.set(letters, { opacity: 0, y: '100%', rotateX: -90 });
            
            letters.forEach((letter, i) => {
                gsap.to(letter, { 
                    opacity: 1, 
                    y: '0%', 
                    rotateX: 0, 
                    duration: 0.4, 
                    delay: (index * 0.15) + 0.3 + (i * 0.06),
                    ease: 'back.out(1.5)' 
                });
            });
        });
    }

    animateBadgeHover(badge) {
        const letters = badge.querySelectorAll('.platform-letter');
        gsap.killTweensOf(letters);
        
        letters.forEach((letter, i) => {
            gsap.fromTo(letter, 
                { y: '100%', rotateX: -90, opacity: 0 },
                { 
                    y: '0%', 
                    rotateX: 0, 
                    opacity: 1, 
                    duration: 0.4, 
                    delay: i * 0.04,
                    ease: 'back.out(1.5)',
                    overwrite: true
                }
            );
        });
    }

    initScrollAnimations() {
        const sc = this.container.querySelector('.home-scroll-container');
        const news = this.container.querySelector('.home-news-section');
        const newsWrapper = this.container.querySelector('.news-section-wrapper');
        
        if (newsWrapper) gsap.set(newsWrapper, { opacity: 0, y: 60 });
        
        const trigger = ScrollTrigger.create({
            trigger: news, 
            scroller: sc, 
            start: 'top 90%',
            once: true,
            onEnter: () => {
                if (newsWrapper) {
                    coreAnimation.bounceIn(newsWrapper, { duration: 0.8 });
                }
            }
        });
        this.scrollTriggers.push(trigger);
    }

    destroy() { 
        this.scrollTriggers.forEach(st => st.kill());
        ScrollTrigger.getAll().forEach(st => st.kill());
        this.timelines.forEach(tl => tl && tl.kill && tl.kill());
        
        if (sakuraPetals) sakuraPetals.destroy();
        newsCarousel.destroy();
        overviewSection.destroy();
        soundtrackSection.destroy();
        sectionNav.destroy();
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const homeScreen = new HomeScreen();
export default homeScreen;