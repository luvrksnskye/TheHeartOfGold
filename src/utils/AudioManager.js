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
        try { this.musicEnabled = localStorage.getItem('musicEnabled') === 'true'; this.sfxEnabled = localStorage.getItem('sfxEnabled') === 'true'; } catch {}
    }

    saveSettings() {
        try { localStorage.setItem('musicEnabled', this.musicEnabled.toString()); localStorage.setItem('sfxEnabled', this.sfxEnabled.toString()); } catch {}
    }

    enableMusic(enabled) { this.musicEnabled = enabled; this.saveSettings(); if (!enabled && this.currentMusic) this.fadeOut(this.currentMusic, 500); }
    enableSfx(enabled) { this.sfxEnabled = enabled; this.saveSettings(); }
    isMusicEnabled() { return this.musicEnabled; }
    isSfxEnabled() { return this.sfxEnabled; }

    async playMusic(src, loop = true) {
        if (!this.musicEnabled) return;
        if (this.currentMusic) { await this.fadeOut(this.currentMusic, 300); this.currentMusic = null; }
        this.currentMusic = new Audio(src);
        this.currentMusic.loop = loop;
        this.currentMusic.volume = 0;
        try { await this.currentMusic.play(); this.fadeIn(this.currentMusic, this.musicVolume, 500); } catch {}
    }

    fadeIn(audio, targetVolume, duration) {
        const start = performance.now();
        const startVol = audio.volume;
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            audio.volume = startVol + (targetVolume - startVol) * p;
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    fadeOut(audio, duration) {
        return new Promise(resolve => {
            const start = performance.now();
            const startVol = audio.volume;
            const tick = (now) => {
                const p = Math.min((now - start) / duration, 1);
                audio.volume = startVol * (1 - p);
                if (p < 1) requestAnimationFrame(tick);
                else { audio.pause(); resolve(); }
            };
            requestAnimationFrame(tick);
        });
    }

    stopMusic() { if (this.currentMusic) { this.currentMusic.pause(); this.currentMusic.currentTime = 0; } }
    pauseMusic() { if (this.currentMusic) this.currentMusic.pause(); }
    resumeMusic() { if (this.currentMusic && this.musicEnabled) this.currentMusic.play().catch(() => {}); }
    setMusicVolume(v) { this.musicVolume = Math.max(0, Math.min(1, v)); if (this.currentMusic) this.currentMusic.volume = this.musicVolume; }

    playSfx(src) {
        if (!this.sfxEnabled) return;
        let sfx = this.sfxPool.get(src);
        if (!sfx || !sfx.paused) { sfx = new Audio(src); this.sfxPool.set(src, sfx); }
        sfx.currentTime = 0;
        sfx.volume = this.sfxVolume;
        sfx.play().catch(() => {});
    }
    setSfxVolume(v) { this.sfxVolume = Math.max(0, Math.min(1, v)); }
    destroy() { this.stopMusic(); this.sfxPool.clear(); }
}

export const audioManager = new AudioManager();
export default audioManager;
