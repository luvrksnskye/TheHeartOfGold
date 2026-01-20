/**
 * NavBar - Barra de navegacion principal
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';

class NavBar {
    constructor() {
        this.container = null;
        this.links = ['Home', 'About', 'Socials', 'Media', 'Settings'];
    }

    create() {
        this.container = document.createElement('nav');
        this.container.id = 'main-nav';
        this.container.className = 'main-nav';
        
        const linksHtml = this.links.map(link => 
            `<a href="#${link.toLowerCase()}" class="nav-link" data-section="${link.toLowerCase()}">${link}</a>`
        ).join('');
        
        this.container.innerHTML = `
            <div class="nav-content">
                <div class="nav-links">${linksHtml}</div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        this.bindEvents();
        gsap.set(this.container, { opacity: 0, y: -20 });
        
        return this;
    }

    bindEvents() {
        const links = this.container.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                console.log(`Navigate to: ${section}`);
                // TODO: Implementar navegacion
            });
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
