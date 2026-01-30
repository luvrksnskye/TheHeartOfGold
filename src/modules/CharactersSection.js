/**
 * CharactersSection - Meet The Characters Interactive Section
 * The Heart of Gold
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';
import coreAnimation from '../utils/CoreAnimation.js';
import sfxManager from '../utils/SFXManager.js';

gsap.registerPlugin(ScrollTrigger);

class CharactersSection {
    constructor() {
        this.container = null;
        this.currentCharacter = null;
        this.isAnimating = false;
        this.scrollTriggers = [];
        this.timelines = [];
        
        this.characters = [
            {
                id: 'shiori',
                name: 'Shiori',
                description: 'A little girl brought from another universe, who possesses unique powers unknown even to those skilled in magic or technology. With a noble character and friendly attitude, she is one of the playable characters intended for players specializing in "glass cannon" archetype characters.',
                icon: './src/assets/shiori-icon.png',
                splash: './src/assets/shio.png',
                nameImg: './src/assets/shiori_name.png',
                sprites: [
                    './src/assets/shio/shiodefecne-Sheet.gif',
                    './src/assets/shio/attack.gif'
                ],
                card: './src/assets/shiori-card.png',
                color: '#9b59b6',
                stripeColor: '#8e44ad'
            },
            {
                id: 'irene',
                name: 'Irene',
                description: 'ola',
                icon: './src/assets/irene-icon.png',
                splash: './src/assets/irene.png',
                nameImg: './src/assets/irene_name.png',
                sprites: [
                    './src/assets/irene/block.gif',
                    './src/assets/irene/idle.gif'
                ],
                card: './src/assets/irene-card.png',
                color: '#e74c3c',
                stripeColor: '#c0392b'
            },
            {
                id: 'zoe',
                name: 'Zoe',
                description: 'An aspiring knight, she is very positive, with a cheerful and somewhat noisy attitude. She is a little silly and very confident in herself. Thanks to her high health and defense, she is the perfect character for players new to the genre.',
                icon: './src/assets/zoe-icon.png',
                splash: './src/assets/zoe.png',
                nameImg: './src/assets/zoe_name.png',
                sprites: [
                    './src/assets/zoe/zoewin.gif',
                    './src/assets/zoe/attack1-front.gif',
                    './src/assets/zoe/attack1-side.gif'
                ],
                card: './src/assets/zoe-card.png',
                color: '#ff69b4',
                stripeColor: '#ff1493'
            },
            {
                id: 'maya',
                name: 'Maya',
                description: 'A Slime girl who wields magic, with a shy and very introverted personality, she specializes in ghost magic. She has high movement speed and area attack, making her perfect as a damage-specialized (DPS) character.',
                icon: './src/assets/maya-icon.png',
                splash: './src/assets/maya.png',
                nameImg: './src/assets/maya_name.png',
                sprites: [
                    './src/assets/maya/maya_idle.gif',
                    './src/assets/maya/attack1-diagonaltwox1.gif',
                    './src/assets/maya/attack1-frontx1.gif'
                ],
                card: './src/assets/maya-card.png',
                color: '#2ecc71',
                stripeColor: '#27ae60'
            }
        ];
    }

    create(parent) {
        this.container = document.createElement('section');
        this.container.id = 'characters-section';
        this.container.className = 'characters-section';
        this.container.setAttribute('data-character', 'shiori');
        
        this.container.innerHTML = `
            <!-- Fade edges for smooth transitions -->
            <div class="char-fade-top"></div>
            <div class="char-fade-bottom"></div>
            
            <div class="characters-background">
                <div class="char-bg-solid"></div>
                <div class="char-bg-stripes"></div>
            </div>
            
            <!-- Section Header with Echo Effect -->
            <div class="characters-header">
                <div class="char-title-wrapper">
                    <span class="char-section-label">// SECTION 04 //</span>
                    <div class="char-title-stack">
                        <h2 class="char-section-title char-title-echo char-title-echo-top" aria-hidden="true">MEET THE CHARACTERS</h2>
                        <h2 class="char-section-title char-title-main">MEET THE CHARACTERS</h2>
                        <h2 class="char-section-title char-title-echo char-title-echo-bottom" aria-hidden="true">MEET THE CHARACTERS</h2>
                    </div>
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="characters-content">
                <div class="char-top-row">
                    <!-- Character Icons -->
                    <div class="char-icons-column">
                        <div class="char-icons-grid">
                            ${this.characters.map((char, i) => `
                                <button class="char-icon-wrapper clickable ${i === 0 ? 'active' : ''}" 
                                        data-character="${char.id}" 
                                        data-index="${i}"
                                        aria-label="Select ${char.name}">
                                    <img src="./src/assets/character-icons_behind-select.png" alt="" class="char-icon-bg">
                                    <img src="${char.icon}" alt="${char.name}" class="char-icon-img">
                                    <img src="./src/assets/icon-selection-hover.png" alt="" class="char-icon-hover">
                                </button>
                            `).join('')}
                        </div>
                        
                        <!-- Sprite Display -->
                        <div class="char-sprite-area">
                            <div class="char-sprite-container">
                                ${this.characters.map((char, i) => `
                                    <div class="char-sprite-wrapper ${i === 0 ? 'active' : ''}" data-character="${char.id}">
                                        <img src="${char.sprites[0]}" alt="${char.name}" class="char-sprite-img" data-sprite-index="0" onerror="this.style.display='none'">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Center: Splash Art with Name -->
                    <div class="char-splash-column">
                        <div class="char-splash-container">
                            ${this.characters.map((char, i) => `
                                <div class="char-splash-wrapper ${i === 0 ? 'active' : ''}" data-character="${char.id}">
                                    <img src="${char.splash}" alt="${char.name}" class="char-splash-img">
                                </div>
                            `).join('')}
                        </div>
                        
                        <!-- Character Name Image -->
                        <div class="char-name-area">
                            ${this.characters.map((char, i) => `
                                <div class="char-name-img-wrapper ${i === 0 ? 'active' : ''}" data-character="${char.id}">
                                    <img src="${char.nameImg}" alt="${char.name}" class="char-name-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                                    <span class="char-name-text-fallback">${char.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Right: Info Panel -->
                    <div class="char-info-column">
                        <div class="char-panel-wrapper">
                            <!-- Panel Background -->
                            <div class="char-panel-bg">
                                <img src="./src/assets/info-panel.png" alt="" class="char-panel-img">
                            </div>
                            
                            <!-- Panel Content -->
                            <div class="char-panel-content">
                                <!-- Character Card -->
                                <div class="char-card-container">
                                    ${this.characters.map((char, i) => `
                                        <div class="char-card-wrapper ${i === 0 ? 'active' : ''}" data-character="${char.id}">
                                            <img src="${char.card}" alt="${char.name}" class="char-card-img" onerror="this.parentElement.innerHTML='<div class=\\'char-card-placeholder\\'><span>Card Coming Soon</span></div>'">
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <!-- Character Description -->
                                <div class="char-description-container">
                                    <p class="char-info-description">${this.characters[0].description || 'Information coming soon...'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        parent.appendChild(this.container);
        this.currentCharacter = this.characters[0];
        this.cacheElements();
        this.bindEvents();
        this.setInitialStates();
        
        return this;
    }

    cacheElements() {
        this.iconWrappers = Array.from(this.container.querySelectorAll('.char-icon-wrapper'));
        this.spriteWrappers = Array.from(this.container.querySelectorAll('.char-sprite-wrapper'));
        this.splashWrappers = Array.from(this.container.querySelectorAll('.char-splash-wrapper'));
        this.nameImgWrappers = Array.from(this.container.querySelectorAll('.char-name-img-wrapper'));
        this.cardWrappers = Array.from(this.container.querySelectorAll('.char-card-wrapper'));
        this.descriptionDisplay = this.container.querySelector('.char-info-description');
        this.panelWrapper = this.container.querySelector('.char-panel-wrapper');
    }

    setInitialStates() {
        const header = this.container.querySelector('.characters-header');
        const topRow = this.container.querySelector('.char-top-row');
        
        gsap.set(header, { opacity: 0, y: 30 });
        gsap.set(topRow, { opacity: 0 });
        
        this.iconWrappers.forEach(icon => {
            const hover = icon.querySelector('.char-icon-hover');
            gsap.set(hover, { opacity: 0, scale: 0.8 });
        });
    }

    bindEvents() {
        this.iconWrappers.forEach(icon => {
            icon.addEventListener('click', () => {
                const characterId = icon.dataset.character;
                this.selectCharacter(characterId);
            });
            
            icon.addEventListener('mouseenter', () => {
                const hover = icon.querySelector('.char-icon-hover');
                coreAnimation.squish(icon, { intensity: 0.5, duration: 0.3 });
                gsap.to(hover, { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(2)' });
            });
            
            icon.addEventListener('mouseleave', () => {
                const hover = icon.querySelector('.char-icon-hover');
                if (!icon.classList.contains('active')) {
                    gsap.to(hover, { opacity: 0, scale: 0.8, duration: 0.2 });
                }
            });
        });
        
        let touchStartX = 0;
        const splashContainer = this.container.querySelector('.char-splash-container');
        
        splashContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        splashContainer.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                const currentIndex = this.characters.findIndex(c => c.id === this.currentCharacter.id);
                const newIndex = diff > 0 
                    ? (currentIndex + 1) % this.characters.length
                    : (currentIndex - 1 + this.characters.length) % this.characters.length;
                this.selectCharacter(this.characters[newIndex].id);
            }
        }, { passive: true });
    }

    selectCharacter(characterId) {
        if (this.isAnimating || this.currentCharacter?.id === characterId) return;
        
        const character = this.characters.find(c => c.id === characterId);
        if (!character) return;
        
        this.isAnimating = true;
        sfxManager.playCheck1();
        
        const oldCharacter = this.currentCharacter;
        this.currentCharacter = character;
        
        this.container.setAttribute('data-character', characterId);
        
        this.iconWrappers.forEach(icon => {
            const isActive = icon.dataset.character === characterId;
            icon.classList.toggle('active', isActive);
            
            const hover = icon.querySelector('.char-icon-hover');
            gsap.to(hover, { 
                opacity: isActive ? 1 : 0, 
                scale: isActive ? 1 : 0.8, 
                duration: 0.2 
            });
        });
        
        this.animateSpriteTransition(oldCharacter.id, characterId);
        this.animateSplashTransition(oldCharacter.id, characterId);
        this.animateNameImgTransition(oldCharacter.id, characterId);
        this.animateCardTransition(oldCharacter.id, characterId);
        this.updateTextContent(character);
    }

    getRandomSprite(character) {
        const randomIndex = Math.floor(Math.random() * character.sprites.length);
        return { url: character.sprites[randomIndex], index: randomIndex };
    }

    animateSpriteTransition(oldId, newId) {
        const oldSprite = this.spriteWrappers.find(s => s.dataset.character === oldId);
        const newSprite = this.spriteWrappers.find(s => s.dataset.character === newId);
        const newCharacter = this.characters.find(c => c.id === newId);
        
        const randomSprite = this.getRandomSprite(newCharacter);
        const spriteImg = newSprite.querySelector('.char-sprite-img');
        
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
        tl.to(oldSprite, {
            x: -80,
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => oldSprite.classList.remove('active')
        });
        
        spriteImg.src = randomSprite.url;
        spriteImg.dataset.spriteIndex = randomSprite.index;
        
        newSprite.classList.add('active');
        gsap.set(newSprite, { x: 80, opacity: 0, scale: 0.8 });
        
        tl.to(newSprite, {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.7)'
        }, '-=0.1');
    }

    animateSplashTransition(oldId, newId) {
        const oldSplash = this.splashWrappers.find(s => s.dataset.character === oldId);
        const newSplash = this.splashWrappers.find(s => s.dataset.character === newId);
        
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
        tl.to(oldSplash, {
            y: 50,
            opacity: 0,
            scale: 0.9,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => oldSplash.classList.remove('active')
        });
        
        newSplash.classList.add('active');
        gsap.set(newSplash, { y: -50, opacity: 0, scale: 0.9 });
        
        tl.to(newSplash, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.5)'
        }, '-=0.15');
    }

    animateNameImgTransition(oldId, newId) {
        const oldName = this.nameImgWrappers.find(n => n.dataset.character === oldId);
        const newName = this.nameImgWrappers.find(n => n.dataset.character === newId);
        
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
        tl.to(oldName, {
            y: 20,
            opacity: 0,
            scale: 0.9,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => oldName.classList.remove('active')
        });
        
        newName.classList.add('active');
        gsap.set(newName, { y: -20, opacity: 0, scale: 0.9 });
        
        tl.to(newName, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(1.5)'
        }, '-=0.1');
    }

    animateCardTransition(oldId, newId) {
        const oldCard = this.cardWrappers.find(c => c.dataset.character === oldId);
        const newCard = this.cardWrappers.find(c => c.dataset.character === newId);
        
        const tl = gsap.timeline({
            onComplete: () => { this.isAnimating = false; }
        });
        this.timelines.push(tl);
        
        tl.to(oldCard, {
            y: -30,
            opacity: 0,
            scale: 0.9,
            rotateY: -15,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => oldCard.classList.remove('active')
        });
        
        newCard.classList.add('active');
        gsap.set(newCard, { y: 30, opacity: 0, scale: 0.9, rotateY: 15 });
        
        tl.to(newCard, {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            duration: 0.4,
            ease: 'back.out(1.5)'
        }, '-=0.1');
    }

    updateTextContent(character) {
        const descDisplay = this.descriptionDisplay;
        
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
        tl.to(descDisplay, {
            opacity: 0,
            y: -10,
            duration: 0.15,
            ease: 'power2.in'
        });
        
        tl.call(() => {
            descDisplay.textContent = character.description || 'Information coming soon...';
        });
        
        tl.to(descDisplay, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'back.out(1.5)'
        });
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
        const header = this.container.querySelector('.characters-header');
        const topRow = this.container.querySelector('.char-top-row');
        const icons = this.iconWrappers;
        
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
        tl.to(header, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
        });
        
        const titleMain = header.querySelector('.char-title-main');
        if (titleMain) {
            coreAnimation.animateText(titleMain, { delay: 0.2 });
        }
        
        tl.to(topRow, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.3');
        
        tl.fromTo(icons,
            { opacity: 0, scale: 0.5, y: 20 },
            { 
                opacity: 1, 
                scale: 1, 
                y: 0, 
                duration: 0.4, 
                stagger: 0.1, 
                ease: 'back.out(2)' 
            },
            '-=0.3'
        );
        
        const activeSprite = this.spriteWrappers.find(s => s.classList.contains('active'));
        if (activeSprite) {
            tl.fromTo(activeSprite,
                { opacity: 0, scale: 0.5, x: -50 },
                { opacity: 1, scale: 1, x: 0, duration: 0.6, ease: 'back.out(1.7)' },
                '-=0.3'
            );
        }
        
        const activeSplash = this.splashWrappers.find(s => s.classList.contains('active'));
        if (activeSplash) {
            tl.fromTo(activeSplash,
                { opacity: 0, scale: 0.8, y: 30 },
                { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' },
                '-=0.5'
            );
        }
        
        tl.fromTo(this.panelWrapper,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
            '-=0.4'
        );
    }

    destroy() {
        this.scrollTriggers.forEach(st => st.kill());
        this.timelines.forEach(tl => tl && tl.kill && tl.kill());
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const charactersSection = new CharactersSection();
export default charactersSection;