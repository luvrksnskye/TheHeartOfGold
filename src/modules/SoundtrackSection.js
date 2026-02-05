/**
 * SoundtrackSection - Section 05: Game Soundtrack
 * The Heart of Gold
 * Music only changes when user manually selects a track
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm';
import coreAnimation from '../utils/CoreAnimation.js';
import audioManager from '../utils/AudioManager.js';
import sfxManager from '../utils/SFXManager.js';

gsap.registerPlugin(ScrollTrigger);

class SoundtrackSection {
    constructor() {
        this.container = null;
        this.scrollTriggers = [];
        this.timelines = [];
        this.currentTrack = null;
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.progress = 0;
        this.progressInterval = null;
        this.reelTimeline = null;
        
        // Dependencies (injected via create)
        this.audioManager = null;
        this.sfxManager = null;
        this.coreAnimation = null;
        
        this.tracks = [
            { 
                id: 1, 
                name: 'Day Theme I', 
                artist: 'Main OST', 
                duration: '4:46',
                durationSeconds: 286,
                file: './src/music/day1theme_2.mp3',
                color: '#d64d7a'
            },
            { 
                id: 2, 
                name: 'Day Theme II', 
                artist: 'Main OST', 
                duration: '5:05',
                durationSeconds: 305,
                file: './src/music/day2theme_UPDT.mp3',
                color: '#813ce8'
            },
            { 
                id: 3, 
                name: 'Day Theme III', 
                artist: 'Main OST', 
                duration: '5:18',
                durationSeconds: 318,
                file: './src/music/day3theme_UPDT.mp3',
                color: '#e74c3c'
            },
            { 
                id: 4, 
                name: 'Night Theme I', 
                artist: 'Main OST', 
                duration: '4:32',
                durationSeconds: 272,
                file: './src/music/Night1_UPDT.mp3',
                color: '#2ecc71'
            },
            { 
                id: 5, 
                name: 'Night Theme II', 
                artist: 'Main OST', 
                duration: '5:08',
                durationSeconds: 308,
                file: './src/music/Night2_UPDT.mp3',
                color: '#ff69b4'
            }
        ];
        
        // Set default track
        this.currentTrack = this.tracks[0];
    }

    create(parentContainer, dependencies = {}) {
        // Inject dependencies
        this.audioManager = dependencies.audioManager || audioManager;
        this.sfxManager = dependencies.sfxManager || sfxManager;
        this.coreAnimation = dependencies.coreAnimation || coreAnimation;
        
        this.container = document.createElement('section');
        this.container.id = 'soundtrack-section';
        this.container.className = 'soundtrack-section';
        
        this.container.innerHTML = `
            <div class="soundtrack-background">
                <div class="st-bg-solid"></div>
                <div class="st-bg-stripes"></div>
                <div class="st-floating-notes">
                    ${this.createFloatingNotes()}
                </div>
            </div>
            
            <div class="soundtrack-content">
                <header class="soundtrack-header">
                    <div class="st-header-deco left">
                        <span class="st-deco-line"></span>
                        <span class="st-deco-dot"></span>
                    </div>
                    <div class="st-title-container">
                        <span class="st-section-number">SECTION 05</span>
                        <h2 class="st-title">SOUNDTRACK</h2>
                        <p class="st-subtitle">ORIGINAL GAME MUSIC</p>
                    </div>
                    <div class="st-header-deco right">
                        <span class="st-deco-dot"></span>
                        <span class="st-deco-line"></span>
                    </div>
                </header>
                
                <div class="soundtrack-main">
                    <div class="cassette-player-area">
                        <div class="cassette-wrapper">
                            <div class="cassette-slot"></div>
                            <div class="cassette" id="soundtrack-cassette">
                                <div class="cassette-top">
                                    <div class="cassette-arrow">
                                        <span class="arrow-symbol"></span>
                                    </div>
                                    <div class="cassette-brand">THE HEART OF GOLD</div>
                                </div>
                                
                                <div class="cassette-middle">
                                    <div class="cassette-label-container">
                                        <div class="cassette-label">
                                            <div class="label-top">
                                                <span class="label-prefix">NOW PLAYING</span>
                                                <div class="label-track-info">
                                                    <span class="label-artist" id="cassette-artist">${this.currentTrack.artist}</span>
                                                    <span class="label-track" id="cassette-track">${this.currentTrack.name}</span>
                                                </div>
                                            </div>
                                            
                                            <div class="label-center">
                                                <div class="side-indicator">A</div>
                                                <div class="reels-container">
                                                    <div class="reel left-reel" id="left-reel">
                                                        <div class="reel-notch n1"></div>
                                                        <div class="reel-notch n2"></div>
                                                        <div class="reel-notch n3"></div>
                                                    </div>
                                                    <div class="tape-window">
                                                        <div class="tape-inner left"></div>
                                                        <div class="tape-inner right"></div>
                                                    </div>
                                                    <div class="reel right-reel" id="right-reel">
                                                        <div class="reel-notch n1"></div>
                                                        <div class="reel-notch n2"></div>
                                                        <div class="reel-notch n3"></div>
                                                    </div>
                                                </div>
                                                <div class="noise-reduction-label">
                                                    <span>NOISE REDUCTION</span>
                                                    <div class="nr-options">
                                                        <span class="nr-on">ON</span>
                                                        <span class="nr-off">OFF</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="label-bottom">
                                                <span class="label-brand">THOG</span>
                                                <span class="label-arrow"></span>
                                                <span class="label-model">OFFICIAL<span class="model-num">OST</span></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="cassette-bottom">
                                    <div class="magnetic-shield">
                                        <div class="shield-holes left">
                                            <div class="shield-hole"></div>
                                            <div class="shield-hole oval"></div>
                                        </div>
                                        <div class="shield-screw">
                                            <div class="screw-slot"></div>
                                        </div>
                                        <div class="shield-holes right">
                                            <div class="shield-hole oval"></div>
                                            <div class="shield-hole"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="cassette-screws">
                                    <div class="screw s1"><div class="screw-slot"></div></div>
                                    <div class="screw s2"><div class="screw-slot"></div></div>
                                    <div class="screw s3"><div class="screw-slot"></div></div>
                                    <div class="screw s4"><div class="screw-slot"></div></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="player-controls">
                            <div class="now-playing-info">
                                <span class="np-label">NOW PLAYING</span>
                                <span class="np-track" id="now-playing-track">${this.currentTrack.name} - ${this.currentTrack.artist}</span>
                            </div>
                            
                            <div class="progress-container" id="progress-container">
                                <div class="progress-bar" id="progress-bar"></div>
                            </div>
                            
                            <div class="time-display">
                                <span class="time-current" id="time-current">0:00</span>
                                <span class="time-total" id="time-total">${this.currentTrack.duration}</span>
                            </div>
                            
                            <div class="control-buttons">
                                <button class="ctrl-btn prev-btn clickable" id="prev-btn" aria-label="Previous Track">
                                    <span class="ctrl-icon"></span>
                                </button>
                                <button class="ctrl-btn play-btn clickable" id="play-btn" aria-label="Play/Pause">
                                    <span class="ctrl-icon play-icon"></span>
                                </button>
                                <button class="ctrl-btn next-btn clickable" id="next-btn" aria-label="Next Track">
                                    <span class="ctrl-icon"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="track-list-area">
                        <div class="track-list-header">
                            <span class="tlh-icon"></span>
                            <span class="tlh-text">TRACKLIST</span>
                            <span class="tlh-count">${this.tracks.length} TRACKS</span>
                        </div>
                        <div class="track-list" id="track-list">
                            ${this.createTrackCards()}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        parentContainer.appendChild(this.container);
        this.bindEvents();
        this.setInitialStates();
        this.initScrollAnimations(parentContainer);
        this.syncWithAudioManager();
        
        return this;
    }

    createFloatingNotes() {
        const notes = ['&#9835;', '&#9833;', '&#9834;', '&#9836;'];
        let html = '';
        for (let i = 0; i < 12; i++) {
            const note = notes[i % notes.length];
            const delay = (i * 0.5).toFixed(1);
            const left = Math.random() * 100;
            const size = 0.8 + Math.random() * 0.8;
            html += `<span class="floating-note" style="--delay: ${delay}s; --left: ${left}%; --size: ${size}">${note}</span>`;
        }
        return html;
    }

    createTrackCards() {
        return this.tracks.map((track, index) => `
            <div class="track-card clickable ${index === 0 ? 'active' : ''}" 
                 data-track-index="${index}" 
                 data-track-id="${track.id}"
                 style="--track-color: ${track.color}">
                <div class="track-number">${String(index + 1).padStart(2, '0')}</div>
                <div class="track-info">
                    <span class="track-name">${track.name}</span>
                    <span class="track-artist">${track.artist}</span>
                </div>
                <div class="track-duration">${track.duration}</div>
                <div class="track-play-indicator">
                    <span class="tpi-icon"></span>
                </div>
                <div class="track-wave-bars">
                    <span class="wave-bar"></span>
                    <span class="wave-bar"></span>
                    <span class="wave-bar"></span>
                    <span class="wave-bar"></span>
                </div>
            </div>
        `).join('');
    }

    setInitialStates() {
        const header = this.container.querySelector('.soundtrack-header');
        const cassette = this.container.querySelector('.cassette-wrapper');
        const controls = this.container.querySelector('.player-controls');
        const trackList = this.container.querySelector('.track-list-area');
        const trackCards = this.container.querySelectorAll('.track-card');
        
        gsap.set(header, { opacity: 0, y: -30 });
        gsap.set(cassette, { opacity: 0, y: -50, scale: 0.9 });
        gsap.set(controls, { opacity: 0, y: 30 });
        gsap.set(trackList, { opacity: 0, x: 50 });
        gsap.set(trackCards, { opacity: 0, x: 30, scale: 0.95 });
    }

    bindEvents() {
        // Track cards - only change music when user clicks
        this.container.querySelectorAll('.track-card').forEach(card => {
            card.addEventListener('click', () => this.selectTrack(card));
        });
        
        // Control buttons
        this.container.querySelector('#play-btn').addEventListener('click', () => this.togglePlay());
        this.container.querySelector('#prev-btn').addEventListener('click', () => this.prevTrack());
        this.container.querySelector('#next-btn').addEventListener('click', () => this.nextTrack());
        
        // Progress bar
        this.container.querySelector('#progress-container').addEventListener('click', (e) => this.seekTo(e));
    }

    initScrollAnimations(scrollContainer) {
        const section = this.container;
        const header = this.container.querySelector('.soundtrack-header');
        const cassette = this.container.querySelector('.cassette-wrapper');
        const controls = this.container.querySelector('.player-controls');
        const trackList = this.container.querySelector('.track-list-area');
        const trackCards = this.container.querySelectorAll('.track-card');
        
        const trigger = ScrollTrigger.create({
            trigger: section,
            scroller: scrollContainer,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                const tl = gsap.timeline();
                this.timelines.push(tl);
                
                tl.to(header, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                });
                
                tl.to(cassette, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: 'elastic.out(1, 0.5)'
                }, '-=0.5');
                
                tl.to(controls, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }, '-=0.7');
                
                tl.to(trackList, {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }, '-=0.5');
                
                tl.to(trackCards, {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'back.out(1.2)'
                }, '-=0.3');
            }
        });
        this.scrollTriggers.push(trigger);
    }

    /**
     * Sync UI with current AudioManager state
     * This reflects what's currently playing without changing it
     */
    syncWithAudioManager() {
        if (!this.audioManager) return;
        
        // Check if music is currently playing
        if (this.audioManager.currentMusic && !this.audioManager.currentMusic.paused) {
            this.isPlaying = true;
            this.updatePlayButtonState(true);
            this.startReelAnimation();
            
            const leftReel = this.container.querySelector('#left-reel');
            const rightReel = this.container.querySelector('#right-reel');
            if (leftReel) leftReel.classList.add('spinning');
            if (rightReel) rightReel.classList.add('spinning');
        }
    }

    /**
     * Select and play a track - ONLY called by user interaction
     */
    selectTrack(cardElement) {
        const index = parseInt(cardElement.dataset.trackIndex);
        const track = this.tracks[index];
        
        if (!track) return;
        
        // Play SFX
        if (this.sfxManager) {
            this.sfxManager.playCheck1();
        }
        
        // Update active state
        this.container.querySelectorAll('.track-card').forEach(c => c.classList.remove('active'));
        cardElement.classList.add('active');
        
        // Squish animation on card
        if (this.coreAnimation) {
            this.coreAnimation.squish(cardElement, { intensity: 0.5, duration: 0.4 });
        }
        
        // Update cassette display
        this.updateCassetteDisplay(track);
        
        // Update now playing info
        this.container.querySelector('#now-playing-track').textContent = `${track.name} - ${track.artist}`;
        this.container.querySelector('#time-total').textContent = track.duration;
        
        // Update state
        this.currentTrack = track;
        this.currentTrackIndex = index;
        this.progress = 0;
        this.container.querySelector('#progress-bar').style.width = '0%';
        this.container.querySelector('#time-current').textContent = '0:00';
        
        // Change music via AudioManager - this is user-initiated
        this.changeMusic(track);
        
        // Start playing automatically
        if (!this.isPlaying) {
            // Small delay to ensure music is loaded
            setTimeout(() => {
                this.isPlaying = true;
                this.updatePlayButtonState(true);
                this.startProgress();
                this.startReelAnimation();
                
                const leftReel = this.container.querySelector('#left-reel');
                const rightReel = this.container.querySelector('#right-reel');
                if (leftReel) leftReel.classList.add('spinning');
                if (rightReel) rightReel.classList.add('spinning');
                
                this.animateWaveBars();
            }, 100);
        }
    }

    updateCassetteDisplay(track) {
        const cassette = this.container.querySelector('#soundtrack-cassette');
        
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
        tl.to(cassette, {
            y: -20,
            rotateX: -5,
            duration: 0.2,
            ease: 'power2.out'
        })
        .add(() => {
            this.container.querySelector('#cassette-artist').textContent = track.artist;
            this.container.querySelector('#cassette-track').textContent = track.name;
        })
        .to(cassette, {
            y: 0,
            rotateX: 0,
            duration: 0.4,
            ease: 'bounce.out'
        });
    }

    /**
     * Change music using global AudioManager
     */
    changeMusic(track) {
        if (!this.audioManager) {
            console.warn('AudioManager not available');
            return;
        }
        
        console.log('Changing music to:', track.name, track.file);
        
        // Always play the new track
        this.audioManager.playMusic(track.file, true);
    }

    togglePlay() {
        // If no track selected, don't do anything
        if (!this.currentTrack) {
            console.warn('No track selected');
            return;
        }
        
        this.isPlaying = !this.isPlaying;
        
        const playBtn = this.container.querySelector('#play-btn');
        const leftReel = this.container.querySelector('#left-reel');
        const rightReel = this.container.querySelector('#right-reel');
        
        // Play SFX
        if (this.sfxManager) {
            this.sfxManager.playCheck1();
        }
        
        // Squish animation
        if (this.coreAnimation) {
            this.coreAnimation.squish(playBtn, { intensity: 0.7, duration: 0.3 });
        }
        
        if (this.isPlaying) {
            this.updatePlayButtonState(true);
            if (leftReel) leftReel.classList.add('spinning');
            if (rightReel) rightReel.classList.add('spinning');
            
            // Start progress simulation
            this.startProgress();
            
            // Resume or start music via AudioManager
            if (this.audioManager) {
                if (this.audioManager.currentMusic && this.audioManager.currentMusic.paused) {
                    this.audioManager.resumeMusic();
                } else if (this.currentTrack) {
                    this.audioManager.playMusic(this.currentTrack.file, true);
                }
            }
            
            this.startReelAnimation();
        } else {
            this.updatePlayButtonState(false);
            if (leftReel) leftReel.classList.remove('spinning');
            if (rightReel) rightReel.classList.remove('spinning');
            
            this.stopProgress();
            
            // Pause via AudioManager
            if (this.audioManager) {
                this.audioManager.pauseMusic();
            }
            
            this.stopReelAnimation();
        }
        
        // Animate wave bars on active track
        this.animateWaveBars();
    }

    updatePlayButtonState(isPlaying) {
        const playBtn = this.container.querySelector('#play-btn');
        if (playBtn) {
            if (isPlaying) {
                playBtn.classList.add('playing');
            } else {
                playBtn.classList.remove('playing');
            }
        }
    }

    startProgress() {
        // Clear any existing interval
        this.stopProgress();
        
        this.progressInterval = setInterval(() => {
            if (this.progress < 100) {
                this.progress += 0.2;
                const progressBar = this.container.querySelector('#progress-bar');
                if (progressBar) {
                    progressBar.style.width = `${this.progress}%`;
                }
                this.updateTimeDisplay();
            } else {
                // Track ended - just stop, don't auto-advance
                this.onTrackEnd();
            }
        }, 100);
    }

    stopProgress() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    /**
     * When track ends, stop playing - don't auto-advance
     */
    onTrackEnd() {
        this.stopProgress();
        this.progress = 0;
        const progressBar = this.container.querySelector('#progress-bar');
        const timeCurrent = this.container.querySelector('#time-current');
        
        if (progressBar) progressBar.style.width = '0%';
        if (timeCurrent) timeCurrent.textContent = '0:00';
        
        // Stop playing state but don't change track
        if (this.isPlaying) {
            this.isPlaying = false;
            this.updatePlayButtonState(false);
            this.stopReelAnimation();
            
            const leftReel = this.container.querySelector('#left-reel');
            const rightReel = this.container.querySelector('#right-reel');
            if (leftReel) leftReel.classList.remove('spinning');
            if (rightReel) rightReel.classList.remove('spinning');
            
            this.animateWaveBars();
        }
    }

    updateTimeDisplay() {
        if (!this.currentTrack) return;
        
        const totalSeconds = this.currentTrack.durationSeconds;
        const currentSeconds = Math.floor((this.progress / 100) * totalSeconds);
        const currentMins = Math.floor(currentSeconds / 60);
        const currentSecs = currentSeconds % 60;
        
        const timeCurrent = this.container.querySelector('#time-current');
        if (timeCurrent) {
            timeCurrent.textContent = `${currentMins}:${String(currentSecs).padStart(2, '0')}`;
        }
    }

    seekTo(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        this.progress = (clickX / rect.width) * 100;
        
        const progressBar = this.container.querySelector('#progress-bar');
        if (progressBar) {
            progressBar.style.width = `${this.progress}%`;
        }
        
        this.updateTimeDisplay();
        
        if (this.sfxManager) {
            this.sfxManager.playCheck1();
        }
    }

    /**
     * Previous track - user-initiated
     */
    prevTrack() {
        if (this.sfxManager) {
            this.sfxManager.playCheck1();
        }
        
        if (this.currentTrackIndex <= 0) {
            this.currentTrackIndex = this.tracks.length - 1;
        } else {
            this.currentTrackIndex--;
        }
        
        const card = this.container.querySelectorAll('.track-card')[this.currentTrackIndex];
        this.selectTrack(card);
        
        if (this.coreAnimation) {
            const prevBtn = this.container.querySelector('#prev-btn');
            if (prevBtn) {
                this.coreAnimation.squish(prevBtn, { intensity: 0.6, duration: 0.3 });
            }
        }
    }

    /**
     * Next track - user-initiated
     */
    nextTrack() {
        if (this.sfxManager) {
            this.sfxManager.playCheck1();
        }
        
        if (this.currentTrackIndex >= this.tracks.length - 1) {
            this.currentTrackIndex = 0;
        } else {
            this.currentTrackIndex++;
        }
        
        const card = this.container.querySelectorAll('.track-card')[this.currentTrackIndex];
        this.selectTrack(card);
        
        if (this.coreAnimation) {
            const nextBtn = this.container.querySelector('#next-btn');
            if (nextBtn) {
                this.coreAnimation.squish(nextBtn, { intensity: 0.6, duration: 0.3 });
            }
        }
    }

    startReelAnimation() {
        const leftReel = this.container.querySelector('#left-reel');
        const rightReel = this.container.querySelector('#right-reel');
        
        if (!leftReel || !rightReel) return;
        
        if (this.reelTimeline) {
            this.reelTimeline.kill();
        }
        
        this.reelTimeline = gsap.timeline({ repeat: -1 });
        this.reelTimeline.to([leftReel, rightReel], {
            rotation: '+=360',
            duration: 2,
            ease: 'linear'
        });
    }

    stopReelAnimation() {
        if (this.reelTimeline) {
            this.reelTimeline.kill();
            this.reelTimeline = null;
        }
    }

    animateWaveBars() {
        const activeCard = this.container.querySelector('.track-card.active');
        if (!activeCard) return;
        
        const bars = activeCard.querySelectorAll('.wave-bar');
        
        if (this.isPlaying) {
            bars.forEach((bar, i) => {
                gsap.to(bar, {
                    scaleY: gsap.utils.random(0.3, 1),
                    duration: 0.15,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                    delay: i * 0.05
                });
            });
        } else {
            gsap.killTweensOf(bars);
            gsap.to(bars, { scaleY: 0.3, duration: 0.3 });
        }
    }

    destroy() {
        this.stopProgress();
        this.stopReelAnimation();
        
        this.scrollTriggers.forEach(st => st.kill());
        this.timelines.forEach(tl => tl?.kill?.());
        
        if (this.container?.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const soundtrackSection = new SoundtrackSection();
export default soundtrackSection;