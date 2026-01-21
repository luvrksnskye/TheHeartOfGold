/**
 * HomeScreen - Pantalla principal del juego con scroll y secciones
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';
import audioManager from '../utils/AudioManager.js';
import transition from './Transition.js';

gsap.registerPlugin(ScrollTrigger);

class HomeScreen {
    constructor() {
        this.container = null;
        this.currentNewsIndex = 0;
        this.animationsStarted = false;
        this.isNavigating = false;
        this.newsData = [
            {
                id: 1,
                image: './src/assets/news_placeholder1.png',
                date: 'February, 2025',
                title: 'Demo Launch Announcement Event',
                description: 'Experience the first playable demo of The Heart of Gold. Face waves of enemies and discover the combat system.',
                blogId: '01'
            },
            {
                id: 2,
                image: './src/assets/news_placeholder2.png',
                date: 'January 21, 2025',
                title: 'Meet the Characters',
                description: 'lol',
                blogId: '02'
            },
            {
                id: 3,
                image: './src/assets/news_placeholder3.png',
                date: 'Ola, 2025',
                title: 'Development Update',
                description: 'idk',
                blogId: '03'
            }
        ];
    }

    create() {
        this.container = document.createElement('div');
        this.container.id = 'home-screen';
        this.container.className = 'home-screen';
        
        const musicEnabled = audioManager.isMusicEnabled();
        const sfxEnabled = audioManager.isSfxEnabled();
        
        this.container.innerHTML = `
            <div class="home-scroll-container">
                <!-- Hero Section -->
                <section class="home-hero">
                    <img src="./src/assets/menu_bg2x3.gif" alt="" class="home-bg">
                    
                    <div class="home-audio-toggles">
                        <button class="audio-toggle music-toggle clickable ${musicEnabled ? 'active' : ''}" data-type="music" aria-label="Toggle Music">
                            <img src="./src/assets/${musicEnabled ? 'musicon' : 'musicoff'}.png" alt="" class="toggle-icon">
                        </button>
                        <button class="audio-toggle sfx-toggle clickable ${sfxEnabled ? 'active' : ''}" data-type="sfx" aria-label="Toggle Sound Effects">
                            <img src="./src/assets/${sfxEnabled ? 'soundon' : 'soundoff'}.png" alt="" class="toggle-icon">
                        </button>
                    </div>
                    
                    <div class="home-content">
                        <div class="logo-wrapper">
                            <div class="logo-container">
                                <img src="./src/assets/Logo_main.svg" alt="The Heart of Gold" class="home-logo">
                                <div class="logo-shimmer"></div>
                            </div>
                            <div class="shooting-star">
                                <div class="star-core"></div>
                            </div>
                        </div>
                        <p class="home-subtitle"></p>
                    </div>
                </section>
                
                <!-- News Section -->
                <section class="home-news-section">
                    <div class="news-gradient-overlay"></div>
                    <div class="news-content">
                        <h2 class="news-title">
                            <span class="news-arrow news-arrow-left">//</span>
                            <span class="news-title-text">Latest News</span>
                            <span class="news-arrow news-arrow-right">//</span>
                        </h2>
                        
                        <div class="news-carousel-wrapper">
                            <button class="news-nav news-nav-prev clickable" aria-label="Previous news">
                                <img src="./src/assets/arrowLx1.png" alt="" class="nav-arrow-img">
                            </button>
                            
                            <div class="news-carousel">
                                <div class="news-carousel-track">
                                    ${this.newsData.map((news, index) => `
                                        <div class="news-panel ${index === 0 ? 'active' : ''}" data-index="${index}" data-blog-id="${news.blogId}">
                                            <div class="panel-bg">
                                                <img src="./src/assets/barrax3.png" alt="" class="panel-bar">
                                            </div>
                                            <div class="panel-shimmer"></div>
                                            <div class="panel-content clickable">
                                                <div class="panel-image">
                                                    <div class="panel-image-placeholder">
                                                        <span class="placeholder-icon">&#9733;</span>
                                                    </div>
                                                </div>
                                                <div class="panel-info">
                                                    <time class="panel-date">${news.date}</time>
                                                    <h3 class="panel-title">${news.title}</h3>
                                                    <p class="panel-description">${news.description}</p>
                                                </div>
                                            </div>
                                            <div class="panel-cat-marco">
                                                <img src="./src/assets/Hud_Cat_marco.png" alt="" class="cat-marco-img">
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <button class="news-nav news-nav-next clickable" aria-label="Next news">
                                <img src="./src/assets/arrowLx1.png" alt="" class="nav-arrow-img">
                            </button>
                        </div>
                        
                        <div class="news-indicators">
                            ${this.newsData.map((_, index) => `
                                <button class="news-indicator clickable ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Go to news ${index + 1}"></button>
                            `).join('')}
                        </div>
                    </div>
                </section>
            </div>
        `;
        
        document.body.appendChild(this.container);
        
        gsap.set(this.container, { opacity: 1 });
        this.setInitialStates();
        
        this.bindAudioToggles();
        this.bindCarouselEvents();
        this.bindPanelHover();
        
        return this;
    }

    setInitialStates() {
        const logo = this.container.querySelector('.home-logo');
        const shimmer = this.container.querySelector('.logo-shimmer');
        const shootingStar = this.container.querySelector('.shooting-star');
        const audioToggles = this.container.querySelectorAll('.audio-toggle');
        const panelShimmers = this.container.querySelectorAll('.panel-shimmer');
        
        gsap.set(logo, { opacity: 0, scale: 0.3, y: 50 });
        gsap.set(shimmer, { opacity: 0, x: '-120%' });
        gsap.set(shootingStar, { opacity: 0, scale: 0 });
        gsap.set(audioToggles, { opacity: 0, scale: 0.5, y: -20 });
        gsap.set(panelShimmers, { opacity: 0, x: '-100%' });
    }

    bindAudioToggles() {
        const toggles = this.container.querySelectorAll('.audio-toggle');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const type = toggle.dataset.type;
                const isActive = toggle.classList.contains('active');
                const newState = !isActive;
                
                if (type === 'music') {
                    audioManager.enableMusic(newState);
                    const icon = toggle.querySelector('.toggle-icon');
                    icon.src = `./src/assets/${newState ? 'musicon' : 'musicoff'}.png`;
                    
                    if (newState) {
                        audioManager.playMusic('./src/music/day2theme.mp3', true);
                    }
                } else {
                    audioManager.enableSfx(newState);
                    const icon = toggle.querySelector('.toggle-icon');
                    icon.src = `./src/assets/${newState ? 'soundon' : 'soundoff'}.png`;
                }
                
                toggle.classList.toggle('active', newState);
                
                gsap.fromTo(toggle, 
                    { scale: 0.85 },
                    { 
                        scale: 1,
                        duration: 0.4,
                        ease: 'elastic.out(1, 0.5)'
                    }
                );
            });
        });
    }

    bindPanelHover() {
        const panels = this.container.querySelectorAll('.news-panel');
        
        panels.forEach(panel => {
            const catMarco = panel.querySelector('.panel-cat-marco');
            
            panel.addEventListener('mouseenter', () => {
                if (this.isNavigating) return;
                
                gsap.to(panel, {
                    y: -25,
                    scale: 1.08,
                    zIndex: 10,
                    duration: 0.4,
                    ease: 'back.out(1.5)'
                });
                
                gsap.to(catMarco, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'back.out(2)'
                });
            });
            
            panel.addEventListener('mouseleave', () => {
                if (this.isNavigating) return;
                
                gsap.to(panel, {
                    y: 0,
                    scale: 1,
                    zIndex: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                gsap.to(catMarco, {
                    opacity: 0,
                    scale: 0.5,
                    y: 30,
                    duration: 0.3,
                    ease: 'power2.in'
                });
            });
        });
    }

    bindCarouselEvents() {
        const prevBtn = this.container.querySelector('.news-nav-prev');
        const nextBtn = this.container.querySelector('.news-nav-next');
        const indicators = this.container.querySelectorAll('.news-indicator');
        const panels = this.container.querySelectorAll('.news-panel');
        const carousel = this.container.querySelector('.news-carousel');
        
        prevBtn.addEventListener('click', () => this.navigateCarousel(-1));
        nextBtn.addEventListener('click', () => this.navigateCarousel(1));
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        panels.forEach(panel => {
            const content = panel.querySelector('.panel-content');
            content.addEventListener('click', () => {
                if (this.isNavigating) return;
                const blogId = panel.dataset.blogId;
                this.navigateToBlog(blogId, panel);
            });
        });
        
        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    async navigateToBlog(blogId, panel) {
        if (this.isNavigating) return;
        this.isNavigating = true;
        
        const panelShimmer = panel.querySelector('.panel-shimmer');
        
        const tl = gsap.timeline();
        
        // Panel se levanta mas
        tl.to(panel, {
            y: -40,
            scale: 1.15,
            zIndex: 20,
            duration: 0.3,
            ease: 'power2.out'
        })
        // Shimmer atraviesa el panel
        .to(panelShimmer, {
            opacity: 1,
            duration: 0.1
        })
        .to(panelShimmer, {
            x: '200%',
            duration: 0.5,
            ease: 'power1.in'
        })
        // Panel se ilumina
        .to(panel, {
            filter: 'brightness(1.8)',
            duration: 0.2,
            ease: 'power2.out'
        }, '-=0.3')
        .to(panelShimmer, {
            opacity: 0,
            duration: 0.1
        })
        // Flash final
        .to(panel, {
            filter: 'brightness(2.5)',
            duration: 0.1
        })
        .to(panel, {
            filter: 'brightness(1)',
            duration: 0.1
        });
        
        // Esperar animacion y luego transicion
        await new Promise(resolve => {
            tl.eventCallback('onComplete', resolve);
        });
        
        // Ejecutar transicion
        await transition.transitionIn();
        
        // Navegar al blog
        window.location.href = `./src/blogs/${blogId}/index.html`;
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.navigateCarousel(1);
            } else {
                this.navigateCarousel(-1);
            }
        }
    }

    navigateCarousel(direction) {
        const newIndex = this.currentNewsIndex + direction;
        if (newIndex >= 0 && newIndex < this.newsData.length) {
            this.goToSlide(newIndex);
        }
    }

    goToSlide(index) {
        if (index === this.currentNewsIndex) return;
        
        const panels = this.container.querySelectorAll('.news-panel');
        const indicators = this.container.querySelectorAll('.news-indicator');
        const track = this.container.querySelector('.news-carousel-track');
        
        panels[this.currentNewsIndex].classList.remove('active');
        indicators[this.currentNewsIndex].classList.remove('active');
        
        this.currentNewsIndex = index;
        
        panels[this.currentNewsIndex].classList.add('active');
        indicators[this.currentNewsIndex].classList.add('active');
        
        const panelWidth = panels[0].offsetWidth + 32;
        gsap.to(track, {
            x: -index * panelWidth,
            duration: 0.6,
            ease: 'power2.out'
        });
    }

    async show() {
        if (audioManager.isMusicEnabled()) {
            audioManager.playMusic('./src/music/day2theme.mp3', true);
        }
        
        return Promise.resolve();
    }

    startAnimations() {
        if (this.animationsStarted) return;
        this.animationsStarted = true;
        
        const logo = this.container.querySelector('.home-logo');
        const logoContainer = this.container.querySelector('.logo-container');
        const shimmer = this.container.querySelector('.logo-shimmer');
        const shootingStar = this.container.querySelector('.shooting-star');
        const audioToggles = this.container.querySelectorAll('.audio-toggle');
        
        // Set the mask dynamically
        logoContainer.style.webkitMaskImage = `url('${logo.src}')`;
        logoContainer.style.maskImage = `url('${logo.src}')`;
        
        const tl = gsap.timeline({
            onComplete: () => {
                this.initScrollAnimations();
            }
        });
        
        tl.to(audioToggles, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        })
        .to(logo, {
            opacity: 1,
            scale: 1.08,
            y: 0,
            duration: 0.6,
            ease: 'back.out(2)'
        }, '-=0.2')
        .to(logo, {
            scale: 0.96,
            duration: 0.12,
            ease: 'power2.in'
        })
        .to(logo, {
            scale: 1.02,
            duration: 0.1,
            ease: 'power2.out'
        })
        .to(logo, {
            scale: 1,
            duration: 0.15,
            ease: 'elastic.out(1, 0.5)'
        })
        // Shimmer sweep
        .to(shimmer, {
            opacity: 1,
            duration: 0.05
        })
        .to(shimmer, {
            x: '250%',
            duration: 0.7,
            ease: 'power1.in'
        })
        // Cruz aparece al final del shimmer
        .to(shootingStar, {
            opacity: 1,
            scale: 1,
            duration: 0.15,
            ease: 'back.out(2)'
        }, '-=0.2')
        .to(shimmer, {
            opacity: 0,
            duration: 0.1
        }, '-=0.1')
        // Cruz gira y brilla
        .to(shootingStar, {
            rotation: 180,
            scale: 1.5,
            duration: 0.4,
            ease: 'power2.out'
        })
        .to(shootingStar, {
            rotation: 360,
            scale: 0.8,
            duration: 0.3,
            ease: 'power2.in'
        })
        // Cruz desaparece
        .to(shootingStar, {
            opacity: 0,
            scale: 0,
            duration: 0.2,
            ease: 'power2.in'
        })
        .add(() => {
            this.animateSubtitle();
        }, '-=0.1');
    }

    animateSubtitle() {
        const subtitle = this.container.querySelector('.home-subtitle');
        const text = 'Demo Available Now';
        
        subtitle.innerHTML = text.split('').map((char, i) => {
            if (char === ' ') {
                return `<span class="subtitle-letter space">&nbsp;</span>`;
            }
            return `<span class="subtitle-letter">${char}</span>`;
        }).join('');
        
        const letters = subtitle.querySelectorAll('.subtitle-letter:not(.space)');
        
        gsap.set(letters, { 
            opacity: 0, 
            y: 40, 
            scaleY: 0.3, 
            scaleX: 1.6,
            transformOrigin: 'center bottom'
        });
        
        letters.forEach((letter, index) => {
            const delay = index * 0.05;
            
            const tl = gsap.timeline({ delay });
            
            tl.to(letter, {
                opacity: 1,
                y: -12,
                scaleY: 1.35,
                scaleX: 0.65,
                duration: 0.14,
                ease: 'power2.out'
            })
            .to(letter, {
                y: 6,
                scaleY: 0.75,
                scaleX: 1.25,
                duration: 0.1,
                ease: 'power2.in'
            })
            .to(letter, {
                y: -4,
                scaleY: 1.12,
                scaleX: 0.88,
                duration: 0.08,
                ease: 'power2.out'
            })
            .to(letter, {
                y: 0,
                scaleY: 1,
                scaleX: 1,
                duration: 0.22,
                ease: 'elastic.out(1.2, 0.4)'
            });
        });
    }

    initScrollAnimations() {
        const scrollContainer = this.container.querySelector('.home-scroll-container');
        const newsSection = this.container.querySelector('.home-news-section');
        const newsTitle = this.container.querySelector('.news-title');
        const newsArrows = this.container.querySelectorAll('.news-arrow');
        const carouselWrapper = this.container.querySelector('.news-carousel-wrapper');
        const indicators = this.container.querySelector('.news-indicators');
        
        gsap.set([newsTitle, carouselWrapper, indicators], { opacity: 0, y: 50 });
        gsap.set(newsArrows, { opacity: 0, x: (i) => i === 0 ? -20 : 20 });
        
        ScrollTrigger.create({
            trigger: newsSection,
            scroller: scrollContainer,
            start: 'top 80%',
            onEnter: () => {
                const tl = gsap.timeline();
                
                tl.to(newsTitle, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                })
                .to(newsArrows, {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: 'back.out(1.5)'
                }, '-=0.3')
                .to(carouselWrapper, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }, '-=0.2')
                .to(indicators, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.out'
                }, '-=0.3');
                
                this.startArrowAnimation();
            }
        });
    }

    startArrowAnimation() {
        const leftArrow = this.container.querySelector('.news-arrow-left');
        const rightArrow = this.container.querySelector('.news-arrow-right');
        
        gsap.to(leftArrow, {
            x: -8,
            duration: 0.5,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true
        });
        
        gsap.to(rightArrow, {
            x: 8,
            duration: 0.5,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true
        });
    }

    destroy() {
        ScrollTrigger.getAll().forEach(st => st.kill());
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const homeScreen = new HomeScreen();
export default homeScreen;
