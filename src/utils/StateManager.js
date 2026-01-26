/**
 * StateManager - Application State Management
 * The Heart of Gold
 */

export const AppStates = {
    INIT: 'init',
    SPLASH: 'splash',
    TRANSITION_TO_LOADING: 'transition_to_loading',
    LOADING: 'loading',
    TRANSITION_TO_HOME: 'transition_to_home',
    HOME: 'home'
};

class StateManager {
    constructor() {
        this.currentState = AppStates.INIT;
        this.previousState = null;
        this.listeners = new Map();
        this.config = this.loadConfig();
        this.assetsLoaded = false;
    }

    loadConfig() {
        const defaultConfig = { soundEnabled: true, language: 'en', firstVisit: true, acceptedCookies: false };
        try {
            const saved = localStorage.getItem('gameConfig');
            return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
        } catch { return defaultConfig; }
    }

    saveConfig() {
        try { localStorage.setItem('gameConfig', JSON.stringify(this.config)); } catch {}
    }

    updateConfig(key, value) { this.config[key] = value; this.saveConfig(); this.emit('configChange', { key, value }); }
    getConfig(key) { return this.config[key]; }

    setState(newState) {
        if (this.currentState === newState) return;
        this.previousState = this.currentState;
        this.currentState = newState;
        this.emit('stateChange', { current: this.currentState, previous: this.previousState });
    }

    getState() { return this.currentState; }
    on(event, callback) { if (!this.listeners.has(event)) this.listeners.set(event, []); this.listeners.get(event).push(callback); }
    off(event, callback) { if (!this.listeners.has(event)) return; const cbs = this.listeners.get(event); const idx = cbs.indexOf(callback); if (idx > -1) cbs.splice(idx, 1); }
    emit(event, data) { if (!this.listeners.has(event)) return; this.listeners.get(event).forEach(cb => cb(data)); }
    setAssetsLoaded(loaded) { this.assetsLoaded = loaded; this.emit('assetsLoaded', loaded); }
    areAssetsLoaded() { return this.assetsLoaded; }
}

export const stateManager = new StateManager();
export default stateManager;
