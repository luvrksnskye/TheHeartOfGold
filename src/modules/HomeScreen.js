/**
 * HomeScreen - Main Home Screen Module
 * The Heart of Gold
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';
import audioManager from '../utils/AudioManager.js';
import sakuraPetals from '../utils/SakuraPetals.js';
import newsCarousel from './NewsCarousel.js';
import overviewSection from './OverviewSection.js';
import sectionNav from './SectionNav.js';

gsap.registerPlugin(ScrollTrigger);

class HomeScreen {
    constructor() { 
        this.container = null; 
        this.animationsStarted = false; 
        this.petalsInitialized = false;
        this.logoAnimating = false;
        this.subtitleAnimating = false;
        
        this.links = {
            steam: 'https://store.steampowered.com/app/3915280/The_Heart_of_Gold/',
            kickstarter: 'https://www.kickstarter.com/projects/j3f33m1/project-gs-a-2d-survivors-like-game-with-rpg-elements'
        };
    }

    create() {
        this.container = document.createElement('div');
        this.container.id = 'home-screen';
        this.container.className = 'home-screen';
        const musicOn = audioManager.isMusicEnabled(), sfxOn = audioManager.isSfxEnabled();
        this.container.innerHTML = `
            <div class="home-scroll-container">
                <section class="home-hero" id="home-hero">
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
                            <div class="platform-badges">
                                <a href="${this.links.kickstarter}" target="_blank" rel="noopener noreferrer" class="platform-badge kickstarter-badge clickable" data-platform="kickstarter">
                                    <div class="platform-text-container">
                                        <span class="platform-letter">K</span><span class="platform-letter">I</span><span class="platform-letter">C</span><span class="platform-letter">K</span><span class="platform-letter">S</span><span class="platform-letter">T</span><span class="platform-letter">A</span><span class="platform-letter">R</span><span class="platform-letter">T</span><span class="platform-letter">E</span><span class="platform-letter">R</span>
                                    </div>
                                </a>
                                <a href="${this.links.steam}" target="_blank" rel="noopener noreferrer" class="platform-badge steam-badge clickable" data-platform="steam">
                                    <img src="./src/assets/steam-icon.png" alt="" class="platform-icon steam-icon">
                                    <div class="platform-text-container">
                                        <span class="platform-letter">S</span><span class="platform-letter">T</span><span class="platform-letter">E</span><span class="platform-letter">A</span><span class="platform-letter">M</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="home-news-section" id="home-news-section">
                    <div class="news-lines-pattern"></div>
                    <div class="news-gradient-overlay"></div>
                    <div class="news-content"></div>
                </section>
            </div>
        `;
        document.body.appendChild(this.container);
        
        // Create News Carousel
        newsCarousel.create(this.container.querySelector('.news-content'));
        
        // Create Overview Section (Section 03)
        const scrollContainer = this.container.querySelector('.home-scroll-container');
        overviewSection.create(scrollContainer);
        
        // Create Section Navigation with updated sections
        sectionNav.sections = [
            { id: 'home-hero', number: '01', label: 'Home' },
            { id: 'home-news-section', number: '02', label: 'News' },
            { id: 'overview-section', number: '03', label: 'Overview' }
        ];
        sectionNav.create(scrollContainer);
        
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
        const badges = this.container.querySelectorAll('.platform-badge');
        const sectionNumberBg = this.container.querySelector('.section-number-bg');
        
        gsap.set(logoContainer, { opacity: 0, scale: 0.5, rotate: -5 });
        gsap.set(shimmer, { opacity: 0, x: '-120%' });
        gsap.set(star, { opacity: 0, scale: 0 });
        gsap.set(toggles, { opacity: 0, scale: 0.5, y: -20 });
        gsap.set(badges, { opacity: 0, y: 20, scale: 0.8 });
        if (sectionNumberBg) gsap.set(sectionNumberBg, { opacity: 0, x: 100 });
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
                gsap.timeline()
                    .to(t, { scale: 0.85, duration: 0.15, ease: 'power2.in' })
                    .to(t, { scale: 1.1, duration: 0.2, ease: 'power2.out' })
                    .to(t, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

    bindClickAnimations() {
        this.container.querySelector('.logo-wrapper').addEventListener('click', (e) => { 
            e.stopPropagation(); 
            if (!this.logoAnimating) this.animateLogo(); 
        });
        
        this.container.querySelector('.home-subtitle').addEventListener('click', (e) => { 
            e.stopPropagation(); 
            if (!this.subtitleAnimating) this.animateSubtitle(); 
        });
        
        this.container.querySelectorAll('.platform-badge').forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                this.animateBadgeHover(badge);
            });
        });
    }

    async show() { 
        if (audioManager.isMusicEnabled()) audioManager.playMusic('./src/music/day1theme_2.mp3', true); 
        return Promise.resolve(); 
    }

    initPetals() { 
        if (this.petalsInitialized) return; 
        const hero = this.container.querySelector('.home-hero'); 
        if (hero && sakuraPetals.init(hero)) this.petalsInitialized = true; 
    }

    startAnimations() {
        if (this.animationsStarted) return; 
        this.animationsStarted = true;
        setTimeout(() => this.initPetals(), 100);
        
        const toggles = this.container.querySelectorAll('.audio-toggle');
        const tl = gsap.timeline({ onComplete: () => this.initScrollAnimations() });
        
        tl.to(toggles, { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' });
        tl.add(() => this.animateLogo(), '-=0.2');
        tl.add(() => this.animateSubtitle(), '-=0.3');
        tl.add(() => this.animatePlatformBadges(), '-=0.5');
        tl.add(() => sectionNav.show(), '-=0.3');
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
        
        const tl = gsap.timeline({ onComplete: () => { this.logoAnimating = false; } });
        
        tl.to(logoContainer, { opacity: 1, scale: 1.15, rotate: 3, duration: 0.7, ease: 'back.out(2.5)' })
          .to(logoContainer, { scale: 0.92, rotate: -2, duration: 0.2, ease: 'power2.in' })
          .to(logoContainer, { scale: 1.05, rotate: 1, duration: 0.25, ease: 'power2.out' })
          .to(logoContainer, { scale: 1, rotate: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
        
        tl.set(shimmer, { x: '-120%', opacity: 0 }, '-=0.6')
          .to(shimmer, { opacity: 1, duration: 0.05 })
          .to(shimmer, { x: '250%', duration: 0.7, ease: 'power1.in' })
          .to(shimmer, { opacity: 0, duration: 0.1 });
        
        tl.to(star, { opacity: 1, scale: 1, duration: 0.15, ease: 'back.out(2)' }, '-=0.8')
          .to(star, { rotation: 180, scale: 1.5, duration: 0.4, ease: 'power2.out' })
          .to(star, { rotation: 360, scale: 0.8, duration: 0.3, ease: 'power2.in' })
          .to(star, { opacity: 0, scale: 0, duration: 0.2, ease: 'power2.in' });
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
                .to(l, { opacity: 1, y: -15, scaleY: 1.45, scaleX: 0.55, duration: 0.15, ease: 'power2.out' })
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
            
            const tl = gsap.timeline({ delay: index * 0.15 });
            
            tl.to(badge, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' });
            
            if (icon) {
                tl.fromTo(icon, { scale: 0, rotate: -45 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, '-=0.3');
            }
            
            gsap.set(letters, { opacity: 0, y: '100%', rotateX: -90 });
            
            letters.forEach((letter, i) => {
                gsap.timeline({ delay: (index * 0.15) + 0.3 + (i * 0.06) })
                    .to(letter, { opacity: 1, y: '0%', rotateX: 0, duration: 0.4, ease: 'back.out(1.5)' });
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
        const bgTexts = this.container.querySelectorAll('.news-bg-text');
        const sectionNumberBg = this.container.querySelector('.section-number-bg');
        
        if (newsWrapper) gsap.set(newsWrapper, { opacity: 0, y: 60 });
        gsap.set(bgTexts, { opacity: 0 });
        
        ScrollTrigger.create({
            trigger: news, 
            scroller: sc, 
            start: 'top 90%',
            onEnter: () => {
                const tl = gsap.timeline();
                
                if (sectionNumberBg) {
                    tl.to(sectionNumberBg, { 
                        opacity: 1, 
                        x: 0, 
                        duration: 1.2, 
                        ease: 'power2.out' 
                    });
                }
                
                tl.to(bgTexts, { 
                    opacity: 1, 
                    duration: 0.8, 
                    stagger: 0.15,
                    ease: 'power2.out'
                }, '-=0.8');
                
                if (newsWrapper) {
                    tl.to(newsWrapper, { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.8, 
                        ease: 'power2.out' 
                    }, '-=0.5');
                }
            }
        });
        
        ScrollTrigger.create({
            trigger: news, 
            scroller: sc, 
            start: 'top bottom', 
            end: 'bottom top', 
            scrub: 0.5,
            onUpdate: (self) => {
                const p = self.progress;
                
                if (bgTexts[0]) gsap.set(bgTexts[0], { x: p * -120 });
                if (bgTexts[1]) gsap.set(bgTexts[1], { x: p * 100 });
                if (bgTexts[2]) gsap.set(bgTexts[2], { x: p * -80 });
                
                if (sectionNumberBg) {
                    gsap.set(sectionNumberBg, { 
                        y: (p - 0.5) * -50,
                        scale: 1 + (p * 0.05)
                    });
                }
            }
        });
        
        this.initNewsElementsScrollAnimations(sc);
    }

    initNewsElementsScrollAnimations(scroller) {
        const newsHeader = this.container.querySelector('.news-header');
        const categoryBar = this.container.querySelector('.news-category-bar');
        const carouselArea = this.container.querySelector('.news-carousel-area');
        const carouselActions = this.container.querySelector('.carousel-actions');
        
        if (newsHeader) {
            gsap.set(newsHeader, { opacity: 0, y: 40 });
            ScrollTrigger.create({
                trigger: newsHeader,
                scroller: scroller,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(newsHeader, {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                        ease: 'back.out(1.5)'
                    });
                }
            });
        }
        
        if (categoryBar) {
            gsap.set(categoryBar, { opacity: 0, x: -30, scaleX: 0.9 });
            ScrollTrigger.create({
                trigger: categoryBar,
                scroller: scroller,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(categoryBar, {
                        opacity: 1,
                        x: 0,
                        scaleX: 1,
                        duration: 0.6,
                        ease: 'back.out(1.7)'
                    });
                }
            });
        }
        
        if (carouselArea) {
            gsap.set(carouselArea, { opacity: 0, scale: 0.95 });
            ScrollTrigger.create({
                trigger: carouselArea,
                scroller: scroller,
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(carouselArea, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        ease: 'power2.out'
                    });
                }
            });
        }
        
        if (carouselActions) {
            gsap.set(carouselActions, { opacity: 0, y: 30 });
            ScrollTrigger.create({
                trigger: carouselActions,
                scroller: scroller,
                start: 'top 90%',
                onEnter: () => {
                    gsap.to(carouselActions, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'back.out(1.5)'
                    });
                }
            });
        }
    }

    destroy() { 
        ScrollTrigger.getAll().forEach(st => st.kill()); 
        if (sakuraPetals) sakuraPetals.destroy(); 
        newsCarousel.destroy();
        overviewSection.destroy();
        sectionNav.destroy();
        if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container); 
    }
}

export const homeScreen = new HomeScreen();
export default homeScreen;
