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
                            <div class="shooting-star">
                                <div class="star-core"></div>
                            </div>
                        </div>
                        
                        <div class="subtitle-container">
                            <p class="home-subtitle clickable"></p>
                            <div class="steam-badge clickable">
                                <img src="./src/assets/steam-icon.png" alt="" class="steam-icon">
                                <div class="steam-text-container">
                                    <span class="steam-letter">S</span>
                                    <span class="steam-letter">T</span>
                                    <span class="steam-letter">E</span>
                                    <span class="steam-letter">A</span>
                                    <span class="steam-letter">M</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section class="home-news-section">
                    <div class="news-gradient-overlay"></div>
                    <div class="news-content">
                        <h2 class="news-title">
                            <span class="news-arrow news-arrow-left">//</span>
                            <span class="news-title-text">Latest News</span>
                            <span class="news-arrow news-arrow-right">//</span>
                        </h2>
                    </div>
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
        sub.innerHTML = text.split('').map(c => 
            c === ' ' 
                ? `<span class="subtitle-letter space">&nbsp;</span>` 
                : `<span class="subtitle-letter">${c}</span>`
        ).join('');
    }

    setInitialStates() {
        const logo = this.container.querySelector('.home-logo');
        const logoContainer = this.container.querySelector('.logo-container');
        const shimmer = this.container.querySelector('.logo-shimmer');
        const star = this.container.querySelector('.shooting-star');
        const toggles = this.container.querySelectorAll('.audio-toggle');
        const steamBadge = this.container.querySelector('.steam-badge');
        
        // El contenedor empieza con el tamaño y posición normales
        gsap.set(logoContainer, { opacity: 0, scale: 0.5, rotate: -5, y: 0 });
        // El logo dentro del contenedor está normal
        gsap.set(logo, { scale: 1, rotate: 0, y: 0 });
        gsap.set(shimmer, { opacity: 0, x: '-120%' });
        gsap.set(star, { opacity: 0, scale: 0, rotate: 0 });
        gsap.set(toggles, { opacity: 0, scale: 0.5, y: -20 });
        gsap.set(steamBadge, { opacity: 0, y: 20, scale: 0.8 });
    }

    bindAudioToggles() {
        this.container.querySelectorAll('.audio-toggle').forEach(t => {
            t.addEventListener('click', (e) => {
                e.stopPropagation();
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
                
                gsap.timeline()
                    .to(t, { scale: 0.85, duration: 0.15, ease: 'power2.in' })
                    .to(t, { scale: 1.1, duration: 0.2, ease: 'power2.out' })
                    .to(t, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

    bindClickAnimations() {
        // Logo clickeable
        const logoWrapper = this.container.querySelector('.logo-wrapper');
        logoWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!this.logoAnimating) {
                this.animateLogo();
            }
        });

        // Subtitle clickeable
        const subtitle = this.container.querySelector('.home-subtitle');
        subtitle.addEventListener('click', (e) => {
            e.stopPropagation();
            const letters = subtitle.querySelectorAll('.subtitle-letter:not(.space)');
            if (!this.subtitleAnimating && letters.length > 0) {
                this.animateSubtitle();
            }
        });

        // Steam badge clickeable
        const steamBadge = this.container.querySelector('.steam-badge');
        steamBadge.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!this.steamAnimating) {
                this.animateSteamFlip();
            }
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
        
        // Audio toggles
        tl.to(toggles, { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            duration: 0.5, 
            stagger: 0.1, 
            ease: 'back.out(1.7)' 
        });
        
        // Logo animation
        tl.add(() => this.animateLogo(), '-=0.2');
        
        // Subtitle y Steam badge
        tl.add(() => this.animateSubtitle(), '-=0.3')
        .add(() => this.animateSteamBadge(), '-=0.5');
    }

    animateLogo() {
        if (this.logoAnimating) return;
        this.logoAnimating = true;

        const logo = this.container.querySelector('.home-logo');
        const logoContainer = this.container.querySelector('.logo-container');
        const shimmer = this.container.querySelector('.logo-shimmer');
        const star = this.container.querySelector('.shooting-star');
        
        // Setup mask
        logoContainer.style.webkitMaskImage = `url('${logo.src}')`;
        logoContainer.style.maskImage = `url('${logo.src}')`;
        
        const tl = gsap.timeline({
            onComplete: () => {
                this.logoAnimating = false;
            }
        });
        
        // Animar el CONTENEDOR completo (con clip-path incluido)
        tl.to(logoContainer, { 
            opacity: 1,
            scale: 1.15,
            rotate: 3,
            y: 0,
            duration: 0.7,
            ease: 'back.out(2.5)'
        })
        .to(logoContainer, {
            scale: 0.92,
            rotate: -2,
            duration: 0.2,
            ease: 'power2.in'
        })
        .to(logoContainer, {
            scale: 1.05,
            rotate: 1,
            duration: 0.25,
            ease: 'power2.out'
        })
        .to(logoContainer, {
            scale: 1,
            rotate: 0,
            duration: 0.4,
            ease: 'elastic.out(1, 0.3)'
        });
        
        // Shimmer - RESETEAR primero y luego animar
        tl.set(shimmer, { x: '-120%', opacity: 0 }, '-=0.6')
        .to(shimmer, { opacity: 1, duration: 0.05 })
        .to(shimmer, { x: '250%', duration: 0.7, ease: 'power1.in' })
        .to(shimmer, { opacity: 0, duration: 0.1 });
        
        // Star
        tl.to(star, { 
            opacity: 1, 
            scale: 1, 
            duration: 0.15, 
            ease: 'back.out(2)' 
        }, '-=0.8')
        .to(star, { 
            rotation: 180, 
            scale: 1.5, 
            duration: 0.4, 
            ease: 'power2.out' 
        })
        .to(star, { 
            rotation: 360, 
            scale: 0.8, 
            duration: 0.3, 
            ease: 'power2.in' 
        })
        .to(star, { 
            opacity: 0, 
            scale: 0, 
            duration: 0.2, 
            ease: 'power2.in' 
        });
    }

    animateSubtitle() {
        if (this.subtitleAnimating) return;
        this.subtitleAnimating = true;

        const sub = this.container.querySelector('.home-subtitle');
        const letters = sub.querySelectorAll('.subtitle-letter:not(.space)');
        
        if (letters.length === 0) {
            this.subtitleAnimating = false;
            return;
        }
        
        // Resetear estado de todas las letras primero
        gsap.set(letters, { 
            opacity: 0, 
            y: 50, 
            scaleY: 0.2, 
            scaleX: 1.8, 
            transformOrigin: 'center bottom' 
        });
        
        let completedCount = 0;
        
        letters.forEach((l, i) => {
            const tl = gsap.timeline({ 
                delay: i * 0.04,
                onComplete: () => {
                    completedCount++;
                    if (completedCount === letters.length) {
                        this.subtitleAnimating = false;
                    }
                }
            });
            
            tl.to(l, { 
                opacity: 1, 
                y: -15, 
                scaleY: 1.45, 
                scaleX: 0.55, 
                duration: 0.15, 
                ease: 'power2.out' 
            })
            .to(l, { 
                y: 8, 
                scaleY: 0.7, 
                scaleX: 1.3, 
                duration: 0.12, 
                ease: 'power2.in' 
            })
            .to(l, { 
                y: -5, 
                scaleY: 1.15, 
                scaleX: 0.85, 
                duration: 0.1, 
                ease: 'power2.out' 
            })
            .to(l, { 
                y: 0, 
                scaleY: 1, 
                scaleX: 1, 
                duration: 0.25, 
                ease: 'elastic.out(1.2, 0.4)' 
            });
        });
    }

    animateSteamBadge() {
        const badge = this.container.querySelector('.steam-badge');
        const icon = this.container.querySelector('.steam-icon');
        
        const tl = gsap.timeline();
        
        // Badge appearance
        tl.to(badge, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)'
        });
        
        // Icon bounce
        tl.fromTo(icon,
            { scale: 0, rotate: -45 },
            { 
                scale: 1, 
                rotate: 0, 
                duration: 0.5, 
                ease: 'elastic.out(1, 0.5)' 
            },
            '-=0.3'
        );
        
        // Primer flip automático
        tl.add(() => this.animateSteamFlip(), '-=0.2');
    }

    animateSteamFlip() {
        if (this.steamAnimating) return;
        this.steamAnimating = true;

        const letters = this.container.querySelectorAll('.steam-letter');
        
        // Resetear estado
        gsap.set(letters, { 
            opacity: 0, 
            y: '100%', 
            rotateX: -90 
        });
        
        let completedCount = 0;
        
        letters.forEach((letter, i) => {
            const tl = gsap.timeline({
                delay: i * 0.1,
                onComplete: () => {
                    completedCount++;
                    if (completedCount === letters.length) {
                        this.steamAnimating = false;
                    }
                }
            });
            
            tl.to(letter, {
                opacity: 1,
                y: '0%',
                rotateX: 0,
                duration: 0.5,
                ease: 'back.out(1.5)'
            });
        });
    }

    initScrollAnimations() {
        const sc = this.container.querySelector('.home-scroll-container');
        const news = this.container.querySelector('.home-news-section');
        const title = this.container.querySelector('.news-title');
        const arrows = this.container.querySelectorAll('.news-arrow');
        const cw = this.container.querySelector('.news-carousel-wrapper');
        const ind = this.container.querySelector('.news-indicators');
        
        gsap.set([title, cw, ind], { opacity: 0, y: 50 });
        gsap.set(arrows, { opacity: 0, x: (i) => i === 0 ? -20 : 20 });
        
        ScrollTrigger.create({
            trigger: news, 
            scroller: sc, 
            start: 'top 80%',
            onEnter: () => {
                const tl = gsap.timeline();
                tl.to(title, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
                .to(arrows, { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.4, 
                    stagger: 0.1, 
                    ease: 'back.out(1.5)' 
                }, '-=0.3')
                .to(cw, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
                .to(ind, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3');
                this.startArrowAnimation();
            }
        });
    }

    startArrowAnimation() {
        gsap.to(this.container.querySelector('.news-arrow-left'), { 
            x: -8, 
            duration: 0.5, 
            ease: 'power1.inOut', 
            repeat: -1, 
            yoyo: true 
        });
        gsap.to(this.container.querySelector('.news-arrow-right'), { 
            x: 8, 
            duration: 0.5, 
            ease: 'power1.inOut', 
            repeat: -1, 
            yoyo: true 
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
