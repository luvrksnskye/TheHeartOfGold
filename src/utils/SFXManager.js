/**
 * SFXManager - Sound Effects Manager for UI
 * The Heart of Gold
 * Handles all UI sound effects with optimized pooling
 */

class SFXManager {
    constructor() {
        this.enabled = true;
        this.volume = 0.5;
        this.sfxPool = new Map();
        this.preloadedSounds = new Map();
        
        // Sound effect paths
        this.sounds = {
            confirm: './src/sfx/confirm-sound.wav',
            cancel: './src/sfx/cancel-sound.wav',
            ghost: './src/sfx/ghost-sound.wav',
            check1: './src/sfx/Check-1.wav',
            check2: './src/sfx/Check-2.wav'
        };
        
        this.loadSettings();
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const savedEnabled = localStorage.getItem('sfxEnabled');
            const savedVolume = localStorage.getItem('sfxVolume');
            
            if (savedEnabled !== null) {
                this.enabled = savedEnabled === 'true';
            }
            if (savedVolume !== null) {
                this.volume = parseFloat(savedVolume);
            }
        } catch (e) {
            // Use defaults
        }
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem('sfxEnabled', this.enabled.toString());
            localStorage.setItem('sfxVolume', this.volume.toString());
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Preload all sound effects for instant playback
     */
    async preload() {
        const loadPromises = Object.entries(this.sounds).map(async ([key, src]) => {
            try {
                const audio = new Audio();
                audio.preload = 'auto';
                
                return new Promise((resolve) => {
                    audio.addEventListener('canplaythrough', () => {
                        this.preloadedSounds.set(key, src);
                        resolve(true);
                    }, { once: true });
                    
                    audio.addEventListener('error', () => {
                        console.warn(`Failed to preload: ${src}`);
                        resolve(false);
                    }, { once: true });
                    
                    audio.src = src;
                });
            } catch (e) {
                return false;
            }
        });
        
        await Promise.all(loadPromises);
        return true;
    }

    /**
     * Set enabled state
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        this.saveSettings();
    }

    /**
     * Check if enabled
     */
    isEnabled() {
        return this.enabled;
    }

    /**
     * Set volume (0-1)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }

    /**
     * Get current volume
     */
    getVolume() {
        return this.volume;
    }

    /**
     * Get or create audio instance from pool
     */
    getFromPool(key) {
        const src = this.sounds[key];
        if (!src) return null;
        
        let poolArray = this.sfxPool.get(key);
        if (!poolArray) {
            poolArray = [];
            this.sfxPool.set(key, poolArray);
        }
        
        // Find available audio instance
        for (const audio of poolArray) {
            if (audio.paused || audio.ended) {
                return audio;
            }
        }
        
        // Create new instance if pool is not too large
        if (poolArray.length < 5) {
            const audio = new Audio(src);
            poolArray.push(audio);
            return audio;
        }
        
        // Return first one and reset it
        return poolArray[0];
    }

    /**
     * Play a sound effect by key
     */
    play(key) {
        if (!this.enabled || this.volume === 0) return;
        
        const audio = this.getFromPool(key);
        if (!audio) {
            console.warn(`SFX not found: ${key}`);
            return;
        }
        
        audio.currentTime = 0;
        audio.volume = this.volume;
        audio.play().catch(() => {
            // Silently fail - user hasn't interacted yet
        });
    }

    /**
     * Play confirm sound (for positive actions)
     */
    playConfirm() {
        this.play('confirm');
    }

    /**
     * Play cancel sound (for negative/close actions)
     */
    playCancel() {
        this.play('cancel');
    }

    /**
     * Play ghost sound (for hover/special effects)
     */
    playGhost() {
        this.play('ghost');
    }

    /**
     * Play check sound variant 1 (for toggles/selections)
     */
    playCheck1() {
        this.play('check1');
    }

    /**
     * Play check sound variant 2 (for alternate toggles)
     */
    playCheck2() {
        this.play('check2');
    }

    /**
     * Play random check sound
     */
    playCheckRandom() {
        Math.random() > 0.5 ? this.playCheck1() : this.playCheck2();
    }

    /**
     * Cleanup all audio instances
     */
    destroy() {
        this.sfxPool.forEach((poolArray) => {
            poolArray.forEach((audio) => {
                audio.pause();
                audio.src = '';
            });
        });
        this.sfxPool.clear();
        this.preloadedSounds.clear();
    }
}

export const sfxManager = new SFXManager();
export default sfxManager;
