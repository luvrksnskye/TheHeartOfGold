/**
 * StateManager - Application State Management
 * The Heart of Gold
 * Optimized: Better state transitions, event cleanup, transition locking
 */

export const AppStates = {
    INIT: 'init',
    SPLASH: 'splash',
    TRANSITION_TO_LOADING: 'transition_to_loading',
    LOADING: 'loading',
    TRANSITION_TO_HOME: 'transition_to_home',
    HOME: 'home',
    TRANSITION_TO_BLOG_LOADING: 'transition_to_blog_loading',
    BLOG_LOADING: 'blog_loading',
    TRANSITION_TO_BLOG: 'transition_to_blog',
    BLOG: 'blog',
    TRANSITION_FROM_BLOG: 'transition_from_blog'
};

// States that are "transitioning" - block other transitions
const TRANSITION_STATES = [
    AppStates.TRANSITION_TO_LOADING,
    AppStates.TRANSITION_TO_HOME,
    AppStates.TRANSITION_TO_BLOG_LOADING,
    AppStates.TRANSITION_TO_BLOG,
    AppStates.TRANSITION_FROM_BLOG
];

class StateManager {
    constructor() {
        this.currentState = AppStates.INIT;
        this.previousState = null;
        this.listeners = new Map();
        this.config = this.loadConfig();
        this.assetsLoaded = false;
        this.currentBlogId = null;
        this.navigationHistory = [];
        this.transitionQueue = [];
        this.isProcessingTransition = false;
    }

    loadConfig() {
        const defaultConfig = { 
            soundEnabled: true, 
            musicEnabled: true,
            language: 'en', 
            firstVisit: true, 
            acceptedCookies: false 
        };
        try {
            const saved = localStorage.getItem('thog_config');
            return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
        } catch { 
            return defaultConfig; 
        }
    }

    saveConfig() {
        try { 
            localStorage.setItem('thog_config', JSON.stringify(this.config)); 
        } catch (e) {
            console.warn('Failed to save config:', e);
        }
    }

    updateConfig(key, value) { 
        this.config[key] = value; 
        this.saveConfig(); 
        this.emit('configChange', { key, value }); 
    }
    
    getConfig(key) { 
        return this.config[key]; 
    }

    isTransitioning() {
        return TRANSITION_STATES.includes(this.currentState);
    }

    canTransitionTo(newState) {
        // Prevent duplicate state changes
        if (this.currentState === newState) return false;
        
        // Allow all transitions during init
        if (this.currentState === AppStates.INIT) return true;
        
        // Block if already in a transition (unless it's the expected next state)
        if (this.isTransitioning() && !this.isExpectedTransition(newState)) {
            console.warn(`Blocked transition to ${newState} during ${this.currentState}`);
            return false;
        }
        
        return true;
    }

    isExpectedTransition(newState) {
        const expectedTransitions = {
            [AppStates.TRANSITION_TO_LOADING]: [AppStates.LOADING],
            [AppStates.TRANSITION_TO_HOME]: [AppStates.HOME],
            [AppStates.TRANSITION_TO_BLOG_LOADING]: [AppStates.BLOG_LOADING],
            [AppStates.TRANSITION_TO_BLOG]: [AppStates.BLOG],
            [AppStates.TRANSITION_FROM_BLOG]: [AppStates.HOME]
        };
        
        const expected = expectedTransitions[this.currentState];
        return expected && expected.includes(newState);
    }

    setState(newState, data = {}) {
        if (!this.canTransitionTo(newState)) {
            return false;
        }

        this.navigationHistory.push({ 
            from: this.currentState, 
            to: newState, 
            timestamp: Date.now(), 
            data 
        });
        
        this.previousState = this.currentState;
        this.currentState = newState;
        
        // Emit state change event
        this.emit('stateChange', { 
            current: this.currentState, 
            previous: this.previousState, 
            data 
        });
        
        return true;
    }

    getState() { 
        return this.currentState; 
    }
    
    getPreviousState() { 
        return this.previousState; 
    }
    
    setCurrentBlogId(id) { 
        this.currentBlogId = id; 
        this.emit('blogChange', { blogId: id }); 
    }
    
    getCurrentBlogId() { 
        return this.currentBlogId; 
    }

    isInBlogState() {
        return [
            AppStates.BLOG_LOADING, 
            AppStates.TRANSITION_TO_BLOG, 
            AppStates.BLOG,
            AppStates.TRANSITION_TO_BLOG_LOADING
        ].includes(this.currentState);
    }

    isInHomeState() {
        return [
            AppStates.HOME,
            AppStates.TRANSITION_TO_HOME
        ].includes(this.currentState);
    }

    on(event, callback) { 
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback); 
        
        // Return unsubscribe function
        return () => this.off(event, callback);
    }
    
    off(event, callback) { 
        if (!this.listeners.has(event)) return; 
        this.listeners.get(event).delete(callback);
    }
    
    emit(event, data) { 
        if (!this.listeners.has(event)) return; 
        this.listeners.get(event).forEach(cb => {
            try {
                cb(data);
            } catch (e) {
                console.error(`Error in ${event} listener:`, e);
            }
        }); 
    }

    // Remove all listeners for an event
    removeAllListeners(event) {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }
    
    setAssetsLoaded(loaded) { 
        this.assetsLoaded = loaded; 
        this.emit('assetsLoaded', loaded); 
    }
    
    areAssetsLoaded() { 
        return this.assetsLoaded; 
    }

    // Debug helper
    getHistory() {
        return [...this.navigationHistory];
    }
}

export const stateManager = new StateManager();
export default stateManager;
