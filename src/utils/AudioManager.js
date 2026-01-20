/**
 * AudioManager - Sistema de audio para musica y efectos de sonido
 */

class AudioManager {
    constructor() {
        this.musicEnabled = false;
        this.sfxEnabled = false;
        this.currentMusic = null;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.loadSettings();
    }

    loadSettings() {
        try {
            const musicSetting = localStorage.getItem('musicEnabled');
            const sfxSetting = localStorage.getItem('sfxEnabled');
            this.musicEnabled = musicSetting === 'true';
            this.sfxEnabled = sfxSetting === 'true';
        } catch (e) {
            console.warn('Could not load audio settings:', e);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('musicEnabled', this.musicEnabled.toString());
            localStorage.setItem('sfxEnabled', this.sfxEnabled.toString());
        } catch (e) {
            console.warn('Could not save audio settings:', e);
        }
    }

    enableMusic(enabled) {
        this.musicEnabled = enabled;
        this.saveSettings();
        
        if (!enabled && this.currentMusic) {
            this.currentMusic.pause();
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

    async playMusic(src, loop = true) {
        if (!this.musicEnabled) return;

        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic = null;
        }

        this.currentMusic = new Audio(src);
        this.currentMusic.loop = loop;
        this.currentMusic.volume = this.musicVolume;

        try {
            await this.currentMusic.play();
        } catch (e) {
            console.warn('Music autoplay blocked:', e);
        }
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
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume;
        }
    }

    playSfx(src) {
        if (!this.sfxEnabled) return;

        const sfx = new Audio(src);
        sfx.volume = this.sfxVolume;
        sfx.play().catch(() => {});
    }

    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
}

export const audioManager = new AudioManager();
export default audioManager;
