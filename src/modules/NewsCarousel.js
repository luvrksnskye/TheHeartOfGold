import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import transition from './Transition.js';

class NewsCarousel {
    constructor() {
        this.container = null; this.track = null; this.panels = null; this.indicators = null;
        this.currentIndex = 0; this.isNavigating = false; this.panelWidth = 0; this.gap = 32; this.touchStartX = 0;
        this.newsData = [
            { id: 1, date: 'February, 2025', title: 'Demo Launch Announcement Event', description: 'Experience the first playable demo of The Heart of Gold. Face waves of enemies and discover the combat system.', blogId: '01' },
            { id: 2, date: 'January 21, 2025', title: 'Meet the Characters', description: 'Discover the unique heroes of The Heart of Gold, each with their own combat style and abilities.', blogId: '02' },
            { id: 3, date: 'January, 2025', title: 'Development Update', description: 'Behind the scenes look at the development progress and upcoming features.', blogId: '03' }
        ];
    }

    create(parent) {
        this.container = document.createElement('div');
        this.container.className = 'news-carousel-wrapper';
        this.container.innerHTML = `<button class="news-nav news-nav-prev clickable" aria-label="Previous news"><img src="./src/assets/arrowLx1.png" alt="" class="nav-arrow-img"></button><div class="news-carousel"><div class="news-carousel-track">${this.newsData.map((n, i) => this.createPanel(n, i)).join('')}</div></div><button class="news-nav news-nav-next clickable" aria-label="Next news"><img src="./src/assets/arrowLx1.png" alt="" class="nav-arrow-img"></button>`;
        parent.appendChild(this.container);
        this.track = this.container.querySelector('.news-carousel-track');
        this.panels = this.container.querySelectorAll('.news-panel');
        this.createIndicators(parent);
        this.bindEvents();
        this.updatePanelWidth();
        gsap.set(this.track, { x: 0 });
        return this;
    }

    createPanel(n, i) {
        return `<article class="news-panel ${i === 0 ? 'active' : ''}" data-index="${i}" data-blog-id="${n.blogId}"><div class="panel-bg"><img src="./src/assets/barrax3.png" alt="" class="panel-bar"></div><div class="panel-shimmer"></div><div class="panel-content clickable"><div class="panel-image"><div class="panel-image-placeholder"><span class="placeholder-icon">&#9733;</span></div></div><div class="panel-info"><time class="panel-date">${n.date}</time><h3 class="panel-title">${n.title}</h3><p class="panel-description">${n.description}</p></div></div><div class="panel-cat-marco"><img src="./src/assets/Hud_Cat_marco.png" alt="" class="cat-marco-img"></div></article>`;
    }

    createIndicators(parent) {
        const wrap = document.createElement('div');
        wrap.className = 'news-indicators';
        wrap.innerHTML = this.newsData.map((_, i) => `<button class="news-indicator clickable ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to news ${i + 1}"></button>`).join('');
        parent.appendChild(wrap);
        this.indicators = wrap.querySelectorAll('.news-indicator');
    }

    bindEvents() {
        this.container.querySelector('.news-nav-prev').addEventListener('click', () => this.navigate(-1));
        this.container.querySelector('.news-nav-next').addEventListener('click', () => this.navigate(1));
        this.indicators.forEach((ind, i) => ind.addEventListener('click', () => this.goToSlide(i)));
        this.panels.forEach(panel => {
            const cat = panel.querySelector('.panel-cat-marco'), content = panel.querySelector('.panel-content');
            panel.addEventListener('mouseenter', () => { if (this.isNavigating) return; gsap.to(panel, { y: -25, scale: 1.08, zIndex: 10, duration: 0.4, ease: 'back.out(1.5)' }); gsap.to(cat, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }); });
            panel.addEventListener('mouseleave', () => { if (this.isNavigating) return; gsap.to(panel, { y: 0, scale: 1, zIndex: 1, duration: 0.3, ease: 'power2.out' }); gsap.to(cat, { opacity: 0, scale: 0.5, y: 30, duration: 0.3, ease: 'power2.in' }); });
            content.addEventListener('click', () => { if (this.isNavigating) return; this.navigateToBlog(panel.dataset.blogId, panel); });
        });
        const carousel = this.container.querySelector('.news-carousel');
        carousel.addEventListener('touchstart', (e) => { this.touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', (e) => { const diff = this.touchStartX - e.changedTouches[0].screenX; if (Math.abs(diff) > 50) this.navigate(diff > 0 ? 1 : -1); }, { passive: true });
        window.addEventListener('resize', () => this.updatePanelWidth());
    }

    updatePanelWidth() { if (this.panels.length > 0) this.panelWidth = this.panels[0].offsetWidth + this.gap; }
    navigate(dir) { const idx = this.currentIndex + dir; if (idx >= 0 && idx < this.newsData.length) this.goToSlide(idx); }

    goToSlide(i) {
        if (i === this.currentIndex || this.isNavigating) return;
        this.panels[this.currentIndex].classList.remove('active');
        this.indicators[this.currentIndex].classList.remove('active');
        this.currentIndex = i;
        this.panels[this.currentIndex].classList.add('active');
        this.indicators[this.currentIndex].classList.add('active');
        this.updatePanelWidth();
        gsap.to(this.track, { x: -i * this.panelWidth, duration: 0.6, ease: 'power2.out' });
    }

    async navigateToBlog(id, panel) {
        if (this.isNavigating) return; this.isNavigating = true;
        const shim = panel.querySelector('.panel-shimmer');
        const tl = gsap.timeline();
        tl.to(panel, { y: -40, scale: 1.15, zIndex: 20, duration: 0.3, ease: 'power2.out' })
          .to(shim, { opacity: 1, duration: 0.1 })
          .to(shim, { x: '300%', duration: 0.5, ease: 'power1.in' })
          .to(panel, { filter: 'brightness(1.8)', duration: 0.2, ease: 'power2.out' }, '-=0.3')
          .to(shim, { opacity: 0, duration: 0.1 })
          .to(panel, { filter: 'brightness(2.5)', duration: 0.1 })
          .to(panel, { filter: 'brightness(1)', duration: 0.1 });
        await new Promise(r => tl.eventCallback('onComplete', r));
        await transition.transitionIn();
        window.location.href = `./src/blogs/${id}/index.html`;
    }

    destroy() { if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container); }
}

export const newsCarousel = new NewsCarousel();
export default newsCarousel;
