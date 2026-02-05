/**
 * BlogScreen - Blog viewing screen with notebook interface
 * The Heart of Gold
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import audioManager from '../utils/AudioManager.js';
import stateManager from '../utils/StateManager.js';
import blogManager from './BlogManager.js';

class BlogScreen {
    constructor() {
        this.container = null;
        this.currentBlog = null;
        this.isMenuOpen = false;
        this.timelines = [];
        this.eventListeners = [];
        this.resizeHandler = null;
        this.scrollHandler = null;
        this.scrollIndicatorAnimation = null;
        this.mobileNoticeShown = false;
        this.MOBILE_NOTICE_KEY = 'thog_blog_mobile_notice_shown';
    }

    isMobileDevice() {
        return window.innerWidth <= 768 || 
               ('ontouchstart' in window && window.matchMedia('(pointer: coarse)').matches);
    }

    hasMobileNoticeBeenShown() {
        try {
            return localStorage.getItem(this.MOBILE_NOTICE_KEY) === 'true';
        } catch (e) {
            return this.mobileNoticeShown;
        }
    }

    setMobileNoticeShown() {
        this.mobileNoticeShown = true;
        try {
            localStorage.setItem(this.MOBILE_NOTICE_KEY, 'true');
        } catch (e) {
            // localStorage not available
        }
    }

    async create(blogId) {
        // Cleanup any existing instance
        if (this.container) {
            this.cleanup();
        }

        this.currentBlog = blogManager.getBlogById(blogId);
        
        if (!this.currentBlog) {
            console.error('Blog not found:', blogId);
            return this;
        }
        
        this.container = document.createElement('div');
        this.container.id = 'blog-screen';
        this.container.className = 'blog-screen blog-force-desktop';
        
        const allBlogs = blogManager.getAllBlogs();
        
        this.container.innerHTML = this.renderHTML(allBlogs, blogId);
        
        document.body.appendChild(this.container);
        
        // Set initial hidden state to prevent flash
        gsap.set(this.container, { opacity: 0 });
        
        this.cacheElements();
        this.setInitialStates();
        this.bindEvents();
        this.initAnimations();
        this.checkScrollability();
        
        // Show mobile notice if on mobile and not shown before
        if (this.isMobileDevice() && !this.hasMobileNoticeBeenShown()) {
            this.showMobileNotice();
        }
        
        return this;
    }

    showMobileNotice() {
        const notice = document.createElement('div');
        notice.className = 'blog-mobile-notice';
        notice.innerHTML = `
            <div class="mobile-notice-backdrop"></div>
            <div class="mobile-notice-card">
                <div class="mobile-notice-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                        <line x1="12" y1="18" x2="12" y2="18"/>
                    </svg>
                    <span class="notice-arrow">→</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                </div>
                <h3 class="mobile-notice-title">Better on Desktop!</h3>
                <p class="mobile-notice-text">For the best blog reading experience, we recommend visiting on a larger screen.</p>
                <button class="mobile-notice-btn clickable">Got it!</button>
            </div>
        `;
        
        this.container.appendChild(notice);
        
        // Cache notice elements
        const card = notice.querySelector('.mobile-notice-card');
        const backdrop = notice.querySelector('.mobile-notice-backdrop');
        const btn = notice.querySelector('.mobile-notice-btn');
        
        // Animate in
        gsap.set(notice, { opacity: 1 });
        gsap.set(backdrop, { opacity: 0 });
        gsap.set(card, { opacity: 0, scale: 0.8, y: 30 });
        
        const tl = gsap.timeline();
        tl.to(backdrop, { opacity: 1, duration: 0.3 })
          .to(card, { 
              opacity: 1, 
              scale: 1, 
              y: 0, 
              duration: 0.5, 
              ease: 'back.out(1.7)' 
          }, '-=0.1');
        
        // Squishy animation on card
        gsap.to(card, {
            scaleX: 1.02,
            scaleY: 0.98,
            duration: 0.8,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });
        
        // Close button handler
        const closeNotice = () => {
            this.setMobileNoticeShown();
            
            gsap.killTweensOf(card);
            
            const closeTl = gsap.timeline({
                onComplete: () => {
                    notice.remove();
                }
            });
            
            closeTl.to(card, { 
                opacity: 0, 
                scale: 0.8, 
                y: -20, 
                duration: 0.3, 
                ease: 'power2.in' 
            })
            .to(backdrop, { opacity: 0, duration: 0.2 }, '-=0.1');
        };
        
        btn.addEventListener('click', closeNotice);
        backdrop.addEventListener('click', closeNotice);
    }

    renderHTML(allBlogs, blogId) {
        return `
            <div class="blog-parallax-bg"></div>
            
            <div class="blog-menu-trigger clickable">
                <img src="./src/assets/button3x1.png" alt="" class="menu-trigger-img menu-trigger-img-default">
                <img src="./src/assets/button3x2.png" alt="" class="menu-trigger-img menu-trigger-img-hover">
            </div>
            
            <div class="blog-menu-sidebar">
                <div class="blog-menu-header">
                    <span class="menu-header-text">Blog Entries</span>
                </div>
                <div class="blog-menu-list">
                    ${allBlogs.map(blog => `
                        <button class="blog-menu-item clickable ${blog.id === blogId ? 'active' : ''}" 
                                data-blog-id="${blog.id}">
                            <span class="menu-item-date">${blog.date}</span>
                            <span class="menu-item-title">${blog.title}</span>
                        </button>
                    `).join('')}
                </div>
                <button class="blog-menu-close clickable">
                    <img src="./src/assets/button3x1.png" alt="" class="menu-close-img menu-close-img-default">
                    <img src="./src/assets/button3x2.png" alt="" class="menu-close-img menu-close-img-hover">
                </button>
            </div>
            
            <div class="blog-menu-overlay"></div>
            
            <div class="blog-notebook-container">
                <div class="notebook-wrapper">
                    <img src="./src/assets/BGx1.png" alt="" class="notebook-bg">
                    
                    <div class="notebook-content">
                        <div class="notebook-left-page">
                            <div class="page-content-scroll" id="blog-content-scroll">
                                <div class="blog-text-content">
                                    ${this.currentBlog.content}
                                </div>
                            </div>
                            <div class="scroll-indicator">
                                <img src="./src/assets/arrowx3.png" alt="" class="scroll-arrow">
                            </div>
                        </div>
                        
                        <div class="notebook-right-page">
                            <div class="blog-header-info">
                                <h1 class="blog-title">${this.currentBlog.title}</h1>
                                <div class="blog-meta">
                                    <span class="blog-date">${this.currentBlog.date}</span>
                                    <span class="blog-category">${this.currentBlog.category}</span>
                                </div>
                            </div>
                            <div class="blog-featured-image">
                                <img src="${this.currentBlog.image}" alt="" class="featured-img">
                            </div>
                            <div class="blog-description">
                                <p>${this.currentBlog.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="blog-corner-decoration">
                <img src="./src/assets/cornerx3.png" alt="" class="corner-img">
            </div>
        `;
    }

    cacheElements() {
        this.elements = {
            sidebar: this.container.querySelector('.blog-menu-sidebar'),
            overlay: this.container.querySelector('.blog-menu-overlay'),
            menuTrigger: this.container.querySelector('.blog-menu-trigger'),
            menuClose: this.container.querySelector('.blog-menu-close'),
            menuItems: this.container.querySelectorAll('.blog-menu-item'),
            notebook: this.container.querySelector('.notebook-wrapper'),
            corner: this.container.querySelector('.blog-corner-decoration'),
            scrollContainer: this.container.querySelector('#blog-content-scroll'),
            scrollContent: this.container.querySelector('.blog-text-content'),
            scrollIndicator: this.container.querySelector('.scroll-indicator'),
            scrollArrow: this.container.querySelector('.scroll-arrow')
        };
    }

    setInitialStates() {
        const { sidebar, overlay, notebook, corner, menuTrigger } = this.elements;
        
        gsap.set(sidebar, { x: '100%' });
        gsap.set(overlay, { opacity: 0, display: 'none' });
        gsap.set(notebook, { opacity: 0, scale: 0.8, y: 30 });
        gsap.set(corner, { opacity: 0, scale: 0 });
        gsap.set(menuTrigger, { opacity: 0, x: 20 });
    }

    initAnimations() {
        this.animateScrollIndicator();
        this.playBlogMusic();
    }

    playBlogMusic() {
        if (audioManager.isMusicEnabled()) {
            audioManager.playMusic('./src/music/day2theme_UPDT.mp3', true);
        }
    }

    animateScrollIndicator() {
        const { scrollArrow } = this.elements;
        if (!scrollArrow) return;
        
        this.scrollIndicatorAnimation = gsap.timeline({ repeat: -1 });
        
        this.scrollIndicatorAnimation
            .to(scrollArrow, {
                y: 8,
                duration: 0.6,
                ease: 'power2.inOut'
            })
            .to(scrollArrow, {
                y: 0,
                duration: 0.6,
                ease: 'power2.inOut'
            });
    }

    checkScrollability() {
        const { scrollContainer, scrollContent, scrollIndicator } = this.elements;
        if (!scrollContainer || !scrollContent) return;
        
        const isScrollable = scrollContent.scrollHeight > scrollContainer.clientHeight;
        
        gsap.to(scrollIndicator, { 
            opacity: isScrollable ? 1 : 0, 
            duration: 0.3 
        });
        
        // Setup scroll listener
        this.scrollHandler = () => {
            const scrollTop = scrollContainer.scrollTop;
            const maxScroll = scrollContent.scrollHeight - scrollContainer.clientHeight;
            
            if (scrollTop >= maxScroll - 20) {
                gsap.to(scrollIndicator, { opacity: 0, duration: 0.3 });
            } else if (isScrollable) {
                gsap.to(scrollIndicator, { opacity: 1, duration: 0.3 });
            }
        };
        
        scrollContainer.addEventListener('scroll', this.scrollHandler, { passive: true });
        
        // Setup resize handler
        this.resizeHandler = () => this.checkScrollability();
        window.addEventListener('resize', this.resizeHandler, { passive: true });
    }

    bindEvents() {
        const { menuTrigger, menuClose, overlay, menuItems } = this.elements;
        
        // Menu trigger
        const triggerClick = () => this.openMenu();
        menuTrigger.addEventListener('click', triggerClick);
        this.eventListeners.push({ element: menuTrigger, event: 'click', handler: triggerClick });
        
        // Menu close
        const closeClick = () => this.closeMenu();
        menuClose.addEventListener('click', closeClick);
        this.eventListeners.push({ element: menuClose, event: 'click', handler: closeClick });
        
        // Overlay click
        overlay.addEventListener('click', closeClick);
        this.eventListeners.push({ element: overlay, event: 'click', handler: closeClick });
        
        // Menu items
        menuItems.forEach(item => {
            const itemClick = () => {
                const blogId = item.dataset.blogId;
                if (blogId !== this.currentBlog.id) {
                    this.navigateToBlog(blogId);
                }
            };
            item.addEventListener('click', itemClick);
            this.eventListeners.push({ element: item, event: 'click', handler: itemClick });
            
            const itemEnter = () => {
                if (!item.classList.contains('active')) {
                    gsap.to(item, { x: -5, duration: 0.2, ease: 'power2.out' });
                }
            };
            item.addEventListener('mouseenter', itemEnter);
            this.eventListeners.push({ element: item, event: 'mouseenter', handler: itemEnter });
            
            const itemLeave = () => {
                if (!item.classList.contains('active')) {
                    gsap.to(item, { x: 0, duration: 0.2, ease: 'power2.out' });
                }
            };
            item.addEventListener('mouseleave', itemLeave);
            this.eventListeners.push({ element: item, event: 'mouseleave', handler: itemLeave });
        });
    }

    openMenu() {
        if (this.isMenuOpen) return;
        this.isMenuOpen = true;
        
        const { sidebar, overlay, menuItems } = this.elements;
        
        gsap.set(overlay, { display: 'block' });
        
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
        tl.to(overlay, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
        })
        .to(sidebar, {
            x: '0%',
            duration: 0.4,
            ease: 'power3.out'
        }, '-=0.2')
        .fromTo(menuItems, 
            { opacity: 0, x: 20 },
            {
                opacity: 1,
                x: 0,
                duration: 0.3,
                stagger: 0.05,
                ease: 'power2.out'
            },
            '-=0.2'
        );
    }

    closeMenu() {
        if (!this.isMenuOpen) return;
        this.isMenuOpen = false;
        
        const { sidebar, overlay } = this.elements;
        
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(overlay, { display: 'none' });
            }
        });
        this.timelines.push(tl);
        
        tl.to(sidebar, {
            x: '100%',
            duration: 0.3,
            ease: 'power3.in'
        })
        .to(overlay, {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in'
        }, '-=0.1');
    }

    async navigateToBlog(blogId) {
        this.closeMenu();
        
        await this.delay(300);
        
        const { notebook } = this.elements;
        
        // Animate out
        await new Promise(resolve => {
            gsap.to(notebook, {
                opacity: 0,
                scale: 0.95,
                y: 20,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: resolve
            });
        });
        
        // Update content
        this.currentBlog = blogManager.getBlogById(blogId);
        stateManager.setCurrentBlogId(blogId);
        
        this.updateContent();
        
        // Animate in
        gsap.fromTo(notebook,
            { opacity: 0, scale: 0.95, y: -20 },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.4,
                ease: 'back.out(1.5)'
            }
        );
        
        // Update menu items
        this.elements.menuItems.forEach(item => {
            item.classList.toggle('active', item.dataset.blogId === blogId);
            gsap.set(item, { x: 0 });
        });
    }

    updateContent() {
        const title = this.container.querySelector('.blog-title');
        const date = this.container.querySelector('.blog-date');
        const category = this.container.querySelector('.blog-category');
        const content = this.elements.scrollContent;
        const featuredImg = this.container.querySelector('.featured-img');
        const description = this.container.querySelector('.blog-description p');
        
        title.textContent = this.currentBlog.title;
        date.textContent = this.currentBlog.date;
        category.textContent = this.currentBlog.category;
        content.innerHTML = this.currentBlog.content;
        featuredImg.src = this.currentBlog.image;
        description.textContent = this.currentBlog.description;
        
        // Reset scroll
        if (this.elements.scrollContainer) {
            this.elements.scrollContainer.scrollTop = 0;
        }
        
        this.checkScrollability();
    }

    async show() {
        const { notebook, corner, menuTrigger } = this.elements;
        
        return new Promise(resolve => {
            const tl = gsap.timeline({ onComplete: resolve });
            this.timelines.push(tl);
            
            tl.to(this.container, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            })
            .to(notebook, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                ease: 'back.out(1.5)'
            }, '-=0.1')
            .to(corner, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: 'back.out(2)'
            }, '-=0.3')
            .to(menuTrigger, {
                opacity: 1,
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            }, '-=0.2');
        });
    }

    async hide() {
        const { notebook, corner } = this.elements;
        
        return new Promise(resolve => {
            const tl = gsap.timeline({
                onComplete: () => {
                    this.destroy();
                    resolve();
                }
            });
            
            tl.to([corner, notebook], {
                opacity: 0,
                scale: 0.9,
                duration: 0.3,
                ease: 'power2.in'
            })
            .to(this.container, {
                opacity: 0,
                duration: 0.2,
                ease: 'power2.in'
            }, '-=0.1');
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    cleanup() {
        // Remove event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
        
        // Remove global listeners
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        if (this.scrollHandler && this.elements?.scrollContainer) {
            this.elements.scrollContainer.removeEventListener('scroll', this.scrollHandler);
        }
        
        // Kill timelines
        this.timelines.forEach(tl => tl?.kill?.());
        this.timelines = [];
        
        if (this.scrollIndicatorAnimation) {
            this.scrollIndicatorAnimation.kill();
            this.scrollIndicatorAnimation = null;
        }
    }

    destroy() {
        this.cleanup();
        
        if (this.container?.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        this.container = null;
        this.currentBlog = null;
        this.elements = null;
    }
}

export const blogScreen = new BlogScreen();
export default blogScreen;
