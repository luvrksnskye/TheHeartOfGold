/**
 * NewsCarousel
 * The Heart of Gold
 * Based on GSAP seamless loop technique
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';
import transition from './Transition.js';

gsap.registerPlugin(ScrollTrigger);

class NewsCarousel {
    constructor() {
        this.container = null;
        this.cardsContainer = null;
        this.panels = [];
        this.filteredPanels = [];
        this.activeCategory = 'latest';
        this.isNavigating = false;
        this.isFiltering = false;
        
        // Seamless loop variables
        this.seamlessLoop = null;
        this.scrub = null;
        this.iteration = 0;
        this.spacing = 0.20;
        
        this.categories = [
            { id: 'latest', label: 'Latest' },
            { id: 'news', label: 'News' },
            { id: 'notices', label: 'Notices' },
            { id: 'events', label: 'Events' }
        ];
        
        this.newsData = [
            { 
                id: '01', 
                date: 'February, 2025', 
                title: 'Demo Launch Announcement Event', 
                description: 'Experience the first playable demo of The Heart of Gold.',
                category: 'events',
                featured: true
            },
            { 
                id: '02', 
                date: 'January 21, 2025', 
                title: 'Meet the Characters', 
                description: 'Discover the unique heroes of The Heart of Gold, each with their own combat style and abilities.',
                category: 'news',
                featured: false
            },
            { 
                id: '03', 
                date: 'January, 2025', 
                title: 'Development Update', 
                description: 'Behind the scenes look at the development progress and upcoming features.',
                category: 'notices',
                featured: false
            },
            { 
                id: '04', 
                date: 'January, 2025', 
                title: 'Idk', 
                description: 'Bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla ',
                category: 'news',
                featured: true
            },
            { 
                id: '05', 
                date: 'February, 2025', 
                title: 'Community Event: Beta Testers', 
                description: 'Ola',
                category: 'events',
                featured: false
            },
            { 
                id: '06', 
                date: 'February, 2025', 
                title: 'Official Site Launch', 
                description: 'Welcome to the official site of The Heart of Gold! Stay tuned for the latest news and updates.',
                category: 'notices',
                featured: false
            }
        ];
    }

    create(parent) {
        this.container = document.createElement('div');
        this.container.className = 'news-section-wrapper';
        
        this.container.innerHTML = `
            <div class="news-header">
                <div class="news-title-badge">
                    <img src="./src/assets/Hud_boton_inventariox2.png" alt="" class="title-badge-bg">
                    <div class="title-badge-content">
                        <span class="title-slash">//</span>
                        <span class="title-text">NEWS AND INFO</span>
                        <span class="title-slash">//</span>
                    </div>
                </div>
                
                <div class="news-category-bar">
                    <div class="category-bar-inner">
                        ${this.categories.map((cat, i) => `
                            <button class="category-tab clickable ${i === 0 ? 'active' : ''}" 
                                    data-category="${cat.id}">
                                <span class="tab-text">${cat.label}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="news-carousel-area">
                <div class="carousel-gallery">
                    <div class="carousel-cards">
                        ${this.newsData.map((n, i) => this.createPanel(n, i)).join('')}
                    </div>
                </div>
                
                <div class="carousel-actions">
                    <button class="carousel-nav carousel-prev clickable" aria-label="Previous">
                        <img src="./src/assets/arrowLx1.png" alt="" class="nav-arrow-img">
                    </button>
                    <div class="carousel-indicators">
                        ${this.newsData.map((_, i) => `
                            <button class="carousel-dot clickable ${i === 0 ? 'active' : ''}" data-index="${i}"></button>
                        `).join('')}
                    </div>
                    <button class="carousel-nav carousel-next clickable" aria-label="Next">
                        <img src="./src/assets/arrowLx1.png" alt="" class="nav-arrow-img nav-arrow-next">
                    </button>
                </div>
            </div>
            
            <div class="news-speed-decoration">
                <img src="./src/assets/3xspeed_1.png" alt="" class="speed-icon">
            </div>
        `;
        
        parent.appendChild(this.container);
        
        this.cardsContainer = this.container.querySelector('.carousel-cards');
        this.panels = Array.from(this.container.querySelectorAll('.news-panel'));
        this.filteredPanels = [...this.panels];
        
        this.initCarousel();
        this.bindEvents();
        this.animateEntrance();
        
        return this;
    }

    createPanel(n, i) {
        return `
            <article class="news-panel ${n.featured ? 'featured' : ''}" 
                     data-index="${i}" 
                     data-blog-id="${n.id}"
                     data-category="${n.category}">
                <div class="panel-bg">
                    <img src="./src/assets/barrax3.png" alt="" class="panel-bar">
                </div>
                <div class="panel-shimmer"></div>
                <div class="panel-content clickable">
                    <div class="panel-image">
                        <div class="panel-image-placeholder">
                            <span class="placeholder-icon"></span>
                        </div>
                    </div>
                    <div class="panel-info">
                        <div class="panel-meta">
                            <span class="panel-category-tag">${n.category}</span>
                            <time class="panel-date">${n.date}</time>
                        </div>
                        <h3 class="panel-title">${n.title}</h3>
                        <p class="panel-description">${n.description}</p>
                    </div>
                </div>
                <div class="panel-cat-marco">
                    <img src="./src/assets/Hud_Cat_marco.png" alt="" class="cat-marco-img">
                </div>
            </article>
        `;
    }

    initCarousel() {
        gsap.set(this.panels, { 
            xPercent: 0, 
            opacity: 1, 
            scale: 1,
            zIndex: 1
        });
        
        this.buildSeamlessLoop();
    }

    buildSeamlessLoop() {
        const items = this.filteredPanels;
        if (items.length === 0) return;
        
        const spacing = this.spacing;
        const overlap = Math.ceil(1 / spacing);
        const startTime = items.length * spacing + 0.5;
        const loopTime = (items.length + overlap) * spacing + 1;
        
        const rawSequence = gsap.timeline({ paused: true });
        
        this.seamlessLoop = gsap.timeline({
            paused: true,
            repeat: -1,
            onRepeat: function() {
                if (this._time === this._dur) {
                    this._tTime += this._dur - 0.01;
                }
            }
        });
        
        const l = items.length + overlap * 2;
        
        gsap.set(items, { 
            xPercent: 400, 
            opacity: 0, 
            scale: 0.6,
            zIndex: 1
        });
        
        for (let i = 0; i < l; i++) {
            const index = i % items.length;
            const item = items[index];
            const time = i * spacing;
            
            rawSequence.fromTo(item, 
                { scale: 0.6, opacity: 0 }, 
                { 
                    scale: 1, 
                    opacity: 1, 
                    zIndex: 100, 
                    duration: 0.5, 
                    yoyo: true, 
                    repeat: 1, 
                    ease: 'back.out(1.7)', 
                    immediateRender: false 
                }, 
                time
            );
            
            rawSequence.fromTo(item, 
                { xPercent: 300 }, 
                { 
                    xPercent: -300, 
                    duration: 1, 
                    ease: 'none', 
                    immediateRender: false 
                }, 
                time
            );
            
            if (i <= items.length) {
                this.seamlessLoop.add('label' + i, time);
            }
        }
        
        rawSequence.time(startTime);
        
        this.seamlessLoop
            .to(rawSequence, {
                time: loopTime,
                duration: loopTime - startTime,
                ease: 'none'
            })
            .fromTo(rawSequence, 
                { time: overlap * spacing + 1 }, 
                {
                    time: startTime,
                    duration: startTime - (overlap * spacing + 1),
                    immediateRender: false,
                    ease: 'none'
                }
            );
        
        this.scrub = gsap.to(this.seamlessLoop, {
            totalTime: 0,
            duration: 0.5,
            ease: 'power3',
            paused: true
        });
        
        this.scrubTo(this.spacing * 2);
    }

    scrubTo(totalTime) {
        if (!this.seamlessLoop || !this.scrub) return;
        
        this.scrub.vars.totalTime = gsap.utils.snap(this.spacing)(totalTime);
        this.scrub.invalidate().restart();
    }

    navigate(direction) {
        if (!this.scrub || this.isFiltering) return;
        
        const currentTime = this.scrub.vars.totalTime || 0;
        const newTime = currentTime + (direction * this.spacing);
        this.scrubTo(newTime);
        
        this.updateIndicators(direction);
    }

    updateIndicators(direction) {
        const dots = this.container.querySelectorAll('.carousel-dot');
        const currentActive = this.container.querySelector('.carousel-dot.active');
        let currentIndex = currentActive ? parseInt(currentActive.dataset.index) : 0;
        
        currentIndex += direction;
        if (currentIndex >= this.filteredPanels.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = this.filteredPanels.length - 1;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    filterByCategory(category) {
        if (category === this.activeCategory || this.isFiltering) return;
        
        this.isFiltering = true;
        this.activeCategory = category;
        
        const tabs = this.container.querySelectorAll('.category-tab');
        tabs.forEach(tab => {
            const isActive = tab.dataset.category === category;
            tab.classList.toggle('active', isActive);
            
            if (isActive) {
                gsap.timeline()
                    .to(tab, { scaleX: 0.9, scaleY: 1.1, duration: 0.1, ease: 'power2.in' })
                    .to(tab, { scaleX: 1.1, scaleY: 0.9, duration: 0.15, ease: 'power2.out' })
                    .to(tab, { scaleX: 1, scaleY: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
            }
        });
        
        const toHide = this.panels.filter(p => 
            category !== 'latest' && p.dataset.category !== category
        );
        const toShow = this.panels.filter(p => 
            category === 'latest' || p.dataset.category === category
        );
        
        // Kill existing carousel
        if (this.seamlessLoop) this.seamlessLoop.kill();
        if (this.scrub) this.scrub.kill();
        
        // Squishy hide animation
        const hideTimeline = gsap.timeline();
        
        toHide.forEach((panel, i) => {
            hideTimeline.to(panel, {
                scaleX: 1.4,
                scaleY: 0.6,
                opacity: 0.7,
                duration: 0.12,
                ease: 'power2.in'
            }, i * 0.04)
            .to(panel, {
                scaleX: 0.3,
                scaleY: 1.8,
                opacity: 0,
                y: 50,
                duration: 0.18,
                ease: 'power3.in',
                onComplete: () => {
                    panel.style.display = 'none';
                }
            }, i * 0.04 + 0.12);
        });
        
        hideTimeline.call(() => {
            this.filteredPanels = toShow;
            
            toShow.forEach((panel, i) => {
                panel.style.display = 'block';
                gsap.set(panel, { 
                    scaleX: 0.5, 
                    scaleY: 1.6, 
                    opacity: 0,
                    y: -30,
                    xPercent: 0
                });
                
                gsap.timeline({ delay: i * 0.06 })
                    .to(panel, {
                        scaleX: 1.2,
                        scaleY: 0.8,
                        opacity: 1,
                        y: 10,
                        duration: 0.15,
                        ease: 'power2.out'
                    })
                    .to(panel, {
                        scaleX: 0.9,
                        scaleY: 1.1,
                        y: -5,
                        duration: 0.12,
                        ease: 'power2.inOut'
                    })
                    .to(panel, {
                        scaleX: 1,
                        scaleY: 1,
                        y: 0,
                        duration: 0.3,
                        ease: 'elastic.out(1, 0.5)'
                    });
            });
            
            setTimeout(() => {
                this.rebuildCarousel();
                this.updateIndicatorCount();
                this.isFiltering = false;
            }, toShow.length * 60 + 500);
        });
    }

    rebuildCarousel() {
        if (this.seamlessLoop) this.seamlessLoop.kill();
        if (this.scrub) this.scrub.kill();
        
        gsap.set(this.filteredPanels, {
            xPercent: 0,
            scale: 1,
            opacity: 1,
            zIndex: 1,
            y: 0
        });
        
        if (this.filteredPanels.length > 0) {
            this.buildSeamlessLoop();
        }
    }

    updateIndicatorCount() {
        const indicatorsContainer = this.container.querySelector('.carousel-indicators');
        indicatorsContainer.innerHTML = this.filteredPanels.map((_, i) => `
            <button class="carousel-dot clickable ${i === 0 ? 'active' : ''}" data-index="${i}"></button>
        `).join('');
        
        indicatorsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                this.scrubTo(this.spacing * (index + 2));
                
                indicatorsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
                    d.classList.toggle('active', i === index);
                });
            });
        });
    }

    bindEvents() {
        const tabs = this.container.querySelectorAll('.category-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.filterByCategory(tab.dataset.category);
            });
        });
        
        const prevBtn = this.container.querySelector('.carousel-prev');
        const nextBtn = this.container.querySelector('.carousel-next');
        
        prevBtn.addEventListener('click', () => this.navigate(-1));
        nextBtn.addEventListener('click', () => this.navigate(1));
        
        this.panels.forEach(panel => {
            const cat = panel.querySelector('.panel-cat-marco');
            const content = panel.querySelector('.panel-content');
            
            panel.addEventListener('mouseenter', () => {
                if (this.isNavigating || this.isFiltering) return;
                
                gsap.to(panel, { 
                    y: -20, 
                    scale: 1.08, 
                    zIndex: 150, 
                    duration: 0.4, 
                    ease: 'back.out(1.7)' 
                });
                
                gsap.to(cat, { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0, 
                    duration: 0.5, 
                    ease: 'back.out(2)' 
                });
            });
            
            panel.addEventListener('mouseleave', () => {
                if (this.isNavigating || this.isFiltering) return;
                
                gsap.to(panel, { 
                    y: 0, 
                    scale: 1, 
                    zIndex: 100, 
                    duration: 0.3, 
                    ease: 'power2.out' 
                });
                
                gsap.to(cat, { 
                    opacity: 0, 
                    scale: 0.5, 
                    y: 30, 
                    duration: 0.3, 
                    ease: 'power2.in' 
                });
            });
            
            content.addEventListener('click', () => {
                if (this.isNavigating || this.isFiltering) return;
                this.navigateToBlog(panel.dataset.blogId, panel);
            });
        });
        
        this.container.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                this.scrubTo(this.spacing * (index + 2));
                
                this.container.querySelectorAll('.carousel-dot').forEach((d, i) => {
                    d.classList.toggle('active', i === index);
                });
            });
        });
        
        let touchStartX = 0;
        const gallery = this.container.querySelector('.carousel-gallery');
        
        gallery.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        gallery.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                this.navigate(diff > 0 ? 1 : -1);
            }
        }, { passive: true });
    }

    animateEntrance() {
        const badge = this.container.querySelector('.news-title-badge');
        const categoryBar = this.container.querySelector('.news-category-bar');
        const tabs = this.container.querySelectorAll('.category-tab');
        const carouselArea = this.container.querySelector('.news-carousel-area');
        const speedDecor = this.container.querySelector('.news-speed-decoration');
        
        gsap.set([badge, categoryBar, carouselArea, speedDecor], { opacity: 0, y: 30 });
        gsap.set(tabs, { opacity: 0, x: -20 });
        
        const tl = gsap.timeline({ delay: 0.2 });
        
        tl.to(badge, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'back.out(1.7)'
        })
        .to(categoryBar, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.3')
        .to(tabs, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: 'back.out(1.5)'
        }, '-=0.2')
        .to(carouselArea, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.2')
        .to(speedDecor, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.3');
        
        this.animateSpeedIcon();
    }

    animateSpeedIcon() {
        const speedIcon = this.container.querySelector('.speed-icon');
        if (!speedIcon) return;
        
        gsap.to(speedIcon, {
            y: -10,
            duration: 2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
        
        gsap.to(speedIcon, {
            rotate: 5,
            duration: 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
    }

    async navigateToBlog(id, panel) {
        if (this.isNavigating) return;
        this.isNavigating = true;
        
        const shim = panel.querySelector('.panel-shimmer');
        const tl = gsap.timeline();
        
        tl.to(panel, { 
            y: -40, 
            scale: 1.15, 
            zIndex: 200, 
            duration: 0.3, 
            ease: 'power2.out' 
        })
        .to(shim, { opacity: 1, duration: 0.1 })
        .to(shim, { x: '300%', duration: 0.5, ease: 'power1.in' })
        .to(panel, { 
            filter: 'brightness(1.8)', 
            duration: 0.2, 
            ease: 'power2.out' 
        }, '-=0.3')
        .to(shim, { opacity: 0, duration: 0.1 })
        .to(panel, { filter: 'brightness(2.5)', duration: 0.1 })
        .to(panel, { filter: 'brightness(1)', duration: 0.1 });
        
        await new Promise(r => tl.eventCallback('onComplete', r));
        await transition.transitionIn();
        
        window.location.href = `./src/blogs/${id}/index.html`;
    }

    destroy() {
        if (this.seamlessLoop) this.seamlessLoop.kill();
        if (this.scrub) this.scrub.kill();
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const newsCarousel = new NewsCarousel();
export default newsCarousel;
