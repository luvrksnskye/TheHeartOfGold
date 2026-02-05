/**
 * NavBar - Main Navigation Bar with Blog Support
 * The Heart of Gold
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import sfxManager from '../utils/SFXManager.js';
import settingsMenu from './SettingsMenu.js';
import stateManager, { AppStates } from '../utils/StateManager.js';
import blogNavigator from './BlogNavigator.js';

class NavBar {
    constructor() {
        this.container = null;
        this.activeDropdown = null;
        this.eventListeners = [];
        this.timelines = [];
        
        this.links = [
            { name: 'Homepage', icon: 'fa-solid fa-house', submenu: null, href: '#homepage' },
            { name: 'About', icon: 'fa-solid fa-angle-down', submenu: [
                { name: 'Overview', href: '#overview' },
                { name: 'Characters', href: '#meet-characters' }
            ]},
            { name: 'Socials', icon: 'fa-solid fa-angle-down', submenu: [
                { name: 'Twitter (X)', href: 'https://x.com/TheHeartOfGold7', external: true }
            ]},
            { name: 'Media', icon: 'fa-solid fa-angle-down', submenu: [
                { name: 'Soundtrack', href: '#soundtrack' },
                { name: 'Voice Cast', href: '#voice-cast' }
            ]},
            { name: 'Settings', icon: 'fa-solid fa-gear', submenu: null, href: '#settings', isSettings: true }
        ];
    }

    create() {
        // Cleanup existing
        if (this.container) {
            this.destroy();
        }

        this.container = document.createElement('nav');
        this.container.id = 'main-nav';
        this.container.className = 'main-nav';
        
        this.container.innerHTML = this.renderHTML();
        
        document.body.appendChild(this.container);
        
        // Create settings menu
        settingsMenu.create();
        
        this.cacheElements();
        this.initAnimations();
        this.bindEvents();
        
        return this;
    }

    renderHTML() {
        let linksHtml = '';
        
        this.links.forEach(link => {
            const hasSubmenu = link.submenu !== null;
            const isSettings = link.isSettings === true;
            
            let submenuHtml = '';
            if (hasSubmenu) {
                const submenuItems = link.submenu.map(item => {
                    const externalAttr = item.external ? 'target="_blank" rel="noopener noreferrer"' : '';
                    const externalIcon = item.external ? '<i class="fa-solid fa-arrow-up-right-from-square nav-external-icon"></i>' : '';
                    return `<a href="${item.href}" class="nav-submenu-item clickable" ${externalAttr}>${item.name}${externalIcon}</a>`;
                }).join('');
                submenuHtml = `<div class="nav-submenu">${submenuItems}</div>`;
            }
            
            const classes = ['nav-item'];
            if (hasSubmenu) classes.push('has-submenu');
            if (isSettings) classes.push('is-settings');
            
            const settingsAttr = isSettings ? 'data-action="settings"' : '';
            const linkHref = link.href || '#';
            
            linksHtml += `
                <div class="${classes.join(' ')}" data-section="${link.name.toLowerCase()}">
                    <a href="${linkHref}" class="nav-link clickable" ${settingsAttr}>
                        <span class="nav-link-text">${link.name}</span>
                        <i class="${link.icon} nav-icon"></i>
                    </a>
                    ${submenuHtml}
                </div>
            `;
        });
        
        return `<div class="nav-content"><div class="nav-links">${linksHtml}</div></div>`;
    }

    cacheElements() {
        this.elements = {
            items: this.container.querySelectorAll('.nav-item'),
            submenus: this.container.querySelectorAll('.nav-submenu'),
            submenuItems: this.container.querySelectorAll('.nav-submenu-item')
        };
    }

    initAnimations() {
        // Set initial hidden state
        gsap.set(this.container, { opacity: 0, y: -20 });
        
        // Set initial submenu states
        this.elements.submenus.forEach(submenu => {
            gsap.set(submenu, { 
                opacity: 0, 
                y: -10,
                scaleY: 0,
                transformOrigin: 'top center',
                display: 'none',
                force3D: true
            });
        });
    }

    bindEvents() {
        this.elements.items.forEach(item => {
            const hasSubmenu = item.classList.contains('has-submenu');
            const isSettings = item.classList.contains('is-settings');
            const navLink = item.querySelector('.nav-link');
            const submenu = item.querySelector('.nav-submenu');
            
            if (hasSubmenu) {
                // Submenu hover
                const enterHandler = () => {
                    sfxManager.playGhost?.();
                    this.showSubmenu(submenu);
                };
                const leaveHandler = () => this.hideSubmenu(submenu);
                const clickHandler = (e) => e.preventDefault();
                
                item.addEventListener('mouseenter', enterHandler);
                item.addEventListener('mouseleave', leaveHandler);
                navLink.addEventListener('click', clickHandler);
                
                this.eventListeners.push(
                    { element: item, event: 'mouseenter', handler: enterHandler },
                    { element: item, event: 'mouseleave', handler: leaveHandler },
                    { element: navLink, event: 'click', handler: clickHandler }
                );
            } else if (isSettings) {
                // Settings button
                const clickHandler = (e) => {
                    e.preventDefault();
                    sfxManager.playConfirm?.();
                    settingsMenu.open();
                };
                
                navLink.addEventListener('click', clickHandler);
                this.eventListeners.push({ element: navLink, event: 'click', handler: clickHandler });
            } else {
                // Regular navigation
                const clickHandler = (e) => {
                    const href = navLink.getAttribute('href');
                    if (href?.startsWith('#')) {
                        e.preventDefault();
                        sfxManager.playCheck1?.();
                        this.navigateToSection(item.dataset.section);
                    }
                };
                
                navLink.addEventListener('click', clickHandler);
                this.eventListeners.push({ element: navLink, event: 'click', handler: clickHandler });
            }
        });
        
        // Submenu items
        this.elements.submenuItems.forEach(subitem => {
            const enterHandler = () => sfxManager.playCheck2?.();
            const clickHandler = (e) => {
                const href = subitem.getAttribute('href');
                const isExternal = subitem.hasAttribute('target');
                
                sfxManager.playConfirm?.();
                
                if (!isExternal && href?.startsWith('#')) {
                    e.preventDefault();
                    const sectionName = subitem.textContent.trim().toLowerCase().replace(/\s+/g, '-');
                    this.navigateToSection(sectionName);
                }
            };
            
            subitem.addEventListener('mouseenter', enterHandler);
            subitem.addEventListener('click', clickHandler);
            
            this.eventListeners.push(
                { element: subitem, event: 'mouseenter', handler: enterHandler },
                { element: subitem, event: 'click', handler: clickHandler }
            );
        });
    }

    async navigateToSection(section) {
        // Check if we're in a blog state and need to navigate back
        if (stateManager.isInBlogState()) {
            await blogNavigator.navigateToHome(section);
        } else {
            this.scrollToSection(section);
        }
    }

    scrollToSection(section) {
        const scrollContainer = document.querySelector('.home-scroll-container');
        if (!scrollContainer) return;
        
        const sectionMap = {
            'homepage': 'home-hero',
            'overview': 'overview-section',
            'characters': 'characters-section',
            'meet-characters': 'meet-characters-subsection',
            'voice-cast': 'voice-cast-subsection'
        };
        
        const targetId = sectionMap[section] || section;
        
        // Try getElementById first, then querySelector for class-based selectors
        let target = document.getElementById(targetId);
        if (!target) {
            target = document.querySelector(`.${targetId}`);
        }
        if (!target) {
            target = document.querySelector(`#${targetId}`);
        }
        
        if (target) {
            // Calculate the correct offset considering nested elements
            let offsetTop = 0;
            let element = target;
            
            while (element && element !== scrollContainer) {
                offsetTop += element.offsetTop;
                element = element.offsetParent;
            }
            
            gsap.to(scrollContainer, { 
                scrollTop: offsetTop, 
                duration: 0.8, 
                ease: 'power2.inOut' 
            });
        }
    }

    showSubmenu(submenu) {
        if (this.activeDropdown === submenu) return;
        
        // Hide any currently active submenu
        if (this.activeDropdown) {
            this.hideSubmenu(this.activeDropdown);
        }
        
        this.activeDropdown = submenu;
        
        gsap.set(submenu, { display: 'flex' });
        
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
        tl.to(submenu, { 
            opacity: 1, 
            scaleY: 1, 
            y: 0, 
            duration: 0.3, 
            ease: 'back.out(1.7)',
            force3D: true
        });
        
        tl.fromTo(submenu.querySelectorAll('.nav-submenu-item'),
            { opacity: 0, x: -10 },
            { 
                opacity: 1, 
                x: 0, 
                duration: 0.2, 
                stagger: 0.08, 
                ease: 'power2.out' 
            },
            '-=0.2'
        );
    }

    hideSubmenu(submenu) {
        if (!submenu) return;
        
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(submenu, { display: 'none' });
                if (this.activeDropdown === submenu) {
                    this.activeDropdown = null;
                }
            }
        });
        this.timelines.push(tl);
        
        tl.to(submenu, { 
            opacity: 0, 
            scaleY: 0, 
            y: -10, 
            duration: 0.2, 
            ease: 'power2.in',
            force3D: true
        });
    }

    async show() {
        return new Promise(resolve => {
            gsap.to(this.container, { 
                opacity: 1, 
                y: 0, 
                duration: 0.6, 
                ease: 'power2.out', 
                onComplete: resolve 
            });
        });
    }

    async hide() {
        return new Promise(resolve => {
            gsap.to(this.container, { 
                opacity: 0, 
                y: -20, 
                duration: 0.4, 
                ease: 'power2.in', 
                onComplete: resolve 
            });
        });
    }

    cleanup() {
        // Remove event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
        
        // Kill timelines
        this.timelines.forEach(tl => tl?.kill?.());
        this.timelines = [];
        
        this.activeDropdown = null;
    }

    destroy() {
        this.cleanup();
        settingsMenu.destroy();
        
        if (this.container?.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        this.container = null;
        this.elements = null;
    }
}

export const navBar = new NavBar();
export default navBar;
