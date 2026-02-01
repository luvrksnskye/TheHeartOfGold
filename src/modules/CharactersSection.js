/**
 * CharactersSection - Section 04: Meet Characters + Voice Cast
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
        this.currentVCCharacter = null;
        this.currentLanguage = 'english';
        this.isPlayingVoiceline = false;
        this.currentAudio = null;
        
        this.characters = [
            {
                id: 'shiori', name: 'Shiori', archetype: 'Glass Cannon',
                description: 'A little girl brought from another universe, who possesses unique powers unknown even to those skilled in magic or technology. With a noble character and friendly attitude, she is one of the playable characters intended for players specializing in "glass cannon" archetype characters.',
                icon: './src/assets/shiori-icon.png', splash: './src/assets/shio.png', nameImg: './src/assets/shiori_name.png',
                sprites: ['./src/assets/shio/shiodefecne-Sheet.gif', './src/assets/shio/attack.gif'],
                card: './src/assets/shiori-card.png', color: '#9b59b6',
                stats: { hp: 'Low', atk: 'High', def: 'Low', spd: 'Medium' }
            },
            {
                id: 'irene', name: 'Irene', archetype: 'ola',
                description: 'idk ahhwsdsh no se  qponer ayudenme',
                icon: './src/assets/irene-icon.png', splash: './src/assets/irene.png', nameImg: './src/assets/irene_name.png',
                sprites: ['./src/assets/irene/block.gif', './src/assets/irene/idle.gif'],
                card: './src/assets/irene-card.png', color: '#e74c3c',
                stats: { hp: 'Medium', atk: 'Medium', def: 'Medium', spd: 'Medium' }
            },
            {
                id: 'zoe', name: 'Zoe', archetype: 'Tank',
                description: 'An aspiring knight, she is very positive, with a cheerful and somewhat noisy attitude. She is a little silly and very confident in herself. Thanks to her high health and defense, she is the perfect character for players new to the genre.',
                icon: './src/assets/zoe-icon.png', splash: './src/assets/zoe.png', nameImg: './src/assets/zoe_name.png',
                sprites: ['./src/assets/zoe/zoewin.gif', './src/assets/zoe/attack1-front.gif'],
                card: './src/assets/zoe-card.png', color: '#ff69b4',
                stats: { hp: 'High', atk: 'Medium', def: 'High', spd: 'Low' }
            },
            {
                id: 'maya', name: 'Maya', archetype: 'DPS Mage',
                description: 'A Slime girl who wields magic, with a shy and very introverted personality, she specializes in ghost magic. She has high movement speed and area attack, making her perfect as a damage-specialized (DPS) character.',
                icon: './src/assets/maya-icon.png', splash: './src/assets/maya.png', nameImg: './src/assets/maya_name.png',
                sprites: ['./src/assets/maya/maya_idle.gif', './src/assets/maya/attack1-diagonaltwox1.gif'],
                card: './src/assets/maya-card.png', color: '#2ecc71',
                stats: { hp: 'Low', atk: 'High', def: 'Low', spd: 'High' }
            }
        ];
        
        this.voiceCast = {
            irene: {
                portrait: './src/characters/irene.png',
                voiceActors: { english: 'Abby Espiritu', spanish: 'Por anunciar', japanese: 'Por anunciar' },
                voicelines: { english: './src/voicelines/irene_en.mp3', spanish: './src/voicelines/irene_es.mp3', japanese: './src/voicelines/irene_jp.mp3' }
            },
            shiori: {
                portrait: './src/characters/shiori.png',
                voiceActors: { english: 'Phoebe Chan', spanish: 'Por anunciar', japanese: 'Por anunciar' },
                voicelines: { english: './src/voicelines/shiori_eng.wav', spanish: './src/voicelines/shiori_es.mp3', japanese: './src/voicelines/shiori_jp.mp3' }
            },
            zoe: {
                portrait: './src/characters/zoe.png',
                voiceActors: { english: 'Su Ling Chan', spanish: 'Por anunciar', japanese: 'Por anunciar' },
                voicelines: { english: './src/voicelines/zoe_en.mp3', spanish: './src/voicelines/zoe_es.mp3', japanese: './src/voicelines/zoe_jp.mp3' }
            },
            maya: {
                portrait: './src/characters/maya.png',
                voiceActors: { english: 'Ciara Payne', spanish: 'Por anunciar', japanese: 'Por anunciar' },
                voicelines: { english: './src/voicelines/maya_en.mp3', spanish: './src/voicelines/maya_es.mp3', japanese: './src/voicelines/maya_jp.mp3' }
            }
        };
        
        this.vcOrder = ['irene', 'shiori', 'zoe', 'maya'];
    }

    create(parent) {
        this.container = document.createElement('section');
        this.container.id = 'characters-section';
        this.container.className = 'characters-section';
        this.container.setAttribute('data-character', 'shiori');
        this.container.innerHTML = this.generateHTML();
        parent.appendChild(this.container);
        this.currentCharacter = this.characters[0];
        this.cacheElements();
        this.bindEvents();
        this.setInitialStates();
        return this;
    }

    generateHTML() {
        const charIconsHTML = this.characters.map((char, i) => `
            <button class="char-icon-wrapper clickable ${i === 0 ? 'active' : ''}" data-character="${char.id}" data-index="${i}" aria-label="Select ${char.name}">
                <img src="./src/assets/character-icons_behind-select.png" alt="" class="char-icon-bg" loading="lazy">
                <img src="${char.icon}" alt="${char.name}" class="char-icon-img" loading="lazy">
                <img src="./src/assets/icon-selection-hover.png" alt="" class="char-icon-hover" loading="lazy">
            </button>
        `).join('');

        const splashHTML = this.characters.map((char, i) => `
            <div class="char-splash-wrapper ${i === 0 ? 'active' : ''}" data-character="${char.id}">
                <img src="${char.splash}" alt="${char.name}" class="char-splash-img" loading="lazy">
            </div>
        `).join('');

        const nameHTML = this.characters.map((char, i) => `
            <div class="char-name-img-wrapper ${i === 0 ? 'active' : ''}" data-character="${char.id}">
                <img src="${char.nameImg}" alt="${char.name}" class="char-name-img" loading="lazy">
            </div>
        `).join('');

        const spriteHTML = this.characters.map((char, i) => `
            <div class="char-sprite-wrapper ${i === 0 ? 'active' : ''}" data-character="${char.id}">
                <img src="${char.sprites[0]}" alt="${char.name} sprite" class="char-sprite-img" loading="lazy">
            </div>
        `).join('');

        const cardHTML = this.characters.map((char, i) => `
            <div class="char-card-wrapper ${i === 0 ? 'active' : ''}" data-character="${char.id}">
                <img src="${char.card}" alt="${char.name} Card" class="char-card-img" loading="lazy">
            </div>
        `).join('');

        const vcPortraitsHTML = this.vcOrder.map(id => {
            const char = this.characters.find(c => c.id === id);
            const vcData = this.voiceCast[id];
            return `
                <div class="vc-portrait-card clickable" data-vc-character="${id}">
                    <img src="${vcData.portrait}" alt="${char?.name || id}" class="vc-portrait-img" loading="lazy">
                    <div class="vc-portrait-name"><span>${char?.name || id}</span></div>
                    <div class="vc-particles">
                        <span class="vc-particle"></span><span class="vc-particle"></span><span class="vc-particle"></span>
                        <span class="vc-particle"></span><span class="vc-particle"></span>
                    </div>
                </div>
            `;
        }).join('');

        const waveformHTML = Array(12).fill('<span class="vc-wave-bar"></span>').join('');

        return `
            <div class="characters-background">
                <div class="char-bg-solid"></div>
                <div class="char-bg-stripes"></div>
            </div>
            
            <div class="meet-characters-subsection">
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
                
                <div class="meet-characters-content">
                    <div class="char-display-area">
                        <div class="char-icons-column">
                            <div class="char-icons-grid">${charIconsHTML}</div>
                        </div>
                        
                        <div class="char-splash-column">
                            <div class="char-splash-container">${splashHTML}</div>
                            <div class="char-name-area">${nameHTML}</div>
                        </div>
                        
                        <div class="char-info-panel-container">
                            <div class="char-info-panel active" id="char-info-panel">
                                <div class="char-panel-bg"></div>
                                <div class="char-sprite-display">${spriteHTML}</div>
                                <div class="char-panel-content">
                                    <div class="char-panel-card">${cardHTML}</div>
                                    <div class="char-profile-info">
                                        <div class="char-profile-row"><span class="char-profile-label">Archetype</span><span class="char-profile-value" id="char-archetype">${this.characters[0].archetype}</span></div>
                                        <div class="char-profile-row"><span class="char-profile-label">HP</span><span class="char-profile-value" id="char-hp">${this.characters[0].stats.hp}</span></div>
                                        <div class="char-profile-row"><span class="char-profile-label">ATK</span><span class="char-profile-value" id="char-atk">${this.characters[0].stats.atk}</span></div>
                                        <div class="char-profile-row"><span class="char-profile-label">DEF</span><span class="char-profile-value" id="char-def">${this.characters[0].stats.def}</span></div>
                                        <div class="char-profile-row"><span class="char-profile-label">SPD</span><span class="char-profile-value" id="char-spd">${this.characters[0].stats.spd}</span></div>
                                    </div>
                                    <div class="char-panel-description">
                                        <p class="char-info-description" id="char-description">${this.characters[0].description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="section-divider">
                <div class="divider-line"></div>
            </div>
            
            <div class="voice-cast-subsection">
                <div class="voice-cast-header">
                    <div class="vc-title-wrapper">
                        <span class="vc-section-label">// SECTION 04 //</span>
                        <div class="vc-title-stack">
                            <h2 class="vc-section-title">MEET OUR VOICE CAST</h2>
                        </div>
                    </div>
                </div>
                
                <div class="voice-cast-interface">
                    <div class="vc-portraits-row">${vcPortraitsHTML}</div>
                    
                    <div class="vc-control-panel" id="vc-control-panel">
                        <div class="vc-language-section">
                            <span class="vc-language-label">Select Voice Language</span>
                            <div class="vc-language-buttons">
                                <button class="vc-lang-btn clickable active" data-lang="english">ENG</button>
                                <button class="vc-lang-btn clickable" data-lang="spanish">ES</button>
                                <button class="vc-lang-btn clickable" data-lang="japanese">JP</button>
                            </div>
                        </div>
                        
                        <div class="vc-actor-section">
                            <div class="vc-actor-info">
                                <span class="vc-actor-label">Voice Actor</span>
                                <span class="vc-actor-name" id="vc-actor-name">-</span>
                            </div>
                            <span class="vc-character-label" id="vc-character-label">Select a character above</span>
                        </div>
                        
                        <div class="vc-player-section">
                            <span class="vc-player-label">Voice Sample</span>
                            <div class="vc-player-controls" id="vc-player-controls">
                                <button class="vc-play-btn clickable" id="vc-play-btn" aria-label="Play voiceline">
                                    <svg class="vc-play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    <svg class="vc-pause-icon" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                </button>
                                <div class="vc-waveform">${waveformHTML}</div>
                            </div>
                            <div class="vc-progress"><div class="vc-progress-bar" id="vc-progress-bar"></div></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    cacheElements() {
        this.iconWrappers = Array.from(this.container.querySelectorAll('.char-icon-wrapper'));
        this.spriteWrappers = Array.from(this.container.querySelectorAll('.char-sprite-wrapper'));
        this.splashWrappers = Array.from(this.container.querySelectorAll('.char-splash-wrapper'));
        this.nameImgWrappers = Array.from(this.container.querySelectorAll('.char-name-img-wrapper'));
        this.cardWrappers = Array.from(this.container.querySelectorAll('.char-card-wrapper'));
        this.infoPanel = this.container.querySelector('#char-info-panel');
        this.descriptionEl = this.container.querySelector('#char-description');
        this.archetypeEl = this.container.querySelector('#char-archetype');
        this.hpEl = this.container.querySelector('#char-hp');
        this.atkEl = this.container.querySelector('#char-atk');
        this.defEl = this.container.querySelector('#char-def');
        this.spdEl = this.container.querySelector('#char-spd');
        this.vcPortraits = Array.from(this.container.querySelectorAll('.vc-portrait-card'));
        this.vcControlPanel = this.container.querySelector('#vc-control-panel');
        this.vcLangBtns = Array.from(this.container.querySelectorAll('.vc-lang-btn'));
        this.vcActorName = this.container.querySelector('#vc-actor-name');
        this.vcCharacterLabel = this.container.querySelector('#vc-character-label');
        this.vcPlayerControls = this.container.querySelector('#vc-player-controls');
        this.vcPlayBtn = this.container.querySelector('#vc-play-btn');
        this.vcProgressBar = this.container.querySelector('#vc-progress-bar');
    }

    setInitialStates() {
        const meetHeader = this.container.querySelector('.characters-header');
        const meetContent = this.container.querySelector('.meet-characters-content');
        const vcHeader = this.container.querySelector('.voice-cast-header');
        const vcInterface = this.container.querySelector('.voice-cast-interface');
        const divider = this.container.querySelector('.section-divider');
        gsap.set([meetHeader, vcHeader], { opacity: 0, y: 30 });
        gsap.set([meetContent, vcInterface], { opacity: 0 });
        gsap.set(divider, { opacity: 0, scale: 0.8 });
        this.iconWrappers.forEach(icon => {
            const hover = icon.querySelector('.char-icon-hover');
            gsap.set(hover, { opacity: 0, scale: 0.8 });
        });
    }

    bindEvents() {
        this.iconWrappers.forEach(icon => {
            icon.addEventListener('click', () => this.selectCharacter(icon.dataset.character));
            icon.addEventListener('mouseenter', () => {
                const hover = icon.querySelector('.char-icon-hover');
                coreAnimation.squish(icon, { intensity: 0.5, duration: 0.3 });
                gsap.to(hover, { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(2)' });
                sfxManager.playGhost();
            });
            icon.addEventListener('mouseleave', () => {
                const hover = icon.querySelector('.char-icon-hover');
                if (!icon.classList.contains('active')) gsap.to(hover, { opacity: 0, scale: 0.8, duration: 0.2 });
            });
        });
        
        this.vcPortraits.forEach(portrait => {
            portrait.addEventListener('click', () => { this.selectVCCharacter(portrait.dataset.vcCharacter); sfxManager.playCheck1(); });
            portrait.addEventListener('mouseenter', () => { if (!portrait.classList.contains('active')) coreAnimation.squish(portrait, { intensity: 0.4, duration: 0.3 }); sfxManager.playGhost(); });
        });
        
        this.vcLangBtns.forEach(btn => btn.addEventListener('click', () => { this.selectLanguage(btn.dataset.lang); sfxManager.playCheck2(); }));
        this.vcPlayBtn?.addEventListener('click', () => this.toggleVoiceline());
        
        let touchStartX = 0;
        const splashContainer = this.container.querySelector('.char-splash-container');
        splashContainer?.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        splashContainer?.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                const currentIndex = this.characters.findIndex(c => c.id === this.currentCharacter.id);
                const newIndex = diff > 0 ? (currentIndex + 1) % this.characters.length : (currentIndex - 1 + this.characters.length) % this.characters.length;
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
            gsap.to(hover, { opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8, duration: 0.2 });
        });
        this.animateSplashTransition(oldCharacter.id, characterId);
        this.animateSpriteTransition(oldCharacter.id, characterId);
        this.animateNameImgTransition(oldCharacter.id, characterId);
        this.animateCardTransition(oldCharacter.id, characterId);
        this.updateTextContent(character);
    }

    animateSplashTransition(oldId, newId) {
        const oldSplash = this.splashWrappers.find(s => s.dataset.character === oldId);
        const newSplash = this.splashWrappers.find(s => s.dataset.character === newId);
        if (!oldSplash || !newSplash) return;
        const tl = gsap.timeline();
        this.timelines.push(tl);
        tl.to(oldSplash, { y: 60, opacity: 0, scale: 0.85, duration: 0.35, ease: 'power2.in', onComplete: () => oldSplash.classList.remove('active') });
        newSplash.classList.add('active');
        gsap.set(newSplash, { y: -60, opacity: 0, scale: 0.85 });
        tl.to(newSplash, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }, '-=0.15');
    }

    animateSpriteTransition(oldId, newId) {
        const oldSprite = this.spriteWrappers.find(s => s.dataset.character === oldId);
        const newSprite = this.spriteWrappers.find(s => s.dataset.character === newId);
        const newCharacter = this.characters.find(c => c.id === newId);
        if (!oldSprite || !newSprite || !newCharacter) return;
        const randomSprite = newCharacter.sprites[Math.floor(Math.random() * newCharacter.sprites.length)];
        const spriteImg = newSprite.querySelector('.char-sprite-img');
        const tl = gsap.timeline();
        this.timelines.push(tl);
        tl.to(oldSprite, { x: -100, opacity: 0, scale: 0.75, duration: 0.35, ease: 'power2.in', onComplete: () => oldSprite.classList.remove('active') });
        if (spriteImg) spriteImg.src = randomSprite;
        newSprite.classList.add('active');
        gsap.set(newSprite, { x: 100, opacity: 0, scale: 0.75 });
        tl.to(newSprite, { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }, '-=0.1');
    }

    animateNameImgTransition(oldId, newId) {
        const oldName = this.nameImgWrappers.find(n => n.dataset.character === oldId);
        const newName = this.nameImgWrappers.find(n => n.dataset.character === newId);
        if (!oldName || !newName) return;
        const tl = gsap.timeline();
        this.timelines.push(tl);
        tl.to(oldName, { y: 25, opacity: 0, scale: 0.9, duration: 0.25, ease: 'power2.in', onComplete: () => oldName.classList.remove('active') });
        newName.classList.add('active');
        gsap.set(newName, { y: -25, opacity: 0, scale: 0.9 });
        tl.to(newName, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }, '-=0.1');
    }

    animateCardTransition(oldId, newId) {
        const oldCard = this.cardWrappers.find(c => c.dataset.character === oldId);
        const newCard = this.cardWrappers.find(c => c.dataset.character === newId);
        if (!oldCard || !newCard) return;
        const tl = gsap.timeline({ onComplete: () => { this.isAnimating = false; } });
        this.timelines.push(tl);
        tl.to(oldCard, { y: -35, opacity: 0, scale: 0.85, rotateY: -15, duration: 0.25, ease: 'power2.in', onComplete: () => oldCard.classList.remove('active') });
        newCard.classList.add('active');
        gsap.set(newCard, { y: 35, opacity: 0, scale: 0.85, rotateY: 15 });
        tl.to(newCard, { y: 0, opacity: 1, scale: 1, rotateY: 0, duration: 0.4, ease: 'back.out(1.5)' }, '-=0.1');
    }

    updateTextContent(character) {
        const elements = [this.descriptionEl, this.archetypeEl, this.hpEl, this.atkEl, this.defEl, this.spdEl].filter(Boolean);
        const tl = gsap.timeline();
        this.timelines.push(tl);
        tl.to(elements, { opacity: 0, y: -10, duration: 0.15, stagger: 0.02, ease: 'power2.in' });
        tl.call(() => {
            if (this.descriptionEl) this.descriptionEl.textContent = character.description || 'Information coming soon...';
            if (this.archetypeEl) this.archetypeEl.textContent = character.archetype || 'Unknown';
            if (this.hpEl) this.hpEl.textContent = character.stats.hp;
            if (this.atkEl) this.atkEl.textContent = character.stats.atk;
            if (this.defEl) this.defEl.textContent = character.stats.def;
            if (this.spdEl) this.spdEl.textContent = character.stats.spd;
        });
        tl.to(elements, { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: 'back.out(1.5)' });
    }

    selectVCCharacter(characterId) {
        const wasSelected = this.currentVCCharacter === characterId;
        this.currentVCCharacter = characterId;
        this.vcPortraits.forEach(portrait => {
            const isActive = portrait.dataset.vcCharacter === characterId;
            portrait.classList.toggle('active', isActive);
            if (isActive && !wasSelected) coreAnimation.squish(portrait, { intensity: 0.6, duration: 0.4 });
        });
        this.vcControlPanel?.classList.add('active');
        gsap.fromTo(this.vcControlPanel, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' });
        this.updateVoiceActorDisplay();
        this.stopVoiceline();
    }

    selectLanguage(language) {
        this.currentLanguage = language;
        this.vcLangBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === language));
        this.updateVoiceActorDisplay();
        this.stopVoiceline();
    }

    updateVoiceActorDisplay() {
        if (!this.currentVCCharacter) return;
        const vcData = this.voiceCast[this.currentVCCharacter];
        const char = this.characters.find(c => c.id === this.currentVCCharacter);
        if (!vcData) return;
        const actorName = vcData.voiceActors[this.currentLanguage] || '-';
        gsap.to(this.vcActorName, {
            opacity: 0, y: -10, duration: 0.15, ease: 'power2.in',
            onComplete: () => {
                if (this.vcActorName) this.vcActorName.textContent = actorName;
                gsap.to(this.vcActorName, { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(2)' });
            }
        });
        if (this.vcCharacterLabel) this.vcCharacterLabel.textContent = `as ${char?.name || this.currentVCCharacter}`;
    }

    toggleVoiceline() {
        if (!this.currentVCCharacter) return;
        if (this.isPlayingVoiceline && this.currentAudio) { this.stopVoiceline(); return; }
        const vcData = this.voiceCast[this.currentVCCharacter];
        if (!vcData) return;
        const voicelineSrc = vcData.voicelines[this.currentLanguage];
        this.currentAudio = new Audio(voicelineSrc);
        this.currentAudio.volume = 0.7;
        this.currentAudio.addEventListener('ended', () => this.stopVoiceline());
        this.currentAudio.addEventListener('error', () => { console.warn('Voiceline not available:', voicelineSrc); this.stopVoiceline(); });
        this.currentAudio.addEventListener('timeupdate', () => {
            if (this.currentAudio && this.vcProgressBar) {
                const progress = (this.currentAudio.currentTime / this.currentAudio.duration) * 100;
                this.vcProgressBar.style.width = `${progress}%`;
            }
        });
        this.currentAudio.play().then(() => {
            this.isPlayingVoiceline = true;
            this.vcPlayBtn?.classList.add('playing');
            this.vcPlayerControls?.classList.add('playing');
            sfxManager.playConfirm();
        }).catch(() => console.warn('Could not play voiceline'));
    }

    stopVoiceline() {
        if (this.currentAudio) { this.currentAudio.pause(); this.currentAudio.currentTime = 0; this.currentAudio = null; }
        this.isPlayingVoiceline = false;
        this.vcPlayBtn?.classList.remove('playing');
        this.vcPlayerControls?.classList.remove('playing');
        if (this.vcProgressBar) this.vcProgressBar.style.width = '0%';
    }

    initScrollAnimations(scroller) {
        const meetTrigger = ScrollTrigger.create({
            trigger: this.container.querySelector('.meet-characters-subsection'),
            scroller: scroller, start: 'top 80%', once: true,
            onEnter: () => this.animateMeetEntrance()
        });
        this.scrollTriggers.push(meetTrigger);
        const vcTrigger = ScrollTrigger.create({
            trigger: this.container.querySelector('.voice-cast-subsection'),
            scroller: scroller, start: 'top 80%', once: true,
            onEnter: () => this.animateVCEntrance()
        });
        this.scrollTriggers.push(vcTrigger);
    }

    animateMeetEntrance() {
        const header = this.container.querySelector('.characters-header');
        const content = this.container.querySelector('.meet-characters-content');
        const divider = this.container.querySelector('.section-divider');
        const icons = this.iconWrappers;
        const tl = gsap.timeline();
        this.timelines.push(tl);
        tl.to(header, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
        const titleMain = header?.querySelector('.char-title-main');
        if (titleMain) coreAnimation.animateText(titleMain, { delay: 0.2 });
        tl.to(content, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3');
        tl.fromTo(icons, { opacity: 0, scale: 0.5, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' }, '-=0.3');
        const activeSplash = this.splashWrappers.find(s => s.classList.contains('active'));
        if (activeSplash) tl.fromTo(activeSplash, { opacity: 0, scale: 0.8, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.5');
        tl.to(divider, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.2');
    }

    animateVCEntrance() {
        const header = this.container.querySelector('.voice-cast-header');
        const interface_ = this.container.querySelector('.voice-cast-interface');
        const portraits = this.vcPortraits;
        const tl = gsap.timeline();
        this.timelines.push(tl);
        tl.to(header, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
        tl.to(interface_, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3');
        tl.fromTo(portraits, { opacity: 0, scale: 0.7, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(1.8)' }, '-=0.3');
    }

    destroy() {
        this.scrollTriggers.forEach(st => st.kill());
        this.timelines.forEach(tl => tl?.kill?.());
        this.stopVoiceline();
        if (this.container?.parentNode) this.container.parentNode.removeChild(this.container);
    }
}

export const charactersSection = new CharactersSection();
export default charactersSection;
