/**
 * Characters Section - The Heart of Gold
 * Meet the Characters & Voice Cast 
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
                id: 'shiori',
                name: 'SHIORI',
                level: 999,
                archetype: 'Glass Cannon',
                description: 'A little girl brought from another universe, who possesses unique powers unknown even to those skilled in magic or technology. With a noble character and friendly attitude, she is one of the playable characters intended for players specializing in "glass cannon" archetype characters.',
                splash: './src/assets/shio.png',
                banner: './src/assets/shiori-card.png',
                sprite: './src/assets/shio/shiodefecne-Sheet.gif',
                color: '#9b59b6',
                icon: './src/assets/shiori-icon.png',
                stats: {
                    attack: { value: 99999, percent: 90 },
                    defense: { value: 25000, percent: 20 },
                    speed: { value: 75000, percent: 60 },
                    special: { value: 85000, percent: 80 }
                }
            },
            {
                id: 'irene',
                name: 'IRENE',
                level: 666,
                archetype: 'Unknown',
                description: 'Todavia no se que poner jqjsjaj',
                splash: './src/assets/irene.png',
                banner: './src/assets/irene-card.png',
                sprite: './src/assets/irene/idle.gif',
                color: '#e74c3c',
                icon: './src/assets/irene-icon.png',
                stats: {
                    attack: { value: 82000, percent: 78 },
                    defense: { value: 68000, percent: 58 },
                    speed: { value: 85000, percent: 82 },
                    special: { value: 99999, percent: 99 }
                }
            },
            {
                id: 'zoe',
                name: 'ZOE',
                level: 777,
                archetype: 'Unknown',
                description: 'An aspiring knight, she is very positive, with a cheerful and somewhat noisy attitude. She is a little silly and very confident in herself. Thanks to her high health and defense, she is the perfect character for players new to the genre.',
                splash: './src/assets/zoe.png',
                banner: './src/assets/zoe-card.png',
                sprite: './src/assets/zoe/zoewin.gif',
                color: '#ff69b4',
                icon: './src/assets/zoe-icon.png',
                stats: {
                    attack: { value: 92000, percent: 92 },
                    defense: { value: 55000, percent: 45 },
                    speed: { value: 99000, percent: 98 },
                    special: { value: 78000, percent: 72 }
                }
            },
            {
                id: 'maya',
                name: 'MAYA',
                level: 850,
                archetype: 'DPS Mage',
                description: 'A Slime girl who wields magic, with a shy and very introverted personality, she specializes in ghost magic. She has high movement speed and area attack, making her perfect as a damage-specialized (DPS) character.',
                splash: './src/assets/maya.png',
                banner: './src/assets/maya-card.png',
                sprite: './src/assets/maya/maya_idle.gif',
                color: '#2ecc71',
                icon: './src/assets/maya-icon.png',
                stats: {
                    attack: { value: 75000, percent: 65 },
                    defense: { value: 95000, percent: 90 },
                    speed: { value: 70000, percent: 60 },
                    special: { value: 88000, percent: 80 }
                }
            }
        ];
        
        this.voiceCast = {
            irene: {
                portrait: './src/characters/irene.png',
                video: 'https://dl.dropbox.com/scl/fi/etvilb0flao13r4czswe3/irene.mp4?rlkey=4b0zi05fgdfs4oajuet53yzhj&st=ztu8essa&dl=0',
                hasVideo: true,
                voiceActors: {
                    english: 'Abby Espiritu',
                    spanish: 'Jessica Angeles',
                    japanese: ''
                },
                voicelines: {
                    english: './src/voicelines/irene_en.mp3',
                    spanish: './src/voicelines/irene_es.mp3',
                    japanese: './src/voicelines/irene_jp.mp3'
                },
                colors: ['#E63946', '#FF6B6B', '#FF8E8E', '#D62828'],
                nameColor: '#E63946'
            },
            shiori: {
                portrait: './src/characters/shiori_color.png',
                hasVideo: false,
                voiceActors: {
                    english: 'Phoebe Chan',
                    spanish: 'Meli Hernandez',
                    japanese: ''
                },
                voicelines: {
                    english: './src/voicelines/shiori_eng.wav',
                    spanish: './src/voicelines/shiori_es.mp3',
                    japanese: './src/voicelines/shiori_jp.wav'
                },
                colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#7C3AED'],
                nameColor: '#A78BFA'
            },
            zoe: {
                portrait: './src/characters/zoe.png',
                hasVideo: false,
                voiceActors: {
                    english: 'Su Ling Chan',
                    spanish: 'Lucia Suarez',
                    japanese: ''
                },
                voicelines: {
                    english: './src/voicelines/zoe_en.mp3',
                    spanish: './src/voicelines/zoe_es.mp3',
                    japanese: './src/voicelines/zoe_jp.mp3'
                },
                colors: ['#EC4899', '#F472B6', '#FBCFE8', '#DB2777'],
                nameColor: '#F472B6'
            },
            maya: {
                portrait: './src/characters/maya.png',
                hasVideo: false,
                voiceActors: {
                    english: 'Ciara Payne',
                    spanish: 'Stephan Coronel',
                    japanese: ''
                },
                voicelines: {
                    english: './src/voicelines/maya_en.mp3',
                    spanish: './src/voicelines/maya_es.mp3',
                    japanese: './src/voicelines/maya_jp.mp3'
                },
                colors: ['#10B981', '#34D399', '#6EE7B7', '#059669'],
                nameColor: '#34D399'
            },
            wilhelmina: {
                portrait: './src/characters/wilhelmina.png',
                hasVideo: false,
                voiceActors: {
                    english: '',
                    spanish: 'Erika Ugalde',
                    japanese: ''
                },                voicelines: {
                    english: '',
                    spanish: '',
                    japanese: ''
                },
                colors: ['#64748B', '#94A3B8', '#CBD5E1', '#475569'],
                nameColor: '#94A3B8'
            },
            fiore: {
                portrait: './src/characters/fiore.png',
                hasVideo: false,
                voiceActors: {
                    english: '',
                    spanish: 'Ale Pilar',
                    japanese: ''
                },
                voicelines: {
                    english: './src/voicelines/fiore_en.mp3',
                    spanish: './src/voicelines/fiore_es.mp3',
                    japanese: './src/voicelines/fiore_jp.mp3'
                },
                colors: ['#f50b0b', '#fb2724', '#fc504d', '#d90629'],
                nameColor: '#fb2456'
            }
        };
        
        this.vcOrder = ['irene', 'shiori', 'zoe', 'maya', 'wilhelmina', 'fiore'];
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
        this.initMouseTracking();
        return this;
    }

    generateHTML() {
        const characterCardsHTML = this.characters.map((char, i) => `
            <div class="character-card ${i === 0 ? 'active' : ''}" data-character="${char.id}">
                <div class="card-frame">
                    <img src="${char.icon}" alt="${char.name} Icon" class="card-image">
                    <div class="card-overlay"></div>
                </div>
            </div>
        `).join('');

        const firstChar = this.characters[0];

        return `
            <div class="characters-background">
                <div class="char-bg-solid"></div>
                <div class="char-bg-stripes"></div>
            </div>
            
            <!-- Anchor for navigation -->
            <div id="meet-characters-anchor" style="position: absolute; top: 0; left: 0;"></div>

            <div class="meet-characters-subsection" id="meet-characters-subsection">
        
    
                <div class="background-pattern"></div>
                
             
                <div class="diagonal-divider"></div>
                
                <!-- Panel izquierdo - Selector de personajes -->
                <aside class="character-selector">
                    <div class="character-list">
                        ${characterCardsHTML}
                    </div>
                </aside>
                
                
                <!-- Centro - Splash del personaje -->
                <main class="character-display">
                    <div class="character-name-container">
                        <h1 class="character-name" id="characterName">${firstChar.name}</h1>
                        <span class="character-level" id="characterLevel">LEVEL.${firstChar.level}</span>
                    </div>
                    
                    <div class="character-splash">
                        <img src="${firstChar.splash}" alt="${firstChar.name} Splash" id="characterSplash" class="splash-image">
                        <div class="splash-effects">
                            <div class="floating-particle"></div>
                            <div class="floating-particle"></div>
                            <div class="floating-particle"></div>
                            <div class="floating-particle"></div>
                            <div class="floating-particle"></div>
                        </div>
                    </div>
                </main>
                
             
                <aside class="character-info">
                    <div class="info-panel">
                        <!-- Banner del personaje -->
                        <div class="character-banner">
                            <img src="${firstChar.banner}" alt="${firstChar.name} Banner" id="characterBanner" class="banner-image">
                        </div>
                        
        
                        <div class="stats-container">
                            <div class="stat-row">
                                <img src="./src/assets/sword.png" alt="Attack" class="stat-icon-img">
                                <span class="stat-name">Attack</span>
                                <div class="stat-bar">
                                    <div class="stat-fill" data-stat="attack" id="stat-bar-attack" style="width: ${firstChar.stats.attack.percent}%;"></div>
                                </div>
                                <span class="stat-value" id="statAttack">${firstChar.stats.attack.value.toLocaleString()}</span>
                            </div>
                            
                            <div class="stat-row">
                                <img src="./src/assets/shield.png" alt="Defense" class="stat-icon-img">
                                <span class="stat-name">Defense</span>
                                <div class="stat-bar">
                                    <div class="stat-fill" data-stat="defense" id="stat-bar-defense" style="width: ${firstChar.stats.defense.percent}%;"></div>
                                </div>
                                <span class="stat-value" id="statDefense">${firstChar.stats.defense.value.toLocaleString()}</span>
                            </div>
                            
                            <div class="stat-row">
                                <img src="./src/assets/arrows.png" alt="Speed" class="stat-icon-img">
                                <span class="stat-name">Speed</span>
                                <div class="stat-bar">
                                    <div class="stat-fill" data-stat="speed" id="stat-bar-speed" style="width: ${firstChar.stats.speed.percent}%;"></div>
                                </div>
                                <span class="stat-value" id="statSpeed">${firstChar.stats.speed.value.toLocaleString()}</span>
                            </div>
                            
                            <div class="stat-row">
                                <img src="./src/assets/arrows.png" alt="Special" class="stat-icon-img">
                                <span class="stat-name">Special</span>
                                <div class="stat-bar">
                                    <div class="stat-fill" data-stat="special" id="stat-bar-special" style="width: ${firstChar.stats.special.percent}%;"></div>
                                </div>
                                <span class="stat-value" id="statSpecial">${firstChar.stats.special.value.toLocaleString()}</span>
                            </div>
                        </div>
                        
                    
                        <div class="description-container">
                            <h3 class="description-title">CHARACTER DESCRIPTION</h3>
                            <p class="character-description" id="characterDescription">${firstChar.description}</p>
                        </div>
                        
                        <!-- Sprite GIF -->
                        <div class="sprite-container">
                            <img src="${firstChar.sprite}" alt="${firstChar.name} Sprite" id="characterSprite" class="character-sprite">
                        </div>
                    </div>
                </aside>
            </div>
            
            
            <!-- Anchor for navigation -->
            <div id="voice-cast-anchor" style="position: absolute; left: 0;"></div>
            
            <!-- Voice Cast Subsection - Brutalist Street Style -->
            <div class="voice-cast-subsection" id="voice-cast-subsection">
                
                <!-- Halftone dot pattern background -->
                <div class="vc-halftone-bg">
                    <svg class="vc-halftone-clip-svg" width="0" height="0">
                        <defs>
                            <clipPath id="vc-halftone-clip"></clipPath>
                        </defs>
                    </svg>
                    <div class="vc-halftone-content" style="clip-path: url(#vc-halftone-clip);"></div>
                </div>

                <!-- Scramble Title -->
                <div class="voice-cast-header">
                    <span class="vc-section-label">//SECTION 04//</span>
                    <div class="vc-scramble-title">
                        <div class="scramble-line" data-scramble>
                            <div data-char="M">M</div>
                            <div data-char="E">E</div>
                            <div data-char="E">E</div>
                            <div data-char="T">T</div>
                        </div>
                        <div class="scramble-line" data-scramble>
                            <div data-char="O">O</div>
                            <div data-char="U">U</div>
                            <div data-char="R">R</div>
                        </div>
                        <div class="scramble-line" data-scramble>
                            <div data-char="V">V</div>
                            <div data-char="O">O</div>
                            <div data-char="I">I</div>
                            <div data-char="C">C</div>
                            <div data-char="E">E</div>
                        </div>
                        <div class="scramble-line" data-scramble>
                            <div data-char="C">C</div>
                            <div data-char="A">A</div>
                            <div data-char="S">S</div>
                            <div data-char="T">T</div>
                        </div>
                    </div>
                    <!-- Ink splash behind title -->
                    <div class="vc-title-ink-splash"></div>
                </div>

                <!-- Running Tape -->
                <div class="vc-tape-wrapper" id="vc-tape">
                    <div class="vc-tape-text">
                        VOICE CAST &#x2726; THE HEART OF GOLD &#x2726; VOICE CAST &#x2726; THE HEART OF GOLD &#x2726; VOICE CAST &#x2726; THE HEART OF GOLD &#x2726; VOICE CAST &#x2726; THE HEART OF GOLD &#x2726;
                    </div>
                </div>

                <!-- Character Grid - Brutalist Cards -->
                <div class="vc-grid-container">
                    ${this.vcOrder.map((id, index) => {
                        const char = this.characters.find(c => c.id === id);
                        const vcData = this.voiceCast[id];
                        const charName = char?.name || id.toUpperCase();
                        const actorEN = vcData.voiceActors.english || '---';
                        const actorES = vcData.voiceActors.spanish || '---';
                        const actorJP = vcData.voiceActors.japanese || '---';
                        
                        return `
                            <div class="vc-card clickable" data-vc-character="${id}" data-index="${index}" 
                                 style="--card-color: ${vcData.colors[0]}; --card-light: ${vcData.colors[1]}; --card-lighter: ${vcData.colors[2]}; --card-dark: ${vcData.colors[3]};">
                                <div class="vc-card-border"></div>
                                <div class="vc-card-media">
                                    <img src="${vcData.portrait}" alt="${charName}" class="vc-card-portrait" loading="lazy">
                                    <div class="vc-card-overlay"></div>
                                </div>
                                <div class="vc-card-info">
                                    <span class="vc-card-char-name">${charName}</span>
                                    <span class="vc-card-char-name-outline" aria-hidden="true">${charName}</span>
                                    <div class="vc-card-actor-info">
                                        <span class="vc-card-actor-label">VOICED BY</span>
                                        <span class="vc-card-actor" data-lang="english">${actorEN}</span>
                                        <span class="vc-card-actor" data-lang="spanish" style="display:none">${actorES}</span>
                                        <span class="vc-card-actor" data-lang="japanese" style="display:none">${actorJP || '---'}</span>
                                    </div>
                                </div>
                                <div class="vc-card-play-zone">
                                    <button class="vc-card-play-btn clickable" aria-label="Play voiceline for ${charName}">
                                        <svg class="vc-card-play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        <svg class="vc-card-pause-icon" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                    </button>
                                    <div class="vc-card-progress">
                                        <div class="vc-card-progress-fill"></div>
                                    </div>
                                </div>
                                <div class="vc-card-index">${String(index + 1).padStart(2, '0')}</div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Mobile Accordion (visible only on small screens) -->
                <div class="vc-mobile-accordion" id="vc-mobile-accordion">
                    ${this.vcOrder.map((id, index) => {
                        const char = this.characters.find(c => c.id === id);
                        const vcData = this.voiceCast[id];
                        const charName = char?.name || id.toUpperCase();
                        const actorEN = vcData.voiceActors.english || '---';
                        const actorES = vcData.voiceActors.spanish || '---';
                        const actorJP = vcData.voiceActors.japanese || '---';
                        
                        return `
                            <div class="vc-acc-item clickable ${index === 0 ? 'active' : ''}" data-vc-character="${id}"
                                 style="--card-color: ${vcData.colors[0]}; --card-light: ${vcData.colors[1]};">
                                <div class="vc-acc-bg">
                                    <img src="${vcData.portrait}" alt="${charName}" class="vc-acc-portrait" loading="lazy">
                                    <div class="vc-acc-gradient"></div>
                                </div>
                                <span class="vc-acc-name-vertical">${charName}</span>
                                <div class="vc-acc-expanded-content">
                                    <span class="vc-acc-char-name">${charName}</span>
                                    <div class="vc-acc-actor-info">
                                        <span class="vc-acc-actor-label">VOICED BY</span>
                                        <span class="vc-acc-actor" data-lang="english">${actorEN}</span>
                                        <span class="vc-acc-actor" data-lang="spanish" style="display:none">${actorES}</span>
                                        <span class="vc-acc-actor" data-lang="japanese" style="display:none">${actorJP || '---'}</span>
                                    </div>
                                    <button class="vc-acc-play-btn clickable" aria-label="Play voiceline for ${charName}">
                                        <svg class="vc-acc-play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        <svg class="vc-acc-pause-icon" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                    </button>
                                    <div class="vc-acc-progress">
                                        <div class="vc-acc-progress-fill"></div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Bottom Tape -->
                <div class="vc-tape-wrapper vc-tape-bottom" id="vc-tape-bottom">
                    <div class="vc-tape-text">
                        SELECT YOUR CHARACTER &#x2726; LISTEN TO THEIR VOICE &#x2726; SELECT YOUR CHARACTER &#x2726; LISTEN TO THEIR VOICE &#x2726; SELECT YOUR CHARACTER &#x2726; LISTEN TO THEIR VOICE &#x2726;
                    </div>
                </div>

                <!-- Language Barrel Picker -->
                <div class="vc-barrel-section">
                    <span class="vc-barrel-label">LANGUAGE</span>
                    <div class="vc-barrel-picker" id="vc-barrel-picker">
                        <div class="vc-barrel-viewport">
                            <div class="vc-barrel-track" id="vc-barrel-track">
                                <div class="vc-barrel-item" data-lang="english">ENGLISH</div>
                                <div class="vc-barrel-item active" data-lang="spanish">ESPAÑOL</div>
                                <div class="vc-barrel-item" data-lang="japanese">JAPANESE</div>
                            </div>
                        </div>
                        <div class="vc-barrel-highlight"></div>
                        <div class="vc-barrel-fade-top"></div>
                        <div class="vc-barrel-fade-bottom"></div>
                    </div>
                </div>

            </div>
        `;
    }

    initMouseTracking() {
        const vcSection = this.container.querySelector('.voice-cast-subsection');
        if (!vcSection) return;
        
        vcSection.addEventListener('mousemove', (e) => {
            const rect = vcSection.getBoundingClientRect();
            vcSection.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            vcSection.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    }

    cacheElements() {
   
        this.characterCards = Array.from(this.container.querySelectorAll('.character-card'));
        this.characterName = this.container.querySelector('#characterName');
        this.characterLevel = this.container.querySelector('#characterLevel');
        this.characterSplash = this.container.querySelector('#characterSplash');
        this.characterBanner = this.container.querySelector('#characterBanner');
        this.characterSprite = this.container.querySelector('#characterSprite');
        this.characterDescription = this.container.querySelector('#characterDescription');
        
        // Stats elements
        this.statAttack = this.container.querySelector('#statAttack');
        this.statDefense = this.container.querySelector('#statDefense');
        this.statSpeed = this.container.querySelector('#statSpeed');
        this.statSpecial = this.container.querySelector('#statSpecial');
        this.statBars = {
            attack: this.container.querySelector('#stat-bar-attack'),
            defense: this.container.querySelector('#stat-bar-defense'),
            speed: this.container.querySelector('#stat-bar-speed'),
            special: this.container.querySelector('#stat-bar-special')
        };
        
        // Voice cast elements - new brutalist design
        this.vcCards = Array.from(this.container.querySelectorAll('.vc-card'));
        this.vcTape = this.container.querySelector('#vc-tape');
        this.vcBarrelTrack = this.container.querySelector('#vc-barrel-track');
        this.vcBarrelItems = Array.from(this.container.querySelectorAll('.vc-barrel-item'));
        this.scrambleLines = Array.from(this.container.querySelectorAll('.scramble-line'));
        
        // Barrel picker state
        this.barrelCurrentIndex = 0;
        this.barrelItemHeight = 48;
        this.barrelIsDragging = false;
        this.barrelStartY = 0;
        this.barrelCurrentY = 0;
        this.languages = ['english', 'spanish', 'japanese'];
        
        // Mobile accordion elements
        this.vcAccordionItems = Array.from(this.container.querySelectorAll('.vc-acc-item'));
    }

    setInitialStates() {
        const meetSection = this.container.querySelector('.meet-characters-subsection');
        const vcHeader = this.container.querySelector('.voice-cast-header');
        const divider = this.container.querySelector('.section-divider');
        
        gsap.set(meetSection, { opacity: 0, y: 30 });
        gsap.set(vcHeader, { opacity: 0, y: 30 });
        gsap.set(divider, { opacity: 0, scale: 0.8 });
        
        // Scramble initial state
        gsap.set('.scramble-line div', { yPercent: -103 });
        gsap.set('.scramble-line', { autoAlpha: 1 });
        
        // Cards initial state
        this.vcCards.forEach(card => {
            gsap.set(card, { opacity: 0, y: 60, scale: 0.9 });
        });
        
        // Tape initial state
        if (this.vcTape) {
            gsap.set(this.vcTape, { opacity: 0, scaleX: 0 });
        }
        const bottomTape = this.container.querySelector('.vc-tape-bottom');
        if (bottomTape) {
            gsap.set(bottomTape, { opacity: 0, scaleX: 0 });
        }
        
        // Mobile accordion initial state
        this.vcAccordionItems.forEach(item => {
            gsap.set(item, { opacity: 0, x: 30 });
        });
    }

    bindEvents() {
        // Eventos para las tarjetas de personajes
        this.characterCards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectCharacter(card.dataset.character);
                sfxManager.playConfirm();
            });
            
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('active')) {
                    gsap.to(card, { 
                        scale: 1.05, 
                        duration: 0.3, 
                        ease: 'back.out(1.7)' 
                    });
                    sfxManager.playGhost();
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('active')) {
                    gsap.to(card, { 
                        scale: 1, 
                        duration: 0.3, 
                        ease: 'power2.out' 
                    });
                }
            });
        });
        
        // Voice Cast card events
        this.vcCards.forEach(card => {
            const playBtn = card.querySelector('.vc-card-play-btn');
            
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('active')) {
                    gsap.to(card, { 
                        scale: 1.03, y: -5,
                        duration: 0.4, ease: 'elastic.out(1, 0.5)' 
                    });
                }
                sfxManager.playGhost();
            });
            
            card.addEventListener('mouseleave', () => {
                if (!card.classList.contains('active')) {
                    gsap.to(card, { 
                        scale: 1, y: 0,
                        duration: 0.4, ease: 'power2.out' 
                    });
                }
            });
            
            card.addEventListener('click', (e) => {
                if (e.target.closest('.vc-card-play-btn')) return;
                this.selectVCCard(card.dataset.vcCharacter);
                sfxManager.playCheck1();
            });
            
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectVCCard(card.dataset.vcCharacter);
                    this.toggleVoicelineForCard(card.dataset.vcCharacter);
                    sfxManager.playConfirm();
                });
            }
        });
        
        // Barrel picker events
        this.initBarrelPicker();
        
        // Mobile accordion events
        this.vcAccordionItems.forEach(item => {
            const playBtn = item.querySelector('.vc-acc-play-btn');
            
            item.addEventListener('click', (e) => {
                if (e.target.closest('.vc-acc-play-btn')) return;
                this.selectAccordionItem(item.dataset.vcCharacter);
                sfxManager.playCheck1();
            });
            
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectAccordionItem(item.dataset.vcCharacter);
                    this.toggleVoicelineForAccordion(item.dataset.vcCharacter);
                    sfxManager.playConfirm();
                });
            }
        });
        
        this.initTouchSwipe();
    }

    initTouchSwipe() {
        const characterSplash = this.container.querySelector('.character-splash');
        if (!characterSplash) return;
        
        let touchStartX = 0;
        
        characterSplash.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        characterSplash.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].screenX - touchStartX;
            if (Math.abs(diff) < 50) return;
            
            const idx = this.characters.findIndex(c => c.id === this.currentCharacter.id);
            const nextIdx = diff > 0 
                ? (idx - 1 + this.characters.length) % this.characters.length 
                : (idx + 1) % this.characters.length;
            this.selectCharacter(this.characters[nextIdx].id);
        }, { passive: true });
    }

    selectCharacter(characterId) {
        if (this.isAnimating) return;
        
        const character = this.characters.find(c => c.id === characterId);
        if (!character || character.id === this.currentCharacter?.id) return;
        
        this.isAnimating = true;
        this.currentCharacter = character;
        this.container.setAttribute('data-character', characterId);
        
        this.updateCardStates(characterId);
        this.animateCharacterTransition(character);
        
        sfxManager.playConfirm();
    }

    updateCardStates(characterId) {
        this.characterCards.forEach(card => {
            const isActive = card.dataset.character === characterId;
            card.classList.toggle('active', isActive);
            
       
            if (isActive) {
                gsap.fromTo(card,
                    { scale: 0.95 },
                    { scale: 1, duration: 0.5, ease: 'elastic.out(1.3, 0.4)' }
                );
            }
        });
    }

    animateCharacterTransition(character) {
        const characterDisplay = this.container.querySelector('.character-display');
        
       
        characterDisplay.classList.add('switching');
        
        const tl = gsap.timeline({
            onComplete: () => {
                this.isAnimating = false;
                characterDisplay.classList.remove('switching');
            }
        });
        
        // AnimaciÃƒÂ³n de salida
        tl.to([
            this.characterSplash,
            this.characterBanner,
            this.characterSprite,
            this.characterName,
            this.characterLevel,
            this.characterDescription,
            this.statAttack,
            this.statDefense,
            this.statSpeed,
            this.statSpecial
        ], {
            opacity: 0,
            y: -20,
            duration: 0.2,
            stagger: 0.02,
            ease: 'power2.in'
        }, 0);
        
        // Actualizar contenido
        tl.call(() => {
            this.updateCharacterDisplay(character);
        }, null, 0.1);
        
        // AnimaciÃƒÂ³n de entrada
        tl.to([
            this.characterSplash,
            this.characterBanner,
            this.characterSprite
        ], {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out'
        }, 0.3);
        
        tl.to([
            this.characterName,
            this.characterLevel
        ], {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'back.out(1.7)'
        }, 0.4);
        
        tl.to(this.characterDescription, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, 0.45);
        
        // AnimaciÃƒÂ³n de las barras de estadÃƒÂ­sticas
        Object.keys(this.statBars).forEach((stat, index) => {
            if (this.statBars[stat]) {
                tl.to(this.statBars[stat], {
                    width: `${character.stats[stat].percent}%`,
                    duration: 0.8,
                    ease: 'power2.out',
                    delay: 0.1 * index
                }, 0.3);
            }
        });
        

        tl.to([
            this.statAttack,
            this.statDefense,
            this.statSpeed,
            this.statSpecial
        ], {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: 'back.out(1.5)'
        }, 0.5);
    }

    updateCharacterDisplay(character) {
        // Actualizar elementos de texto
        this.characterName.textContent = character.name;
        this.characterLevel.textContent = `LEVEL.${character.level}`;
        this.characterDescription.textContent = character.description;
        

        this.statAttack.textContent = character.stats.attack.value.toLocaleString();
        this.statDefense.textContent = character.stats.defense.value.toLocaleString();
        this.statSpeed.textContent = character.stats.speed.value.toLocaleString();
        this.statSpecial.textContent = character.stats.special.value.toLocaleString();
        
   
        this.characterSplash.src = character.splash;
        this.characterSplash.alt = `${character.name} Splash`;
        this.characterBanner.src = character.banner;
        this.characterBanner.alt = `${character.name} Banner`;
        this.characterSprite.src = character.sprite;
        this.characterSprite.alt = `${character.name} Sprite`;
    }


    selectVCCard(characterId) {
        const wasActive = this.currentVCCharacter === characterId;
        this.currentVCCharacter = characterId;
        
        const vcData = this.voiceCast[characterId];
        if (!vcData) return;
        
        const themeColor = vcData.colors[0];
        
        // Update tape color
        if (this.vcTape) {
            gsap.to(this.vcTape, {
                '--tape-color': themeColor,
                duration: 0.5,
                ease: 'power2.out'
            });
            this.vcTape.style.setProperty('--tape-color', themeColor);
        }
        
        // Update cards active state + video swap
        this.vcCards.forEach(card => {
            const isActive = card.dataset.vcCharacter === characterId;
            const cardId = card.dataset.vcCharacter;
            const cardVCData = this.voiceCast[cardId];
            const mediaContainer = card.querySelector('.vc-card-media');
            const existingVideo = mediaContainer?.querySelector('.vc-card-video');
            const portrait = mediaContainer?.querySelector('.vc-card-portrait');
            
            if (isActive) {
                card.classList.add('active');
                gsap.to(card, {
                    scale: 1, y: -5,
                    duration: 0.5, ease: 'elastic.out(1.2, 0.5)'
                });
                if (!wasActive) {
                    gsap.fromTo(card,
                        { scaleY: 0.94, scaleX: 1.02 },
                        { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1.3, 0.4)' }
                    );
                }
                
                // Swap to video if character has one
                if (cardVCData?.hasVideo && cardVCData.video && !existingVideo) {
                    const video = document.createElement('video');
                    video.className = 'vc-card-video';
                    video.src = cardVCData.video;
                    video.loop = true;
                    video.muted = true;
                    video.playsInline = true;
                    video.autoplay = true;
                    video.setAttribute('playsinline', '');
                    if (portrait) portrait.style.display = 'none';
                    mediaContainer.insertBefore(video, mediaContainer.querySelector('.vc-card-overlay'));
                    video.play().catch(() => {});
                    gsap.fromTo(video,
                        { opacity: 0, scale: 1.15 },
                        { opacity: 1, scale: 1.05, duration: 0.6, ease: 'power2.out' }
                    );
                }
            } else {
                card.classList.remove('active');
                gsap.to(card, {
                    scale: 1, y: 0,
                    duration: 0.4, ease: 'power2.out'
                });
                
                // Remove video, restore portrait
                if (existingVideo) {
                    existingVideo.pause();
                    existingVideo.remove();
                    if (portrait) portrait.style.display = '';
                }
            }
        });
        
        // Update displayed actor names on all cards for current language
        this.updateCardActorDisplay();
        
        if (this.isPlayingVoiceline && this.currentPlayingId !== characterId) {
            this.stopVoiceline();
        }
    }
    
    selectLanguage(language) {
        this.currentLanguage = language;
        
        this.vcBarrelItems.forEach(item => {
            item.classList.toggle('active', item.dataset.lang === language);
        });
        
        this.updateCardActorDisplay();
        this.updateAccordionActorDisplay();
        this.stopVoiceline();
    }
    
    updateCardActorDisplay() {
        this.vcCards.forEach(card => {
            const actors = card.querySelectorAll('.vc-card-actor');
            actors.forEach(actor => {
                const isCurrentLang = actor.dataset.lang === this.currentLanguage;
                if (isCurrentLang) {
                    actor.style.display = '';
                    gsap.fromTo(actor, 
                        { opacity: 0, y: 10 }, 
                        { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(2)' }
                    );
                } else {
                    actor.style.display = 'none';
                }
            });
        });
    }
    
    toggleVoicelineForCard(characterId) {
        if (this.isPlayingVoiceline && this.currentPlayingId === characterId) {
            this.stopVoiceline();
            return;
        }
        
        // Stop any existing
        this.stopVoiceline();
        
        const vcData = this.voiceCast[characterId];
        if (!vcData) return;
        
        const voicelineSrc = vcData.voicelines[this.currentLanguage];
        if (!voicelineSrc) return;
        
        this.currentPlayingId = characterId;
        this.currentAudio = new Audio(voicelineSrc);
        this.currentAudio.volume = 0.7;
        
        const card = this.container.querySelector(`.vc-card[data-vc-character="${characterId}"]`);
        const progressFill = card?.querySelector('.vc-card-progress-fill');
        const playBtn = card?.querySelector('.vc-card-play-btn');
        
        this.currentAudio.addEventListener('ended', () => this.stopVoiceline());
        this.currentAudio.addEventListener('error', () => this.stopVoiceline());
        this.currentAudio.addEventListener('timeupdate', () => {
            if (this.currentAudio && progressFill) {
                const progress = (this.currentAudio.currentTime / this.currentAudio.duration) * 100;
                progressFill.style.width = `${progress}%`;
            }
        });
        
        this.currentAudio.play().then(() => {
            this.isPlayingVoiceline = true;
            playBtn?.classList.add('playing');
            card?.classList.add('playing');
            gsap.fromTo(playBtn,
                { scale: 0.75, rotation: -10 },
                { scale: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1.5, 0.4)' }
            );
        }).catch(() => {});
    }

    toggleVoiceline() {
        if (this.currentVCCharacter) {
            this.toggleVoicelineForCard(this.currentVCCharacter);
        }
    }

    stopVoiceline() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        this.isPlayingVoiceline = false;
        
        // Reset desktop card play states
        this.vcCards.forEach(card => {
            card.classList.remove('playing');
            const playBtn = card.querySelector('.vc-card-play-btn');
            playBtn?.classList.remove('playing');
            const progressFill = card.querySelector('.vc-card-progress-fill');
            if (progressFill) progressFill.style.width = '0%';
        });
        
        // Reset mobile accordion play states
        this.vcAccordionItems.forEach(item => {
            const playBtn = item.querySelector('.vc-acc-play-btn');
            playBtn?.classList.remove('playing');
            const progressFill = item.querySelector('.vc-acc-progress-fill');
            if (progressFill) progressFill.style.width = '0%';
        });
        
        this.currentPlayingId = null;
    }
    
    // Mobile Accordion
    selectAccordionItem(characterId) {
        this.currentVCCharacter = characterId;
        const vcData = this.voiceCast[characterId];
        if (!vcData) return;
        
        if (this.vcTape) {
            this.vcTape.style.setProperty('--tape-color', vcData.colors[0]);
        }
        
        this.vcAccordionItems.forEach(item => {
            const isActive = item.dataset.vcCharacter === characterId;
            const itemId = item.dataset.vcCharacter;
            const itemVCData = this.voiceCast[itemId];
            const bgContainer = item.querySelector('.vc-acc-bg');
            const existingVideo = bgContainer?.querySelector('.vc-acc-video');
            const portrait = bgContainer?.querySelector('.vc-acc-portrait');
            
            if (isActive && !item.classList.contains('active')) {
                item.classList.add('active');
                gsap.fromTo(item, 
                    { scaleY: 0.96 },
                    { scaleY: 1, duration: 0.5, ease: 'elastic.out(1.2, 0.5)' }
                );
                
                if (itemVCData?.hasVideo && itemVCData.video && !existingVideo) {
                    const video = document.createElement('video');
                    video.className = 'vc-acc-video';
                    video.src = itemVCData.video;
                    video.loop = true;
                    video.muted = true;
                    video.playsInline = true;
                    video.autoplay = true;
                    video.setAttribute('playsinline', '');
                    if (portrait) portrait.style.display = 'none';
                    bgContainer.insertBefore(video, bgContainer.querySelector('.vc-acc-gradient'));
                    video.play().catch(() => {});
                    gsap.fromTo(video, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
                }
            } else if (!isActive) {
                item.classList.remove('active');
                if (existingVideo) {
                    existingVideo.pause();
                    existingVideo.remove();
                    if (portrait) portrait.style.display = '';
                }
            }
        });
        
        this.vcCards.forEach(card => {
            card.classList.toggle('active', card.dataset.vcCharacter === characterId);
        });
        
        this.updateAccordionActorDisplay();
        
        if (this.isPlayingVoiceline && this.currentPlayingId !== characterId) {
            this.stopVoiceline();
        }
    }
    
    updateAccordionActorDisplay() {
        this.vcAccordionItems.forEach(item => {
            const actors = item.querySelectorAll('.vc-acc-actor');
            actors.forEach(actor => {
                const isCurrentLang = actor.dataset.lang === this.currentLanguage;
                if (isCurrentLang) {
                    actor.style.display = '';
                    gsap.fromTo(actor, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'back.out(2)' });
                } else {
                    actor.style.display = 'none';
                }
            });
        });
    }
    
    toggleVoicelineForAccordion(characterId) {
        if (this.isPlayingVoiceline && this.currentPlayingId === characterId) {
            this.stopVoiceline();
            return;
        }
        this.stopVoiceline();
        
        const vcData = this.voiceCast[characterId];
        if (!vcData) return;
        const voicelineSrc = vcData.voicelines[this.currentLanguage];
        if (!voicelineSrc) return;
        
        this.currentPlayingId = characterId;
        this.currentAudio = new Audio(voicelineSrc);
        this.currentAudio.volume = 0.7;
        
        const item = this.container.querySelector(`.vc-acc-item[data-vc-character="${characterId}"]`);
        const progressFill = item?.querySelector('.vc-acc-progress-fill');
        const playBtn = item?.querySelector('.vc-acc-play-btn');
        
        this.currentAudio.addEventListener('ended', () => this.stopVoiceline());
        this.currentAudio.addEventListener('error', () => this.stopVoiceline());
        this.currentAudio.addEventListener('timeupdate', () => {
            if (this.currentAudio && progressFill) {
                const pct = (this.currentAudio.currentTime / this.currentAudio.duration) * 100;
                progressFill.style.width = `${pct}%`;
            }
        });
        
        this.currentAudio.play().then(() => {
            this.isPlayingVoiceline = true;
            playBtn?.classList.add('playing');
            gsap.fromTo(playBtn, { scale: 0.8, rotation: -8 }, { scale: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1.5, 0.4)' });
        }).catch(() => {});
    }

    // Barrel Picker (iOS-style scroll selector)
    initBarrelPicker() {
        const picker = this.container.querySelector('#vc-barrel-picker');
        const track = this.vcBarrelTrack;
        if (!picker || !track) return;
        
        let startY = 0;
        let currentOffset = 0;
        let isDragging = false;
        
        const snapToIndex = (index) => {
            index = Math.max(0, Math.min(index, this.languages.length - 1));
            this.barrelCurrentIndex = index;
            const offset = -index * this.barrelItemHeight;
            
            gsap.to(track, {
                y: offset,
                duration: 0.4,
                ease: 'elastic.out(1, 0.7)',
                onComplete: () => {
                    this.selectLanguage(this.languages[index]);
                    sfxManager.playCheck2();
                }
            });
            
            this.vcBarrelItems.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
        };
        
        // Mouse wheel
        picker.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY > 0) {
                snapToIndex(this.barrelCurrentIndex + 1);
            } else {
                snapToIndex(this.barrelCurrentIndex - 1);
            }
        }, { passive: false });
        
        // Touch events
        picker.addEventListener('touchstart', (e) => {
            isDragging = true;
            startY = e.touches[0].clientY;
            currentOffset = -this.barrelCurrentIndex * this.barrelItemHeight;
        }, { passive: true });
        
        picker.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const delta = e.touches[0].clientY - startY;
            gsap.set(track, { y: currentOffset + delta });
        }, { passive: true });
        
        picker.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const delta = e.changedTouches[0].clientY - startY;
            const indexDelta = Math.round(-delta / this.barrelItemHeight);
            snapToIndex(this.barrelCurrentIndex + indexDelta);
        });
        
        // Click on items
        this.vcBarrelItems.forEach((item, i) => {
            item.addEventListener('click', () => snapToIndex(i));
        });
        
        // Initialize position
        snapToIndex(0);
    }
    
    // Halftone reveal effect
    initHalftoneReveal() {
        const clipPath = this.container.querySelector('#vc-halftone-clip');
        const bgContainer = this.container.querySelector('.vc-halftone-bg');
        if (!clipPath || !bgContainer) return;
        
        const rect = bgContainer.getBoundingClientRect();
        const spacing = 25;
        const cols = Math.max(1, Math.floor(rect.width / spacing));
        const rows = Math.max(1, Math.floor(rect.height / spacing));
        const spacingX = rect.width / cols;
        const spacingY = rect.height / rows;
        const maxRadius = Math.max(spacingX, spacingY);
        
        clipPath.innerHTML = '';
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = (col + 0.5) * spacingX;
                const y = (row + 0.5) * spacingY;
                
                const centerRow = (rows - 1) / 2;
                const centerCol = (cols - 1) / 2;
                const distance = Math.sqrt(
                    Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
                );
                const delay = distance * 0.04;
                
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', x);
                circle.setAttribute('cy', y);
                circle.setAttribute('r', '0');
                
                const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animate.setAttribute('attributeName', 'r');
                animate.setAttribute('values', `0;${maxRadius};0`);
                animate.setAttribute('dur', '4s');
                animate.setAttribute('repeatCount', 'indefinite');
                animate.setAttribute('fill', 'freeze');
                animate.setAttribute('begin', `${delay}s`);
                
                circle.appendChild(animate);
                clipPath.appendChild(circle);
            }
        }
    }
    
    // Scramble title animation
    animateScrambleTitle() {
        const tl = gsap.timeline();
        
        this.scrambleLines.forEach((line, i) => {
            const divs = line.querySelectorAll('div');
            
            tl.to(divs, {
                duration: 0.8,
                yPercent: 0,
                stagger: 0.04,
                ease: 'expo.inOut'
            }, i !== 0 ? '<' : 0);
            
            // Filter out divs where data-char is NOT "." for the exit
            const exitDivs = Array.from(divs).filter(d => d.dataset.char !== '.');
            
            tl.to(exitDivs, {
                duration: 0.8,
                yPercent: 103,
                stagger: 0.06,
                ease: 'expo.inOut'
            });
        });
        
        this.timelines.push(tl);
        return tl;
    }

    initScrollAnimations(scroller) {
        const meetTrigger = ScrollTrigger.create({
            trigger: this.container.querySelector('.meet-characters-subsection'),
            scroller,
            start: 'top 80%',
            once: true,
            onEnter: () => this.animateMeetEntrance()
        });
        this.scrollTriggers.push(meetTrigger);
        
        const vcTrigger = ScrollTrigger.create({
            trigger: this.container.querySelector('.voice-cast-subsection'),
            scroller,
            start: 'top 80%',
            once: true,
            onEnter: () => this.animateVCEntrance()
        });
        this.scrollTriggers.push(vcTrigger);
    }

    animateMeetEntrance() {
        const meetSection = this.container.querySelector('.meet-characters-subsection');
        const characterCards = this.characterCards;
        const characterSplash = this.characterSplash;
        const characterName = this.characterName;
        const divider = this.container.querySelector('.section-divider');
        
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
        tl.to(meetSection, { 
            opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' 
        });
        
        tl.fromTo(characterCards,
            { opacity: 0, scale: 0.8, x: -50 },
            { opacity: 1, scale: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.8)' },
            '-=0.5'
        );
        
        if (characterSplash) {
            tl.fromTo(characterSplash,
                { opacity: 0, scale: 0.85, y: 50 },
                { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.6)' },
                '-=0.4'
            );
        }
        
        if (characterName) {
            tl.fromTo(characterName,
                { opacity: 0, y: -30, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.7)' },
                '-=0.6'
            );
        }
        
        if (divider) {
            tl.to(divider, { 
                opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' 
            }, '-=0.3');
        }
    }

    animateVCEntrance() {
        const header = this.container.querySelector('.voice-cast-header');
        const bottomTape = this.container.querySelector('.vc-tape-bottom');
        
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
        tl.to(header, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
        tl.add(this.animateScrambleTitle(), '-=0.3');
        
        if (this.vcTape) {
            tl.to(this.vcTape, { 
                opacity: 1, scaleX: 1, 
                duration: 0.8, ease: 'elastic.out(1, 0.6)' 
            }, '-=1');
        }
        
        // Desktop cards stagger
        tl.to(this.vcCards, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7, stagger: 0.1,
            ease: 'elastic.out(1, 0.6)'
        }, '-=0.5');
        
        // Mobile accordion stagger
        tl.to(this.vcAccordionItems, {
            opacity: 1, x: 0,
            duration: 0.5, stagger: 0.08,
            ease: 'back.out(1.5)'
        }, '-=0.8');
        
        // Bottom tape
        if (bottomTape) {
            tl.to(bottomTape, {
                opacity: 1, scaleX: 1,
                duration: 0.8, ease: 'elastic.out(1, 0.6)'
            }, '-=0.4');
        }
        
        tl.call(() => this.initHalftoneReveal(), null, '-=0.3');
    }

    destroy() {
        this.scrollTriggers.forEach(st => st.kill());
        this.timelines.forEach(tl => tl?.kill?.());
        this.stopVoiceline();
        
        if (this.container?.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const charactersSection = new CharactersSection();
export default charactersSection; 
