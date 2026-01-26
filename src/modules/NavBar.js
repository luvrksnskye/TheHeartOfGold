/**
 * NavBar - Main Navigation Bar with Dropdown Menus
 * The Heart of Gold
 * Updated: Settings menu integration
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import sfxManager from '../utils/SFXManager.js';
import settingsMenu from './SettingsMenu.js';

class NavBar {
    constructor() {
        this.container = null;
        this.links = [
            { name: 'Homepage', icon: 'fa-solid fa-house', submenu: null, href: '#homepage' },
            { name: 'About', icon: 'fa-solid fa-angle-down', submenu: [
                { name: 'Overview', href: '#overview' },
                { name: 'Characters', href: '#characters' }
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
        this.activeDropdown = null;
    }

    create() {
        this.container = document.createElement('nav');
        this.container.id = 'main-nav';
        this.container.className = 'main-nav';
        
        const linksHtml = this.links.map(link => {
            const hasSubmenu = link.submenu !== null;
            const isSettings = link.isSettings === true;
            const submenuHtml = hasSubmenu ? `
                <div class="nav-submenu">
                    ${link.submenu.map(item => `
                        <a href="${item.href}" 
                           class="nav-submenu-item clickable"
                           ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                            ${item.name}
                            ${item.external ? '<i class="fa-solid fa-arrow-up-right-from-square nav-external-icon"></i>' : ''}
                        </a>
                    `).join('')}
                </div>
            ` : '';
            
            return `
                <div class="nav-item ${hasSubmenu ? 'has-submenu' : ''} ${isSettings ? 'is-settings' : ''}" data-section="${link.name.toLowerCase()}">
                    <a href="${link.href || '#'}" class="nav-link clickable" ${isSettings ? 'data-action="settings"' : ''}>
                        <span class="nav-link-text">${link.name}</span>
                        <i class="${link.icon} nav-icon"></i>
                    </a>
                    ${submenuHtml}
                </div>
            `;
        }).join('');
        
        this.container.innerHTML = `
            <div class="nav-content">
                <div class="nav-links">${linksHtml}</div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        
        // Create settings menu
        settingsMenu.create();
        
        this.bindEvents();
        this.initAnimations();
        
        return this;
    }

    initAnimations() {
        gsap.set(this.container, { opacity: 0, y: -20 });
        
        const submenus = this.container.querySelectorAll('.nav-submenu');
        submenus.forEach(submenu => {
            gsap.set(submenu, { 
                opacity: 0, 
                y: -10,
                scaleY: 0,
                transformOrigin: 'top center',
                display: 'none'
            });
        });
    }

    bindEvents() {
        const items = this.container.querySelectorAll('.nav-item');
        
        items.forEach(item => {
            const hasSubmenu = item.classList.contains('has-submenu');
            const isSettings = item.classList.contains('is-settings');
            
            if (hasSubmenu) {
                const submenu = item.querySelector('.nav-submenu');
                
                item.addEventListener('mouseenter', () => {
                    sfxManager.playGhost();
                    this.showSubmenu(submenu);
                });
                
                item.addEventListener('mouseleave', () => {
                    this.hideSubmenu(submenu);
                });
                
                const link = item.querySelector('.nav-link');
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                });
            } else if (isSettings) {
                const link = item.querySelector('.nav-link');
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    sfxManager.playConfirm();
                    settingsMenu.open();
                });
            } else {
                const link = item.querySelector('.nav-link');
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        sfxManager.playCheck1();
                        const section = item.dataset.section;
                        this.navigateToSection(section);
                    }
                });
            }
            
            // Hover sound for all items
            item.addEventListener('mouseenter', () => {
                if (!hasSubmenu) {
                    // Light sound on hover
                }
            });
        });
        
        const submenuItems = this.container.querySelectorAll('.nav-submenu-item');
        submenuItems.forEach(subitem => {
            subitem.addEventListener('mouseenter', () => {
                sfxManager.playCheck2();
            });
            
            subitem.addEventListener('click', (e) => {
                const href = subitem.getAttribute('href');
                const isExternal = subitem.hasAttribute('target');
                
                sfxManager.playConfirm();
                
                if (!isExternal && href && href.startsWith('#')) {
                    e.preventDefault();
                    const sectionName = subitem.textContent.trim();
                    this.navigateToSection(sectionName.toLowerCase().replace(/\s+/g, '-'));
                }
            });
        });
    }

    navigateToSection(section) {
        console.log(`Navigate to: ${section}`);
    }

    showSubmenu(submenu) {
        if (this.activeDropdown === submenu) return;
        
        if (this.activeDropdown) {
            this.hideSubmenu(this.activeDropdown);
        }
        
        this.activeDropdown = submenu;
        
        gsap.set(submenu, { display: 'flex' });
        
        const tl = gsap.timeline();
        tl.to(submenu, {
            opacity: 1,
            scaleY: 1,
            y: 0,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
        
        const items = submenu.querySelectorAll('.nav-submenu-item');
        tl.fromTo(items,
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
        
        tl.to(submenu, {
            opacity: 0,
            scaleY: 0,
            y: -10,
            duration: 0.2,
            ease: 'power2.in'
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

    destroy() {
        settingsMenu.destroy();
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const navBar = new NavBar();
export default navBar;
