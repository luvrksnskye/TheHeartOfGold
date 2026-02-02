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
                id: 'irene', name: 'Irene', archetype: 'ayuda',
                description: 'idk',
                icon: './src/assets/irene-icon.png', splash: './src/assets/irene.png', nameImg: './src/assets/irene_name.png',
                sprites: ['./src/assets/irene/block.gif', './src/assets/irene/idle.gif'],
                card: './src/assets/irene-card.png', color: '#e74c3c',
                stats: { hp: 'Medium', atk: 'Medium', def: 'Medium', spd: 'Medium' }
            },
            {
                id: 'zoe', name: 'Zoe', archetype: '??',
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
                video: './src/characters/Irene.mp4',
                hasVideo: true,
                voiceActors: { english: 'Abby Espiritu', spanish: 'Por anunciar', japanese: 'Por anunciar' },
                voicelines: { english: './src/voicelines/irene_en.mp3', spanish: './src/voicelines/irene_es.mp3', japanese: './src/voicelines/irene_jp.mp3' },
                colors: ['#E63946', '#FF6B6B', '#FF8E8E', '#D62828'],
                nameColor: '#E63946'
            },
            shiori: {
                portrait: './src/characters/shiori.png',
                video: './src/characters/shiori_color.png',
                hasVideo: false,
                voiceActors: { english: 'Phoebe Chan', spanish: 'Por anunciar', japanese: 'Por anunciar' },
                voicelines: { english: './src/voicelines/shiori_eng.wav', spanish: './src/voicelines/shiori_es.mp3', japanese: './src/voicelines/shiori_jp.wav' },
                colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#7C3AED'],
                nameColor: '#A78BFA'
            },
            zoe: {
                portrait: './src/characters/zoe.png',
                video: './src/characters/zoe.mp4',
                hasVideo: false,
                voiceActors: { english: 'Su Ling Chan', spanish: 'Por anunciar', japanese: 'Por anunciar' },
                voicelines: { english: './src/voicelines/zoe_en.mp3', spanish: './src/voicelines/zoe_es.mp3', japanese: './src/voicelines/zoe_jp.mp3' },
                colors: ['#EC4899', '#F472B6', '#FBCFE8', '#DB2777'],
                nameColor: '#F472B6'
            },
            maya: {
                portrait: './src/characters/maya.png',
                video: './src/characters/maya.mp4',
                hasVideo: false,
                voiceActors: { english: 'Ciara Payne', spanish: 'Por anunciar', japanese: 'Por anunciar' },
                voicelines: { english: './src/voicelines/maya_en.mp3', spanish: './src/voicelines/maya_es.mp3', japanese: './src/voicelines/maya_jp.mp3' },
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

        const vcAccordionHTML = this.vcOrder.map((id, index) => {
            const char = this.characters.find(c => c.id === id);
            const vcData = this.voiceCast[id];
            const inkSplash = this.generateInkSplashSVG(vcData.colors);
            const nameSplash = this.generateNameSplashSVG(vcData.nameColor);
            return `
                <div class="vc-accordion-item clickable" data-vc-character="${id}" data-index="${index}" data-has-video="${vcData.hasVideo}" style="--item-color: ${vcData.colors[0]}; --item-light: ${vcData.colors[1]}; --item-lighter: ${vcData.colors[2]};">
                    <div class="vc-accordion-ink-layer">
                        ${inkSplash}
                    </div>
                    <div class="vc-accordion-halftone"></div>
                    <div class="vc-accordion-media">
                        <img src="${vcData.portrait}" alt="${char?.name || id}" class="vc-accordion-img" loading="lazy">
                        ${vcData.hasVideo ? `<video src="${vcData.video}" class="vc-accordion-video" loop muted playsinline preload="metadata"></video>` : ''}
                    </div>
                    <div class="vc-accordion-shine"></div>
                    <div class="vc-accordion-name-tag">
                        <div class="vc-name-splash-bg">
                            ${nameSplash}
                        </div>
                        <span class="vc-accordion-name">${char?.name || id}</span>
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

        return `
            <div class="characters-background">
                <div class="char-bg-solid"></div>
                <div class="char-bg-stripes"></div>
            </div>
            
            <div class="meet-characters-subsection">
                <div class="characters-header">
                    <div class="char-title-wrapper">
                        <span class="char-section-label">//SECTION 04//</span>
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
                        <span class="vc-section-label">//SECTION 04//</span>
                        <div class="vc-title-container">
                            <div class="vc-title-splash-bg">
                                ${titleSplash}
                            </div>
                            <h2 class="vc-section-title">MEET OUR VOICE CAST</h2>
                        </div>
                    </div>
                </div>
                
                <div class="voice-cast-interface">
                    <div class="vc-accordion-container">
                        ${vcAccordionHTML}
                    </div>
                    
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
                                    <span class="vc-lang-text">ESPAÑOL</span>
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
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            vcSection.style.setProperty('--mouse-x', `${x}px`);
            vcSection.style.setProperty('--mouse-y', `${y}px`);
        });
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
                coreAnimation.squish(icon, { intensity: 0.5, duration: 0.4 });
                gsap.to(hover, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' });
                sfxManager.playGhost();
            });
            icon.addEventListener('mouseleave', () => {
                const hover = icon.querySelector('.char-icon-hover');
                if (!icon.classList.contains('active')) gsap.to(hover, { opacity: 0, scale: 0.8, duration: 0.3 });
            });
        });
        
        this.vcAccordionItems.forEach(item => {
            item.addEventListener('click', () => { 
                this.selectVCCharacter(item.dataset.vcCharacter); 
                sfxManager.playCheck1(); 
            });
            item.addEventListener('mouseenter', () => { 
                if (!item.classList.contains('active')) {
                    gsap.to(item, { scale: 1.03, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
                    gsap.to(item.querySelector('.vc-accordion-shine'), { opacity: 1, duration: 0.3 });
                }
                sfxManager.playGhost(); 
            });
            item.addEventListener('mouseleave', () => {
                if (!item.classList.contains('active')) {
                    gsap.to(item, { scale: 1, duration: 0.4, ease: 'power2.out' });
                    gsap.to(item.querySelector('.vc-accordion-shine'), { opacity: 0, duration: 0.3 });
                }
            });
        });
        
        this.vcLangBtns.forEach(btn => btn.addEventListener('click', () => { 
            this.selectLanguage(btn.dataset.lang); 
            sfxManager.playCheck2(); 
        }));
        
        this.vcPlayBtn?.addEventListener('click', () => this.toggleVoiceline());
        
        let touchStartX = 0;
        const splashContainer = this.container.querySelector('.char-splash-container');
        splashContainer?.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        splashContainer?.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].screenX - touchStartX;
            if (Math.abs(diff) > 50) {
                const idx = this.characters.findIndex(c => c.id === this.currentCharacter.id);
                const nextIdx = diff > 0 ? (idx - 1 + this.characters.length) % this.characters.length : (idx + 1) % this.characters.length;
                this.selectCharacter(this.characters[nextIdx].id);
            }
        }, { passive: true });
    }

    selectCharacter(characterId) {
        if (this.isAnimating) return;
        const character = this.characters.find(c => c.id === characterId);
        if (!character || character.id === this.currentCharacter?.id) return;
        
        this.isAnimating = true;
        this.currentCharacter = character;
        this.container.setAttribute('data-character', characterId);
        
        this.iconWrappers.forEach(icon => {
            const isActive = icon.dataset.character === characterId;
            icon.classList.toggle('active', isActive);
            const hover = icon.querySelector('.char-icon-hover');
            gsap.to(hover, { opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8, duration: 0.3 });
        });
        
        const prevSplash = this.splashWrappers.find(s => s.classList.contains('active'));
        const newSplash = this.splashWrappers.find(s => s.dataset.character === characterId);
        const prevName = this.nameImgWrappers.find(n => n.classList.contains('active'));
        const newName = this.nameImgWrappers.find(n => n.dataset.character === characterId);
        const prevSprite = this.spriteWrappers.find(s => s.classList.contains('active'));
        const newSprite = this.spriteWrappers.find(s => s.dataset.character === characterId);
        const prevCard = this.cardWrappers.find(c => c.classList.contains('active'));
        const newCard = this.cardWrappers.find(c => c.dataset.character === characterId);
        
        const tl = gsap.timeline({ onComplete: () => { this.isAnimating = false; } });
        
        if (prevSplash) tl.to(prevSplash, { opacity: 0, x: -60, scale: 0.9, duration: 0.3, ease: 'power2.in', onComplete: () => prevSplash.classList.remove('active') }, 0);
        if (prevName) tl.to(prevName, { opacity: 0, y: 20, duration: 0.25, ease: 'power2.in', onComplete: () => prevName.classList.remove('active') }, 0);
        if (prevSprite) tl.to(prevSprite, { opacity: 0, x: 30, duration: 0.25, ease: 'power2.in', onComplete: () => prevSprite.classList.remove('active') }, 0);
        if (prevCard) tl.to(prevCard, { opacity: 0, y: -15, duration: 0.2, ease: 'power2.in', onComplete: () => prevCard.classList.remove('active') }, 0);
        
        if (newSplash) {
            newSplash.classList.add('active');
            tl.fromTo(newSplash, { opacity: 0, x: 60, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: 'power2.out' }, 0.2);
            coreAnimation.squish(newSplash, { intensity: 0.4, duration: 0.5, delay: 0.25 });
        }
        if (newName) { newName.classList.add('active'); tl.fromTo(newName, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }, 0.35); }
        if (newSprite) { newSprite.classList.add('active'); tl.fromTo(newSprite, { opacity: 0, x: -30, scale: 0.8 }, { opacity: 1, x: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }, 0.25); }
        if (newCard) { newCard.classList.add('active'); tl.fromTo(newCard, { opacity: 0, y: 15, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(2)' }, 0.3); }
        
        tl.call(() => {
            gsap.to([this.archetypeEl, this.hpEl, this.atkEl, this.defEl, this.spdEl, this.descriptionEl], {
                opacity: 0, y: -10, duration: 0.15, stagger: 0.02, ease: 'power2.in',
                onComplete: () => {
                    if (this.archetypeEl) this.archetypeEl.textContent = character.archetype;
                    if (this.hpEl) this.hpEl.textContent = character.stats.hp;
                    if (this.atkEl) this.atkEl.textContent = character.stats.atk;
                    if (this.defEl) this.defEl.textContent = character.stats.def;
                    if (this.spdEl) this.spdEl.textContent = character.stats.spd;
                    if (this.descriptionEl) this.descriptionEl.textContent = character.description;
                    gsap.to([this.archetypeEl, this.hpEl, this.atkEl, this.defEl, this.spdEl, this.descriptionEl], { opacity: 1, y: 0, duration: 0.25, stagger: 0.03, ease: 'back.out(1.5)' });
                }
            });
        }, null, 0.1);
        
        sfxManager.playConfirm();
    }

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
            
            if (isActive) {
                item.classList.add('active');
                gsap.to(item, { flex: 3, duration: 0.7, ease: 'elastic.out(1, 0.6)' });
                gsap.to(inkLayer, { scale: 1.1, opacity: 1, duration: 0.6, ease: 'power2.out' });
                gsap.to(shine, { opacity: 0.5, duration: 0.4 });
                if (video) { img?.classList.add('hidden'); video.currentTime = 0; video.play().catch(() => {}); }
                if (!wasActive) { gsap.fromTo(item, { scaleY: 0.92, scaleX: 1.03 }, { scaleY: 1, scaleX: 1, duration: 0.6, ease: 'elastic.out(1.3, 0.4)' }); }
            } else {
                item.classList.remove('active');
                gsap.to(item, { flex: 1, duration: 0.5, ease: 'power3.out' });
                gsap.to(inkLayer, { scale: 1, opacity: 0.7, duration: 0.4 });
                gsap.to(shine, { opacity: 0, duration: 0.3 });
                if (video) { video.pause(); video.currentTime = 0; }
                img?.classList.remove('hidden');
            }
        });
        
        this.vcControlPanel?.classList.add('active');
        this.vcControlPanel?.style.setProperty('--active-color', themeColor);
        this.vcControlPanel?.style.setProperty('--active-light', lightColor);
        
        gsap.fromTo(this.vcControlPanel, { opacity: 0, y: 60, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.7)', clearProps: 'scale' });
        
        this.updateVoiceActorDisplay();
        this.stopVoiceline();
    }

    selectLanguage(language) {
        this.currentLanguage = language;
        this.vcLangBtns.forEach(btn => {
            const isActive = btn.dataset.lang === language;
            btn.classList.toggle('active', isActive);
            const inkFill = btn.querySelector('.vc-lang-ink-fill');
            gsap.to(inkFill, { scaleX: isActive ? 1 : 0, duration: 0.5, ease: isActive ? 'elastic.out(1, 0.5)' : 'power2.in' });
            if (isActive) { gsap.fromTo(btn, { scale: 0.92 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1.3, 0.4)' }); }
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
                gsap.to(this.vcActorName, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
            }
        });
        
        if (this.vcCharacterLabel) {
            gsap.to(this.vcCharacterLabel, {
                opacity: 0, x: -10, duration: 0.2,
                onComplete: () => {
                    this.vcCharacterLabel.textContent = `as ${char?.name || this.currentVCCharacter}`;
                    gsap.to(this.vcCharacterLabel, { opacity: 1, x: 0, duration: 0.3, ease: 'back.out(2)' });
                }
            });
        }
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
        this.currentAudio.addEventListener('error', () => { this.stopVoiceline(); });
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
            gsap.fromTo(this.vcPlayBtn, { scale: 0.75, rotation: -10 }, { scale: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1.5, 0.4)' });
            sfxManager.playConfirm();
        }).catch(() => {});
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
        
        tl.to(header, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
        const titleMain = header?.querySelector('.char-title-main');
        if (titleMain) coreAnimation.animateText(titleMain, { delay: 0.2 });
        tl.to(content, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4');
        tl.fromTo(icons, { opacity: 0, scale: 0.5, y: 25 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.8)' }, '-=0.4');
        const activeSplash = this.splashWrappers.find(s => s.classList.contains('active'));
        if (activeSplash) tl.fromTo(activeSplash, { opacity: 0, scale: 0.85, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.6');
        tl.to(divider, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }, '-=0.3');
    }

    animateVCEntrance() {
        const header = this.container.querySelector('.voice-cast-header');
        const interface_ = this.container.querySelector('.voice-cast-interface');
        const accordionItems = this.vcAccordionItems;
        const bgSplashes = this.container.querySelectorAll('.vc-bg-splash');
        
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
        tl.fromTo(bgSplashes, { scale: 0, opacity: 0, rotation: -30 }, { scale: 1, opacity: 1, rotation: 0, duration: 1.2, stagger: 0.1, ease: 'elastic.out(1, 0.5)' });
        tl.to(header, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.8');
        tl.to(interface_, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.5');
        tl.fromTo(accordionItems, { opacity: 0, scaleX: 0.2, x: -80 }, { opacity: 1, scaleX: 1, x: 0, duration: 0.8, stagger: 0.12, ease: 'elastic.out(1, 0.6)' }, '-=0.5');
    }

    destroy() {
        this.scrollTriggers.forEach(st => st.kill());
        this.timelines.forEach(tl => tl?.kill?.());
        this.stopVoiceline();
        this.vcAccordionItems?.forEach(item => {
            const video = item.querySelector('.vc-accordion-video');
            if (video) { video.pause(); video.src = ''; }
        });
        if (this.container?.parentNode) this.container.parentNode.removeChild(this.container);
    }
}

export const charactersSection = new CharactersSection();
export default charactersSection;
