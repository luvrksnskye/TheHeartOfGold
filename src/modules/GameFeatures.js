/**
 * GameFeatures - Interactive Game Features Carousel
 * The Heart of Gold
 * Diagonal cut design matching reference image
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';

gsap.registerPlugin(ScrollTrigger);

class GameFeatures {
    constructor() {
        this.container = null;
        this.currentIndex = 0;
        this.isAnimating = false;
        this.videos = new Map();
        this.scrollTriggers = [];
        this.timelines = [];
        
        this.features = [
    {
        id: 'team', 
        number: '01',
        title: 'Strategic Party System',
        subtitle: 'Build Your Dream Team',
        description: 'Command a roster of 18 visually unique characters, each with distinct combat styles and voice acting. Venture into RPG-style dungeons using up to 14 heroes divided into two specialized squads to gather rare materials and experience.'
    },
    {
        id: 'combat', 
        number: '02', 
        title: 'Intense Bullet Heaven',
        subtitle: 'Survival of the Fittest',
        description: 'Face thousands of creatures in maps with dynamic day/night cycles. Master a deep combat system featuring unique stat scaling, two active skills, and powerful Ultimates to survive the waves before time runs out.'
    },
    {
        id: 'shop', 
        number: '03',
        title: 'Deep Evolution System',
        subtitle: 'Upgrade And Gachapon',
        description: 'Enhance your power through a unique Gachapon system using in-game coins to collect stat-boosting cards. Evolve your weaponry at the blacksmith, unlocking devastating forms through specific item synergies and level mastery.'
    }
        ];
    }

    create(parent) {
        this.container = document.createElement('section');
        this.container.className = 'game-features-section';
        this.container.id = 'game-features';
        
        this.container.innerHTML = `
            <!-- Diagonal stripes top -->
            <div class="gf-stripes gf-stripes-top">
                <div class="gf-stripe"></div>
                <div class="gf-stripe"></div>
                <div class="gf-stripe"></div>
            </div>
            
            <div class="gf-background"></div>
            
            <div class="gf-main-wrapper">
                <!-- Left Panel with diagonal cut -->
                <div class="gf-left-panel">
                    <div class="gf-panel-inner">
                        <div class="gf-label">
                            <span class="gf-label-text">// Game Features //</span>
                        </div>
                        <div class="gf-number">03</div>
                        <div class="gf-indicators">
                            ${this.features.map((f, i) => `
                                <button class="gf-indicator ${i === 0 ? 'active' : ''}" data-index="${i}">
                                    <span class="gf-indicator-fill"></span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Content Area with diagonal frame -->
                <div class="gf-content-area">
                    <div class="gf-carousel-wrapper">
                        <!-- Diagonal clipped frame -->
                        <div class="gf-diagonal-frame">
                            <div class="gf-slides">
                                ${this.features.map((f, i) => `
                                    <div class="gf-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
                                        <video class="gf-video" src="./src/video/${f.id}.mp4" muted loop playsinline preload="metadata"></video>
                                        <div class="gf-video-gradient"></div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Arrow navigation using custom images -->
                        <button class="gf-nav gf-prev clickable" aria-label="Previous">
                            <img src="./src/assets/arrowLx1.png" alt="" class="gf-arrow-img">
                        </button>
                        <button class="gf-nav gf-next clickable" aria-label="Next">
                            <img src="./src/assets/arrowLx1.png" alt="" class="gf-arrow-img gf-arrow-flip">
                        </button>
                    </div>
                    
                    <!-- Info bar at bottom right -->
                    <div class="gf-info-bar">
                        <div class="gf-info-content">
    <h3 class="gf-title">${this.features[0].title},</h3>
    <p class="gf-subtitle">${this.features[0].subtitle}</p>
    <p class="gf-description">${this.features[0].description}</p> 
    </div>
                    </div>
                </div>
            </div>
            
            <!-- Diagonal stripes bottom -->
            <div class="gf-stripes gf-stripes-bottom">
                <div class="gf-stripe"></div>
                <div class="gf-stripe"></div>
                <div class="gf-stripe"></div>
            </div>
        `;
        
        parent.appendChild(this.container);
        this.cacheElements();
        this.initVideos();
        this.bindEvents();
        this.setInitialStates();
        
        return this;
    }

    cacheElements() {
        this.slides = Array.from(this.container.querySelectorAll('.gf-slide'));
        this.indicators = Array.from(this.container.querySelectorAll('.gf-indicator'));
        this.prevBtn = this.container.querySelector('.gf-prev');
        this.nextBtn = this.container.querySelector('.gf-next');
        this.infoTitle = this.container.querySelector('.gf-title');
        this.infoSubtitle = this.container.querySelector('.gf-subtitle');
        this.infoDescription = this.container.querySelector('.gf-description');
    }

    initVideos() {
        this.slides.forEach((slide, i) => {
            const video = slide.querySelector('.gf-video');
            if (video) this.videos.set(i, video);
        });
    }

    setInitialStates() {
        gsap.set(this.container, { opacity: 0 });
        gsap.set(this.container.querySelector('.gf-left-panel'), { 
            x: -100, 
            opacity: 0,
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)'
        });
        gsap.set(this.container.querySelector('.gf-carousel-wrapper'), { opacity: 0, scale: 0.95, y: 20 });
        gsap.set(this.container.querySelector('.gf-info-bar'), { opacity: 0, y: 30 });
        gsap.set(this.container.querySelectorAll('.gf-stripe'), { scaleX: 0, transformOrigin: 'left center' });
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));
        
        this.indicators.forEach((ind, i) => ind.addEventListener('click', () => this.goTo(i)));
        
        // Video hover - play on hover, no play icon
        this.slides.forEach((slide, i) => {
            const video = this.videos.get(i);
            
            slide.addEventListener('mouseenter', () => {
                if (video && video.readyState >= 2) video.play().catch(() => {});
            });
            
            slide.addEventListener('mouseleave', () => {
                if (video) { video.pause(); video.currentTime = 0; }
            });
        });
        
        // Touch swipe
        let touchX = 0;
        const carousel = this.container.querySelector('.gf-carousel-wrapper');
        carousel.addEventListener('touchstart', e => touchX = e.changedTouches[0].screenX, { passive: true });
        carousel.addEventListener('touchend', e => {
            const diff = touchX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) this.navigate(diff > 0 ? 1 : -1);
        }, { passive: true });
    }

    navigate(dir) {
        if (this.isAnimating) return;
        this.goTo((this.currentIndex + dir + this.features.length) % this.features.length);
    }

    goTo(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        this.isAnimating = true;
        
        const oldSlide = this.slides[this.currentIndex];
        const newSlide = this.slides[index];
        const dir = index > this.currentIndex ? 1 : -1;
        const feature = this.features[index];
        
        const tl = gsap.timeline({ onComplete: () => { this.isAnimating = false; this.currentIndex = index; } });
        this.timelines.push(tl);
        
        // Squishy exit
        tl.to(oldSlide, { scaleX: 1.1, scaleY: 0.9, duration: 0.1, ease: 'power2.in' })
          .to(oldSlide, { x: dir * -100 + '%', scaleX: 0.8, scaleY: 1.2, opacity: 0, duration: 0.25, ease: 'power3.in',
              onComplete: () => { oldSlide.classList.remove('active'); gsap.set(oldSlide, { x: 0, scaleX: 1, scaleY: 1, opacity: 0 }); }
          });
        
        // Squishy enter
        newSlide.classList.add('active');
        gsap.set(newSlide, { x: dir * 100 + '%', scaleX: 0.8, scaleY: 1.2, opacity: 0 });
        
        tl.to(newSlide, { x: '0%', scaleX: 1.05, scaleY: 0.95, opacity: 1, duration: 0.2, ease: 'power2.out' }, '-=0.1')
          .to(newSlide, { scaleX: 0.97, scaleY: 1.03, duration: 0.1, ease: 'power2.inOut' })
          .to(newSlide, { scaleX: 1, scaleY: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
        
        this.updateInfo(feature, dir);
        
        // Update indicators with bounce
        this.indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
            if (i === index) {
                gsap.timeline()
                    .to(ind, { scale: 0.85, duration: 0.1 })
                    .to(ind, { scale: 1.15, duration: 0.2, ease: 'back.out(3)' })
                    .to(ind, { scale: 1, duration: 0.25, ease: 'elastic.out(1, 0.4)' });
            }
        });
    }

    updateInfo(feature, dir) {
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
       tl.to([this.infoTitle, this.infoSubtitle, this.infoDescription], { 
        y: dir * -20, 
        opacity: 0, 
        duration: 0.15, 
        stagger: 0.03, 
        ease: 'power2.in' 
    })
    .call(() => {
        this.infoTitle.textContent = feature.title + ',';
        this.infoSubtitle.textContent = feature.subtitle;
        this.infoDescription.textContent = feature.description; 
    })
    .fromTo([this.infoTitle, this.infoSubtitle, this.infoDescription], 
        { y: dir * 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'back.out(1.5)' });
}

    initScrollAnimations(scroller) {
        const trigger = ScrollTrigger.create({
            trigger: this.container,
            scroller: scroller,
            start: 'top 80%',
            once: true,
            onEnter: () => this.animateEntrance()
        });
        this.scrollTriggers.push(trigger);
    }

    animateEntrance() {
        const panel = this.container.querySelector('.gf-left-panel');
        const carousel = this.container.querySelector('.gf-carousel-wrapper');
        const info = this.container.querySelector('.gf-info-bar');
        const stripesTop = this.container.querySelectorAll('.gf-stripes-top .gf-stripe');
        const stripesBot = this.container.querySelectorAll('.gf-stripes-bottom .gf-stripe');
        const number = panel.querySelector('.gf-number');
        
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
        tl.to(this.container, { opacity: 1, duration: 0.3 })
          .to(stripesTop, { scaleX: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, '-=0.1')
          .to(panel, { x: 0, opacity: 1, clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0 100%)', duration: 0.7, ease: 'power3.out' }, '-=0.3')
          .fromTo(number, { scale: 0.5, opacity: 0 }, { scale: 1.1, opacity: 1, duration: 0.25, ease: 'back.out(2)' }, '-=0.3')
          .to(number, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.4)' })
          .to(carousel, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.4')
          .to(info, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }, '-=0.2')
          .to(stripesBot, { scaleX: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out' }, '-=0.2');
    }

    destroy() {
        this.scrollTriggers.forEach(st => st.kill());
        this.timelines.forEach(tl => tl && tl.kill && tl.kill());
        this.videos.forEach(v => { v.pause(); v.src = ''; });
        this.videos.clear();
        if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container);
    }
}

export const gameFeatures = new GameFeatures();
export default gameFeatures;
