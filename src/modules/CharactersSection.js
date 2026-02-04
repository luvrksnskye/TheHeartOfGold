/**
 * Estoy intentando complementar algunas cosas, mejorarlo considerando que tenemos algo de tiempo. Ando en eso porque genuinamente me gusta este módulo y no quiero que quede a medias. Ademas, no puedo dormir sabiendo que este módulo no está perfecto. ajdajmsdj quiero pensar que esto es optimo para manejar mas personajes en el futuro.
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
                    spanish: 'Por anunciar',
                    japanese: 'Por anunciar'
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
                portrait: './src/characters/shiori.png',
                hasVideo: false,
                voiceActors: {
                    english: 'Phoebe Chan',
                    spanish: 'Por anunciar',
                    japanese: 'Por anunciar'
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
                    spanish: 'Por anunciar',
                    japanese: 'Por anunciar'
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
                    spanish: 'Por anunciar',
                    japanese: 'Por anunciar'
                },
                voicelines: {
                    english: './src/voicelines/maya_en.mp3',
                    spanish: './src/voicelines/maya_es.mp3',
                    japanese: './src/voicelines/maya_jp.mp3'
                },
                colors: ['#10B981', '#34D399', '#6EE7B7', '#059669'],
                nameColor: '#34D399'
            }
        };
        
        this.vcOrder = ['irene', 'shiori', 'zoe', 'maya'];
    }

    generateInkSplashSVG(colors) {
        const [c1, c2, c3, c4] = colors;
        return `
            <svg class="vc-ink-splash-svg" viewBox="0 0 800 600" preserveAspectRatio="none">
                <defs>
                    <filter id="goo-main" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur"/>
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -12" result="goo"/>
                    </filter>
                </defs>
                <g filter="url(#goo-main)">
                    <ellipse cx="400" cy="300" rx="320" ry="220" fill="${c1}">
                        <animate attributeName="rx" dur="8s" values="320;340;320" repeatCount="indefinite"/>
                        <animate attributeName="ry" dur="6s" values="220;240;220" repeatCount="indefinite"/>
                    </ellipse>
                    <ellipse cx="150" cy="200" rx="120" ry="100" fill="${c2}">
                        <animate attributeName="cx" dur="10s" values="150;170;150" repeatCount="indefinite"/>
                    </ellipse>
                    <ellipse cx="650" cy="180" rx="100" ry="90" fill="${c3}"/>
                    <ellipse cx="200" cy="450" rx="140" ry="100" fill="${c2}"/>
                    <ellipse cx="600" cy="480" rx="130" ry="90" fill="${c4}"/>
                    <circle cx="100" cy="350" r="60" fill="${c3}"/>
                    <circle cx="700" cy="300" r="55" fill="${c1}"/>
                    <circle cx="350" cy="100" r="50" fill="${c4}"/>
                    <circle cx="500" cy="520" r="45" fill="${c2}"/>
                    <ellipse cx="80" cy="150" rx="50" ry="40" fill="${c1}"/>
                    <ellipse cx="720" cy="450" rx="55" ry="45" fill="${c3}"/>
                </g>
            </svg>
        `;
    }

    generateNameSplashSVG(color) {
        return `
            <svg class="vc-name-splash-svg" viewBox="0 0 200 70" preserveAspectRatio="none">
                <defs>
                    <filter id="name-goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"/>
                    </filter>
                </defs>
                <g filter="url(#name-goo)">
                    <ellipse cx="100" cy="35" rx="85" ry="28" fill="${color}"/>
                    <circle cx="25" cy="30" r="18" fill="${color}"/>
                    <circle cx="175" cy="40" r="15" fill="${color}"/>
                    <ellipse cx="60" cy="55" rx="22" ry="12" fill="${color}"/>
                    <ellipse cx="145" cy="18" rx="18" ry="10" fill="${color}"/>
                </g>
            </svg>
        `;
    }

    generateTitleSplashSVG() {
        return `
            <svg class="vc-title-splash-svg" viewBox="0 0 600 100" preserveAspectRatio="none">
                <defs>
                    <filter id="title-goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -12"/>
                    </filter>
                </defs>
                <g filter="url(#title-goo)">
                    <ellipse cx="300" cy="50" rx="260" ry="38" fill="#F472B6"/>
                    <ellipse cx="80" cy="45" rx="60" ry="35" fill="#F472B6"/>
                    <ellipse cx="520" cy="55" rx="55" ry="32" fill="#F472B6"/>
                    <circle cx="180" cy="75" r="22" fill="#F472B6"/>
                    <circle cx="420" cy="25" r="20" fill="#F472B6"/>
                    <circle cx="40" cy="60" r="25" fill="#F472B6"/>
                    <circle cx="560" cy="40" r="22" fill="#F472B6"/>
                </g>
            </svg>
        `;
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

        const vcAccordionHTML = this.vcOrder.map((id, index) => {
            const char = this.characters.find(c => c.id === id);
            const vcData = this.voiceCast[id];
            const inkSplash = this.generateInkSplashSVG(vcData.colors);
            const nameSplash = this.generateNameSplashSVG(vcData.nameColor);
            const charName = char?.name || id;
            
            const mediaHTML = vcData.hasVideo 
                ? `<img src="${vcData.portrait}" alt="${charName}" class="vc-accordion-img" loading="lazy">
                   <video class="vc-accordion-video" loop muted playsinline preload="metadata">
                       <source src="${vcData.video}" type="video/mp4">
                   </video>`
                : `<img src="${vcData.portrait}" alt="${charName}" class="vc-accordion-img" loading="lazy">`;
            
            return `
                <div class="vc-accordion-item clickable" data-vc-character="${id}" data-index="${index}" data-has-video="${vcData.hasVideo}" style="--item-color: ${vcData.colors[0]}; --item-light: ${vcData.colors[1]}; --item-lighter: ${vcData.colors[2]};">
                    <div class="vc-accordion-ink-layer">${inkSplash}</div>
                    <div class="vc-accordion-halftone"></div>
                    <div class="vc-accordion-media">${mediaHTML}</div>
                    <div class="vc-accordion-shine"></div>
                    <div class="vc-accordion-name-tag">
                        <div class="vc-name-splash-bg">${nameSplash}</div>
                        <span class="vc-accordion-name">${charName}</span>
                    </div>
                    <div class="vc-accordion-drops">
                        <span class="vc-drop" style="--delay: 0s; --x: 15%; --size: 14px;"></span>
                        <span class="vc-drop" style="--delay: 0.4s; --x: 40%; --size: 10px;"></span>
                        <span class="vc-drop" style="--delay: 0.8s; --x: 65%; --size: 16px;"></span>
                        <span class="vc-drop" style="--delay: 1.2s; --x: 85%; --size: 12px;"></span>
                    </div>
                </div>
            `;
        }).join('');

        const waveformHTML = Array(20).fill('<span class="vc-wave-bar"></span>').join('');
        const titleSplash = this.generateTitleSplashSVG();
        const firstChar = this.characters[0];

        return `
            <div class="characters-background">
                <div class="char-bg-solid"></div>
                <div class="char-bg-stripes"></div>
            </div>
            
         <!-- Meet Characters Subsection - Nuevo diseño -->
            <div class="meet-characters-subsection">
        
                <!-- Fondo con patrón de puntos -->
                <div class="background-pattern"></div>
                
                <!-- Línea diagonal divisoria -->
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
                
                <!-- Panel derecho - Información del personaje -->
                <aside class="character-info">
                    <div class="info-panel">
                        <!-- Banner del personaje -->
                        <div class="character-banner">
                            <img src="${firstChar.banner}" alt="${firstChar.name} Banner" id="characterBanner" class="banner-image">
                        </div>
                        
                        <!-- Estadísticas -->
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
                        
                        <!-- Descripción del personaje -->
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
            
            
            <!-- Voice Cast Subsection (mantenido igual) -->
            <div class="voice-cast-subsection">
                <div class="voice-cast-header">
                    <div class="vc-title-wrapper">
                        <span class="vc-section-label">//SECTION 04//</span>
                        <div class="vc-title-container">
                            <div class="vc-title-splash-bg">${titleSplash}</div>
                            <h2 class="vc-section-title">MEET OUR VOICE CAST</h2>
                        </div>
                    </div>
                </div>
                
                <div class="voice-cast-interface">
                    <div class="vc-accordion-container">${vcAccordionHTML}</div>
                    
                    <div class="vc-control-panel" id="vc-control-panel">
                        <div class="vc-panel-splash-bg">
                            <svg viewBox="0 0 900 380" preserveAspectRatio="none">
                                <defs>
                                    <filter id="panel-goo">
                                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/>
                                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -14"/>
                                    </filter>
                                </defs>
                                <g filter="url(#panel-goo)">
                                    <rect x="40" y="40" width="820" height="300" rx="25" fill="#0f0f0f"/>
                                    <circle cx="30" cy="120" r="40" fill="#0f0f0f"/>
                                    <circle cx="870" cy="260" r="45" fill="#0f0f0f"/>
                                    <ellipse cx="120" cy="350" rx="55" ry="35" fill="#0f0f0f"/>
                                    <ellipse cx="780" cy="30" rx="50" ry="30" fill="#0f0f0f"/>
                                    <circle cx="450" cy="15" r="25" fill="#0f0f0f"/>
                                    <circle cx="450" cy="365" r="28" fill="#0f0f0f"/>
                                </g>
                            </svg>
                        </div>
                        <div class="vc-panel-border"></div>
                        
                        <div class="vc-language-section">
                            <div class="vc-language-header">
                                <div class="vc-label-splash">
                                    <svg viewBox="0 0 200 55" preserveAspectRatio="none">
                                        <defs>
                                            <filter id="label-goo"><feGaussianBlur stdDeviation="4"/><feColorMatrix mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"/></filter>
                                        </defs>
                                        <g filter="url(#label-goo)">
                                            <ellipse cx="100" cy="27" rx="88" ry="22" fill="var(--active-color, #EC4899)"/>
                                            <circle cx="18" cy="24" r="14" fill="var(--active-color, #EC4899)"/>
                                            <circle cx="182" cy="30" r="12" fill="var(--active-color, #EC4899)"/>
                                        </g>
                                    </svg>
                                    <span>SELECT LANGUAGE</span>
                                </div>
                            </div>
                            <div class="vc-language-buttons">
                                <button class="vc-lang-btn clickable active" data-lang="english">
                                    <div class="vc-lang-ink-fill"></div>
                                    <span class="vc-lang-text">ENGLISH</span>
                                </button>
                                <button class="vc-lang-btn clickable" data-lang="spanish">
                                    <div class="vc-lang-ink-fill"></div>
                                    <span class="vc-lang-text">ESPANOL</span>
                                </button>
                                <button class="vc-lang-btn clickable" data-lang="japanese">
                                    <div class="vc-lang-ink-fill"></div>
                                    <span class="vc-lang-text">日本語</span>
                                </button>
                            </div>
                        </div>
                        
                        <div class="vc-actor-section">
                            <div class="vc-actor-card">
                                <div class="vc-actor-ink-blob"></div>
                                <div class="vc-actor-info">
                                    <span class="vc-actor-label">VOICE ACTOR</span>
                                    <span class="vc-actor-name" id="vc-actor-name">-</span>
                                </div>
                                <div class="vc-character-tag">
                                    <span class="vc-character-label" id="vc-character-label">Select a character</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="vc-player-section">
                            <div class="vc-player-header">
                                <div class="vc-label-splash small">
                                    <svg viewBox="0 0 160 45" preserveAspectRatio="none">
                                        <defs>
                                            <filter id="label-goo-sm"><feGaussianBlur stdDeviation="3.5"/><feColorMatrix mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"/></filter>
                                        </defs>
                                        <g filter="url(#label-goo-sm)">
                                            <ellipse cx="80" cy="22" rx="68" ry="18" fill="var(--active-color, #EC4899)"/>
                                            <circle cx="15" cy="20" r="11" fill="var(--active-color, #EC4899)"/>
                                            <circle cx="145" cy="24" r="10" fill="var(--active-color, #EC4899)"/>
                                        </g>
                                    </svg>
                                    <span>VOICE SAMPLE</span>
                                </div>
                            </div>
                            <div class="vc-player-controls" id="vc-player-controls">
                                <button class="vc-play-btn clickable" id="vc-play-btn" aria-label="Play voiceline">
                                    <div class="vc-play-splash">
                                        <svg viewBox="0 0 90 90">
                                            <defs>
                                                <filter id="play-goo"><feGaussianBlur stdDeviation="4"/><feColorMatrix mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"/></filter>
                                            </defs>
                                            <g filter="url(#play-goo)">
                                                <circle cx="45" cy="45" r="35" fill="var(--active-color, #EC4899)"/>
                                                <circle cx="18" cy="40" r="14" fill="var(--active-color, #EC4899)"/>
                                                <circle cx="72" cy="50" r="12" fill="var(--active-color, #EC4899)"/>
                                                <circle cx="45" cy="15" r="10" fill="var(--active-color, #EC4899)"/>
                                                <circle cx="45" cy="75" r="11" fill="var(--active-color, #EC4899)"/>
                                            </g>
                                        </svg>
                                    </div>
                                    <svg class="vc-play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    <svg class="vc-pause-icon" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                </button>
                                <div class="vc-waveform-container">
                                    <div class="vc-waveform">${waveformHTML}</div>
                                </div>
                            </div>
                            <div class="vc-progress">
                                <div class="vc-progress-bar" id="vc-progress-bar"></div>
                            </div>
                        </div>
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
        // Nuevos elementos del diseño actualizado
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
        
        // Voice cast elements (mantenidos)
        this.vcAccordionItems = Array.from(this.container.querySelectorAll('.vc-accordion-item'));
        this.vcControlPanel = this.container.querySelector('#vc-control-panel');
        this.vcLangBtns = Array.from(this.container.querySelectorAll('.vc-lang-btn'));
        this.vcActorName = this.container.querySelector('#vc-actor-name');
        this.vcCharacterLabel = this.container.querySelector('#vc-character-label');
        this.vcPlayerControls = this.container.querySelector('#vc-player-controls');
        this.vcPlayBtn = this.container.querySelector('#vc-play-btn');
        this.vcProgressBar = this.container.querySelector('#vc-progress-bar');
    }

    setInitialStates() {
        const meetSection = this.container.querySelector('.meet-characters-subsection');
        const vcHeader = this.container.querySelector('.voice-cast-header');
        const vcInterface = this.container.querySelector('.voice-cast-interface');
        const divider = this.container.querySelector('.section-divider');
        
        gsap.set([meetSection, vcHeader], { opacity: 0, y: 30 });
        gsap.set(vcInterface, { opacity: 0 });
        gsap.set(divider, { opacity: 0, scale: 0.8 });
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
        
        // Eventos para Voice Cast (mantenidos)
        this.vcAccordionItems.forEach(item => {
            const shine = item.querySelector('.vc-accordion-shine');
            
            item.addEventListener('click', () => {
                this.selectVCCharacter(item.dataset.vcCharacter);
                sfxManager.playCheck1();
            });
            
            item.addEventListener('mouseenter', () => {
                if (!item.classList.contains('active')) {
                    gsap.to(item, { scale: 1.03, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
                    gsap.to(shine, { opacity: 1, duration: 0.3 });
                }
                sfxManager.playGhost();
            });
            
            item.addEventListener('mouseleave', () => {
                if (!item.classList.contains('active')) {
                    gsap.to(item, { scale: 1, duration: 0.4, ease: 'power2.out' });
                    gsap.to(shine, { opacity: 0, duration: 0.3 });
                }
            });
        });
        
        this.vcLangBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectLanguage(btn.dataset.lang);
                sfxManager.playCheck2();
            });
        });
        
        this.vcPlayBtn?.addEventListener('click', () => this.toggleVoiceline());
        
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
            
            // Animación para la tarjeta activa
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
        
        // Agregar clase de transición
        characterDisplay.classList.add('switching');
        
        const tl = gsap.timeline({
            onComplete: () => {
                this.isAnimating = false;
                characterDisplay.classList.remove('switching');
            }
        });
        
        // Animación de salida
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
        
        // Animación de entrada
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
        
        // Animación de las barras de estadísticas
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
        
        // Animación de los valores de estadísticas
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
        
        // Actualizar valores de estadísticas
        this.statAttack.textContent = character.stats.attack.value.toLocaleString();
        this.statDefense.textContent = character.stats.defense.value.toLocaleString();
        this.statSpeed.textContent = character.stats.speed.value.toLocaleString();
        this.statSpecial.textContent = character.stats.special.value.toLocaleString();
        
        // Actualizar imágenes
        this.characterSplash.src = character.splash;
        this.characterSplash.alt = `${character.name} Splash`;
        this.characterBanner.src = character.banner;
        this.characterBanner.alt = `${character.name} Banner`;
        this.characterSprite.src = character.sprite;
        this.characterSprite.alt = `${character.name} Sprite`;
    }

    // Métodos de Voice Cast (mantenidos sin cambios)
    selectVCCharacter(characterId) {
        const wasActive = this.currentVCCharacter === characterId;
        this.currentVCCharacter = characterId;
        
        const vcData = this.voiceCast[characterId];
        const themeColor = vcData?.colors[0] || '#EC4899';
        const lightColor = vcData?.colors[1] || '#F472B6';
        
        this.vcAccordionItems.forEach(item => {
            const isActive = item.dataset.vcCharacter === characterId;
            const video = item.querySelector('.vc-accordion-video');
            const img = item.querySelector('.vc-accordion-img');
            const inkLayer = item.querySelector('.vc-accordion-ink-layer');
            const shine = item.querySelector('.vc-accordion-shine');
            const hasVideo = item.dataset.hasVideo === 'true';
            
            if (isActive) {
                item.classList.add('active');
                gsap.to(item, { flex: 3, duration: 0.7, ease: 'elastic.out(1, 0.6)' });
                gsap.to(inkLayer, { scale: 1.1, opacity: 1, duration: 0.6, ease: 'power2.out' });
                gsap.to(shine, { opacity: 0.5, duration: 0.4 });
                
                if (hasVideo && video) {
                    img?.classList.add('hidden');
                    video.currentTime = 0;
                    video.play().catch(() => {
                        img?.classList.remove('hidden');
                    });
                }
                
                if (!wasActive) {
                    gsap.fromTo(item,
                        { scaleY: 0.92, scaleX: 1.03 },
                        { scaleY: 1, scaleX: 1, duration: 0.6, ease: 'elastic.out(1.3, 0.4)' }
                    );
                }
            } else {
                item.classList.remove('active');
                gsap.to(item, { flex: 1, duration: 0.5, ease: 'power3.out' });
                gsap.to(inkLayer, { scale: 1, opacity: 0.7, duration: 0.4 });
                gsap.to(shine, { opacity: 0, duration: 0.3 });
                
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }
                img?.classList.remove('hidden');
            }
        });
        
        this.vcControlPanel?.classList.add('active');
        this.vcControlPanel?.style.setProperty('--active-color', themeColor);
        this.vcControlPanel?.style.setProperty('--active-light', lightColor);
        
        gsap.fromTo(this.vcControlPanel,
            { opacity: 0, y: 60, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.7)', clearProps: 'scale' }
        );
        
        this.updateVoiceActorDisplay();
        this.stopVoiceline();
    }

    selectLanguage(language) {
        this.currentLanguage = language;
        
        this.vcLangBtns.forEach(btn => {
            const isActive = btn.dataset.lang === language;
            btn.classList.toggle('active', isActive);
            
            const inkFill = btn.querySelector('.vc-lang-ink-fill');
            gsap.to(inkFill, {
                scaleX: isActive ? 1 : 0,
                duration: 0.5,
                ease: isActive ? 'elastic.out(1, 0.5)' : 'power2.in'
            });
            
            if (isActive) {
                gsap.fromTo(btn, { scale: 0.92 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1.3, 0.4)' });
            }
        });
        
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
            opacity: 0, y: -25, scale: 0.85, duration: 0.25, ease: 'power2.in',
            onComplete: () => {
                if (this.vcActorName) this.vcActorName.textContent = actorName;
                gsap.to(this.vcActorName, {
                    opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)'
                });
            }
        });
        
        if (this.vcCharacterLabel) {
            gsap.to(this.vcCharacterLabel, {
                opacity: 0, x: -10, duration: 0.2,
                onComplete: () => {
                    this.vcCharacterLabel.textContent = `as ${char?.name || this.currentVCCharacter}`;
                    gsap.to(this.vcCharacterLabel, {
                        opacity: 1, x: 0, duration: 0.3, ease: 'back.out(2)'
                    });
                }
            });
        }
    }

    toggleVoiceline() {
        if (!this.currentVCCharacter) return;
        
        if (this.isPlayingVoiceline && this.currentAudio) {
            this.stopVoiceline();
            return;
        }
        
        const vcData = this.voiceCast[this.currentVCCharacter];
        if (!vcData) return;
        
        const voicelineSrc = vcData.voicelines[this.currentLanguage];
        this.currentAudio = new Audio(voicelineSrc);
        this.currentAudio.volume = 0.7;
        
        this.currentAudio.addEventListener('ended', () => this.stopVoiceline());
        this.currentAudio.addEventListener('error', () => this.stopVoiceline());
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
            gsap.fromTo(this.vcPlayBtn,
                { scale: 0.75, rotation: -10 },
                { scale: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1.5, 0.4)' }
            );
            sfxManager.playConfirm();
        }).catch(() => {});
    }

    stopVoiceline() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        this.isPlayingVoiceline = false;
        this.vcPlayBtn?.classList.remove('playing');
        this.vcPlayerControls?.classList.remove('playing');
        if (this.vcProgressBar) this.vcProgressBar.style.width = '0%';
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
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: 'power2.out' 
        });
        
        // Animación de las tarjetas
        tl.fromTo(characterCards,
            { opacity: 0, scale: 0.8, x: -50 },
            { 
                opacity: 1, 
                scale: 1, 
                x: 0, 
                duration: 0.6, 
                stagger: 0.1, 
                ease: 'back.out(1.8)' 
            },
            '-=0.5'
        );
        
        // Animación del splash
        if (characterSplash) {
            tl.fromTo(characterSplash,
                { opacity: 0, scale: 0.85, y: 50 },
                { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0, 
                    duration: 0.9, 
                    ease: 'elastic.out(1, 0.6)' 
                },
                '-=0.4'
            );
        }
        
        // Animación del nombre
        if (characterName) {
            tl.fromTo(characterName,
                { opacity: 0, y: -30, scale: 0.9 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    duration: 0.7, 
                    ease: 'back.out(1.7)' 
                },
                '-=0.6'
            );
        }
        
        // Animación del divisor
        tl.to(divider, { 
            opacity: 1, 
            scale: 1, 
            duration: 0.5, 
            ease: 'back.out(1.8)' 
        }, '-=0.3');
    }

    animateVCEntrance() {
        const header = this.container.querySelector('.voice-cast-header');
        const interface_ = this.container.querySelector('.voice-cast-interface');
        const bgSplashes = this.container.querySelectorAll('.vc-bg-splash');
        
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
        tl.fromTo(bgSplashes,
            { scale: 0, opacity: 0, rotation: -30 },
            { scale: 1, opacity: 1, rotation: 0, duration: 1.2, stagger: 0.1, ease: 'elastic.out(1, 0.5)' }
        );
        tl.to(header, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.8');
        tl.to(interface_, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.5');
        tl.fromTo(this.vcAccordionItems,
            { opacity: 0, scaleX: 0.2, x: -80 },
            { opacity: 1, scaleX: 1, x: 0, duration: 0.8, stagger: 0.12, ease: 'elastic.out(1, 0.6)' },
            '-=0.5'
        );
    }

    destroy() {
        this.scrollTriggers.forEach(st => st.kill());
        this.timelines.forEach(tl => tl?.kill?.());
        this.stopVoiceline();
        
        this.vcAccordionItems?.forEach(item => {
            const video = item.querySelector('.vc-accordion-video');
            if (video) {
                video.pause();
                video.removeAttribute('src');
                video.load();
            }
        });
        
        if (this.container?.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const charactersSection = new CharactersSection();
export default charactersSection; 
