/**
 * SettingsMenu - Settings Panel using sprite assets
 * The Heart of Gold
 * Panel centrado con assets extraidos del spritesheet
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import audioManager from '../utils/AudioManager.js';
import sfxManager from '../utils/SFXManager.js';

class SettingsMenu {
    constructor() {
        this.container = null;
        this.isOpen = false;
        this.isDragging = false;
        this.currentSlider = null;
        this.timelines = [];
    }

    create() {
        this.container = document.createElement('div');
        this.container.id = 'settings-menu';
        this.container.className = 'settings-menu';
        
        const musicVol = Math.round(audioManager.getMusicVolume() * 100);
        const sfxVol = Math.round(sfxManager.getVolume() * 100);
        
        this.container.innerHTML = `
            <div class="settings-overlay"></div>
            <div class="settings-panel-wrapper">
                <!-- Main panel using extracted sprite -->
                <div class="settings-panel">
                    <img src="./src/assets/settings-panel.png" alt="" class="panel-bg-img">
                    
                    <!-- Close button -->
                    <button class="settings-close clickable" aria-label="Close">
                        <img src="./src/assets/close-btn.png" alt="X" class="close-img">
                    </button>
                    
                    <!-- Content inside panel -->
                    <div class="settings-content">
                        <h2 class="settings-title">SETTINGS</h2>
                        
                        <!-- Music Volume Slider -->
                        <div class="settings-slider-group" data-type="music">
                            <label class="slider-label">MUSIC</label>
                            <div class="slider-row">
                                <button class="vol-btn vol-max clickable" data-action="max">
                                    <img src="./src/assets/musicon.png" alt="" class="vol-icon">
                                </button>
                                <div class="slider-container">
                                    <img src="./src/assets/slider-track.png" alt="" class="slider-track-img">
                                    <div class="slider-fill" style="width: ${musicVol}%"></div>
                                    <div class="slider-handle" style="left: ${musicVol}%">
                                        <img src="./src/assets/indicador.png" alt="" class="handle-img">
                                    </div>
                                </div>
                                <button class="vol-btn vol-mute clickable" data-action="mute">
                                    <img src="./src/assets/musicoff.png" alt="" class="vol-icon">
                                </button>
                            </div>
                        </div>
                        
                        <!-- SFX Volume Slider -->
                        <div class="settings-slider-group" data-type="sfx">
                            <label class="slider-label">SFX / VOICE</label>
                            <div class="slider-row">
                                <button class="vol-btn vol-max clickable" data-action="max">
                                    <img src="./src/assets/soundon.png" alt="" class="vol-icon">
                                </button>
                                <div class="slider-container">
                                    <img src="./src/assets/slider-track.png" alt="" class="slider-track-img">
                                    <div class="slider-fill" style="width: ${sfxVol}%"></div>
                                    <div class="slider-handle" style="left: ${sfxVol}%">
                                        <img src="./src/assets/indicador.png" alt="" class="handle-img">
                                    </div>
                                </div>
                                <button class="vol-btn vol-mute clickable" data-action="mute">
                                    <img src="./src/assets/soundoff.png" alt="" class="vol-icon">
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Decorative lines below panel -->
                <div class="settings-deco-lines">
                    <img src="./src/assets/deco-line-1.png" alt="" class="deco-line line-1">
                    <img src="./src/assets/deco-line-2.png" alt="" class="deco-line line-2">
                </div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        this.setInitialState();
        this.bindEvents();
        
        return this;
    }

    setInitialState() {
        gsap.set(this.container, { opacity: 0, visibility: 'hidden' });
        gsap.set('.settings-panel-wrapper', { scale: 0.8, y: 30 });
        gsap.set('.settings-deco-lines .deco-line', { scaleX: 0, opacity: 0 });
    }

    bindEvents() {
        // Close button
        const closeBtn = this.container.querySelector('.settings-close');
        closeBtn.addEventListener('click', () => {
            sfxManager.playCancel();
            this.close();
        });
        
        // Overlay click to close
        const overlay = this.container.querySelector('.settings-overlay');
        overlay.addEventListener('click', () => {
            sfxManager.playCancel();
            this.close();
        });
        
        // Volume buttons
        this.container.querySelectorAll('.vol-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const group = btn.closest('.settings-slider-group');
                const type = group.dataset.type;
                const action = btn.dataset.action;
                
                sfxManager.playCheck1();
                
                if (action === 'max') {
                    this.setVolume(type, 1);
                } else {
                    this.setVolume(type, 0);
                }
            });
        });
        
        // Slider interactions
        this.container.querySelectorAll('.slider-container').forEach(container => {
            const group = container.closest('.settings-slider-group');
            const handle = container.querySelector('.slider-handle');
            
            // Click on track
            container.addEventListener('click', (e) => {
                if (e.target === handle || handle.contains(e.target)) return;
                const rect = container.getBoundingClientRect();
                const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                sfxManager.playCheck2();
                this.setVolume(group.dataset.type, percent);
            });
            
            // Drag handle
            handle.addEventListener('mousedown', (e) => this.startDrag(e, group));
            handle.addEventListener('touchstart', (e) => this.startDrag(e, group), { passive: false });
        });
        
        // Global drag events
        document.addEventListener('mousemove', (e) => this.onDrag(e));
        document.addEventListener('touchmove', (e) => this.onDrag(e), { passive: false });
        document.addEventListener('mouseup', () => this.endDrag());
        document.addEventListener('touchend', () => this.endDrag());
        
        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                sfxManager.playCancel();
                this.close();
            }
        });
    }

    startDrag(e, group) {
        e.preventDefault();
        this.isDragging = true;
        this.currentSlider = group;
        
        const handle = group.querySelector('.slider-handle');
        gsap.to(handle, { scale: 1.2, duration: 0.15, ease: 'back.out(2)' });
    }

    onDrag(e) {
        if (!this.isDragging || !this.currentSlider) return;
        
        e.preventDefault();
        const container = this.currentSlider.querySelector('.slider-container');
        const rect = container.getBoundingClientRect();
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        
        this.setVolume(this.currentSlider.dataset.type, percent, false);
    }

    endDrag() {
        if (!this.isDragging) return;
        
        if (this.currentSlider) {
            const handle = this.currentSlider.querySelector('.slider-handle');
            gsap.to(handle, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
        }
        
        this.isDragging = false;
        this.currentSlider = null;
    }

    setVolume(type, value, playSound = true) {
        const group = this.container.querySelector(`.settings-slider-group[data-type="${type}"]`);
        const fill = group.querySelector('.slider-fill');
        const handle = group.querySelector('.slider-handle');
        const percent = value * 100;
        
        gsap.to(fill, { width: `${percent}%`, duration: 0.2, ease: 'power2.out' });
        gsap.to(handle, { left: `${percent}%`, duration: 0.2, ease: 'power2.out' });
        
        if (type === 'music') {
            audioManager.setMusicVolume(value);
        } else {
            sfxManager.setVolume(value);
        }
    }

    open() {
        if (this.isOpen) return;
        this.isOpen = true;
        
        const panel = this.container.querySelector('.settings-panel-wrapper');
        const lines = this.container.querySelectorAll('.settings-deco-lines .deco-line');
        
        const tl = gsap.timeline();
        this.timelines.push(tl);
        
        // Show container
        tl.set(this.container, { visibility: 'visible' })
          .to(this.container, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        
        // Panel entrance with squishy animation
        tl.to(panel, {
            scale: 1.1,
            y: 0,
            duration: 0.25,
            ease: 'power2.out'
        }, '-=0.1')
        .to(panel, {
            scale: 0.95,
            duration: 0.15,
            ease: 'power2.in'
        })
        .to(panel, {
            scale: 1,
            duration: 0.3,
            ease: 'elastic.out(1, 0.5)'
        });
        
        // Decorative lines slide in
        tl.to(lines, {
            scaleX: 1,
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        }, '-=0.3');
        
        // Animate title letters
        this.animateTitle();
    }

    animateTitle() {
        const title = this.container.querySelector('.settings-title');
        const text = title.textContent;
        
        title.innerHTML = text.split('').map(char => 
            `<span class="title-letter">${char}</span>`
        ).join('');
        
        gsap.fromTo(title.querySelectorAll('.title-letter'),
            { opacity: 0, y: -20, rotateX: -90 },
            { 
                opacity: 1, 
                y: 0, 
                rotateX: 0, 
                duration: 0.4, 
                stagger: 0.04, 
                ease: 'back.out(1.7)',
                delay: 0.2
            }
        );
    }

    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        
        const panel = this.container.querySelector('.settings-panel-wrapper');
        const lines = this.container.querySelectorAll('.settings-deco-lines .deco-line');
        
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(this.container, { visibility: 'hidden' });
            }
        });
        
        // Lines retract
        tl.to(lines, {
            scaleX: 0,
            opacity: 0,
            duration: 0.2,
            stagger: 0.05,
            ease: 'power2.in'
        });
        
        // Panel exit with squish
        tl.to(panel, {
            scale: 1.05,
            duration: 0.1,
            ease: 'power2.out'
        }, '-=0.1')
        .to(panel, {
            scale: 0.8,
            y: 30,
            duration: 0.25,
            ease: 'power2.in'
        });
        
        // Fade out
        tl.to(this.container, {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in'
        }, '-=0.15');
    }

    destroy() {
        this.timelines.forEach(tl => tl && tl.kill && tl.kill());
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

export const settingsMenu = new SettingsMenu();
export default settingsMenu;
