/**
 * NavBar - Barra de navegacion principal con menús desplegables
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';

class NavBar {
    constructor() {
        this.container = null;
        this.links = [
            { name: 'Home', icon: '', submenu: null },
            { name: 'About', icon: 'fa-solid fa-angle-down', submenu: ['Overview', 'Characters'] },
            { name: 'Socials', icon: 'fa-solid fa-angle-down', submenu: ['Twitter(X)', 'Kickstarter'] },
            { name: 'Media', icon: 'fa-solid fa-angle-down', submenu: ['Soundtrack', 'Voice Cast'] },
            { name: 'Settings', icon: 'fa-solid fa-gear', submenu: null }
        ];
        this.activeDropdown = null;
    }

    create() {
        this.container = document.createElement('nav');
        this.container.id = 'main-nav';
        this.container.className = 'main-nav';
        
        const linksHtml = this.links.map(link => {
            const hasSubmenu = link.submenu !== null;
            const submenuHtml = hasSubmenu ? `
                <div class="nav-submenu">
                    ${link.submenu.map(item => `
                        <a href="#${item.toLowerCase().replace(' ', '-')}" class="nav-submenu-item clickable">
                            ${item}
                        </a>
                    `).join('')}
                </div>
            ` : '';
            
            return `
                <div class="nav-item ${hasSubmenu ? 'has-submenu' : ''}" data-section="${link.name.toLowerCase()}">
                    <a href="#${link.name.toLowerCase()}" class="nav-link clickable">
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
            
            if (hasSubmenu) {
                const submenu = item.querySelector('.nav-submenu');
                
                item.addEventListener('mouseenter', () => {
                    this.showSubmenu(submenu);
                });
                
                item.addEventListener('mouseleave', () => {
                    this.hideSubmenu(submenu);
                });
            }
            
            // Click en el link principal
            const link = item.querySelector('.nav-link');
            link.addEventListener('click', (e) => {
                if (!hasSubmenu) {
                    e.preventDefault();
                    const section = item.dataset.section;
                    console.log(`Navigate to: ${section}`);
                    // TODO: Implementar navegacion
                }
            });
        });
        
        // Click en items del submenu
        const submenuItems = this.container.querySelectorAll('.nav-submenu-item');
        submenuItems.forEach(subitem => {
            subitem.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Navigate to: ${subitem.textContent.trim()}`);
                // TODO: Implementar navegacion
            });
        });
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
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const navBar = new NavBar();
export default navBar;
