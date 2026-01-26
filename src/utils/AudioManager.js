/**
 * AudioManager - Music and Audio Management
 * The Heart of Gold
 * Updated: Volume control integration
 */

class AudioManager {
    constructor() {
        this.musicEnabled = false;
        this.sfxEnabled = false;
        this.currentMusic = null;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.sfxPool = new Map();
        this.loadSettings();
    }

    loadSettings() {
        try {
            const savedMusicEnabled = localStorage.getItem('musicEnabled');
            const savedSfxEnabled = localStorage.getItem('sfxEnabled');
            const savedMusicVolume = localStorage.getItem('musicVolume');
            
            if (savedMusicEnabled !== null) {
                this.musicEnabled = savedMusicEnabled === 'true';
            }
            if (savedSfxEnabled !== null) {
                this.sfxEnabled = savedSfxEnabled === 'true';
            }
            if (savedMusicVolume !== null) {
                this.musicVolume = parseFloat(savedMusicVolume);
            }
        } catch (e) {
            // Use defaults
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('musicEnabled', this.musicEnabled.toString());
            localStorage.setItem('sfxEnabled', this.sfxEnabled.toString());
            localStorage.setItem('musicVolume', this.musicVolume.toString());
        } catch (e) {
            // Silently fail
        }
    }

    enableMusic(enabled) {
        this.musicEnabled = enabled;
        this.saveSettings();
        if (!enabled && this.currentMusic) {
            this.fadeOut(this.currentMusic, 500);
        }
    }

    enableSfx(enabled) {
        this.sfxEnabled = enabled;
        this.saveSettings();
    }

    isMusicEnabled() {
        return this.musicEnabled;
    }

    isSfxEnabled() {
        return this.sfxEnabled;
    }

    getMusicVolume() {
        return this.musicVolume;
    }

    async playMusic(src, loop = true) {
        if (!this.musicEnabled) return;
        
        if (this.currentMusic) {
            await this.fadeOut(this.currentMusic, 300);
            this.currentMusic = null;
        }
        
        this.currentMusic = new Audio(src);
        this.currentMusic.loop = loop;
        this.currentMusic.volume = 0;
        
        try {
            await this.currentMusic.play();
            this.fadeIn(this.currentMusic, this.musicVolume, 500);
        } catch (e) {
            // User hasn't interacted yet
        }
    }

    fadeIn(audio, targetVolume, duration) {
        const start = performance.now();
        const startVol = audio.volume;
        
        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            audio.volume = startVol + (targetVolume - startVol) * progress;
            
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };
        
        requestAnimationFrame(tick);
    }

    fadeOut(audio, duration) {
        return new Promise(resolve => {
            const start = performance.now();
            const startVol = audio.volume;
            
            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                audio.volume = startVol * (1 - progress);
                
                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    audio.pause();
                    resolve();
                }
            };
            
            requestAnimationFrame(tick);
        });
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
    }

    pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

    resumeMusic() {
        if (this.currentMusic && this.musicEnabled) {
            this.currentMusic.play().catch(() => {});
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
        
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume;
        }
    }

    playSfx(src) {
        if (!this.sfxEnabled) return;
        
        let sfx = this.sfxPool.get(src);
        if (!sfx || !sfx.paused) {
            sfx = new Audio(src);
            this.sfxPool.set(src, sfx);
        }
        
        sfx.currentTime = 0;
        sfx.volume = this.sfxVolume;
        sfx.play().catch(() => {});
    }

    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    destroy() {
        this.stopMusic();
        this.sfxPool.clear();
    }
}

export const audioManager = new AudioManager();
export default audioManager;
