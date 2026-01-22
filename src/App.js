/**
 * Main Application Entry Point
 * All documentation and comments are included for clarity.
 */

import stateManager, { AppStates } from './utils/StateManager.js';
import assetLoader from './utils/AssetLoader.js';
import audioManager from './utils/AudioManager.js';
import cursorManager from './utils/CursorManager.js';
import sakuraPetals from './utils/SakuraPetals.js';
import splashScreen from './modules/SplashScreen.js';
import transition from './modules/Transition.js';
import loadingScreen from './modules/LoadingScreen.js';
import homeScreen from './modules/HomeScreen.js';
import navBar from './modules/NavBar.js';

class App {
    constructor() {
        this.assetsToLoad = [
            // Fonts
            { type: 'font', name: 'TheGoldenHeart', src: './src/fonts/Thegoldenheart-Regular.otf' },
            { type: 'font', name: 'Pixeled', src: './src/fonts/Pixeled.ttf' },
            { type: 'font', name: 'Pixel', src: './src/fonts/pixel.ttf' },
            // Images
            { type: 'image', src: './src/assets/bg.png' },
            { type: 'image', src: './src/assets/loading.gif' },
            { type: 'image', src: './src/assets/unity_logo.gif' },
            { type: 'image', src: './src/assets/unity.png' },
            { type: 'image', src: './src/assets/Logo_main.svg' },
            { type: 'image', src: './src/assets/portada.png' },
            { type: 'image', src: './src/assets/menu_bg2x3.gif' },
            { type: 'image', src: './src/assets/Cursor.png' },
            { type: 'image', src: './src/assets/musicon.png' },
            { type: 'image', src: './src/assets/musicoff.png' },
            { type: 'image', src: './src/assets/soundon.png' },
            { type: 'image', src: './src/assets/soundoff.png' },
            { type: 'image', src: './src/assets/arrowLx1.png' },
            { type: 'image', src: './src/assets/barrax3.png' },
            { type: 'image', src: './src/assets/Hud_Cat_marco.png' }
        ];
        
        this.isFirstVisit = this.checkFirstVisit();
        this.shadersReady = false;
    }

    /**
     * Check if this is the user's first visit
     */
    checkFirstVisit() {
        try {
            const visited = localStorage.getItem('thog_visited');
            if (!visited) {
                localStorage.setItem('thog_visited', 'true');
                return true;
            }
            return false;
        } catch {
            return true;
        }
    }

    /**
     * Initialize the application
     */
    async init() {
        // Set up state change listener
        stateManager.on('stateChange', this.handleStateChange.bind(this));
        
        // Initialize cursor (only on non-touch devices)
        cursorManager.init();
        
        // Initialize transition overlay
        transition.init();
        
        // Start the main sequence
        await this.startSequence();
    }

    /**
     * Preload and compile shaders during loading screen
     * This ensures sakura petals are ready when Home appears
     */
    async preloadShaders() {
        try {
            // Wait for shader script elements to be in DOM
            await this.waitForShaderScripts();
            
            // Precompile shaders (doesn't create canvas yet)
            const success = await sakuraPetals.preload();
            this.shadersReady = success;
            
            console.log('Shaders preloaded:', success);
            return success;
        } catch (error) {
            console.error('Shader preload error:', error);
            return false;
        }
    }

    /**
     * Wait for all shader script elements to be available in DOM
     */
    waitForShaderScripts() {
        return new Promise((resolve) => {
            const requiredScripts = [
                'sakura_point_vsh',
                'sakura_point_fsh',
                'fx_common_vsh',
                'bg_fsh',
                'fx_brightbuf_fsh',
                'fx_dirblur_r4_fsh',
                'pp_final_vsh',
                'pp_final_fsh'
            ];
            
            const checkScripts = () => {
                const allPresent = requiredScripts.every(id => {
                    const el = document.getElementById(id);
                    return el && el.textContent.trim().length > 0;
                });
                
                if (allPresent) {
                    resolve(true);
                } else {
                    requestAnimationFrame(checkScripts);
                }
            };
            
            // Start checking
            if (document.readyState === 'complete') {
                checkScripts();
            } else {
                window.addEventListener('load', checkScripts);
            }
        });
    }

    /**
     * Main startup sequence
     */
    async startSequence() {
        // ========== SPLASH SCREEN ==========
        stateManager.setState(AppStates.SPLASH);
        await this.preloadFonts();
        splashScreen.create();
        await splashScreen.play();
        splashScreen.destroy();

        // ========== TRANSITION TO LOADING ==========
        stateManager.setState(AppStates.TRANSITION_TO_LOADING);
        loadingScreen.create();
        await transition.transitionIn();
        await loadingScreen.show();
        stateManager.setState(AppStates.LOADING);
        await transition.transitionOut();

        // ========== LOADING PHASE ==========
        // Load assets AND precompile shaders in parallel
        assetLoader.onProgress((p) => loadingScreen.updateProgress(p));
        
        const [assetsLoaded, shadersLoaded] = await Promise.all([
            this.loadAssets(),
            this.preloadShaders()
        ]);
        
        console.log('Assets loaded:', assetsLoaded, 'Shaders loaded:', shadersLoaded);
        
        // Wait a bit for visual feedback
        await this.delay(this.isFirstVisit ? 2500 : 1200);

        // ========== TRANSITION TO HOME ==========
        stateManager.setState(AppStates.TRANSITION_TO_HOME);
        
        // Create home screen and navbar (sakura petals init here, shaders already compiled)
        navBar.create();
        homeScreen.create();
        
        // Initialize sakura petals BEFORE transition completes
        // This way petals are rendering when the screen is revealed
        homeScreen.initPetals();
        
        await transition.transitionIn();
        loadingScreen.destroy();
        
        // Show elements
        await homeScreen.show();
        await navBar.show();
        
        stateManager.setState(AppStates.HOME);
        await transition.transitionOut();
        
        // Start other animations (logo, subtitle, etc.)
        homeScreen.startAnimations();
    }

    /**
     * Preload fonts for splash screen
     */
    async preloadFonts() {
        const fonts = [
            { name: 'TheGoldenHeart', src: './src/fonts/Thegoldenheart-Regular.otf' },
            { name: 'Pixeled', src: './src/fonts/Pixeled.ttf' },
            { name: 'Pixel', src: './src/fonts/pixel.ttf' }
        ];
        
        await Promise.all(fonts.map(async ({ name, src }) => {
            try {
                const font = new FontFace(name, `url(${src})`);
                const loadedFont = await font.load();
                document.fonts.add(loadedFont);
            } catch (error) {
                console.warn(`Font ${name} failed to load:`, error);
            }
        }));
    }

    /**
     * Load all assets
     */
    async loadAssets() {
        await assetLoader.loadAll(this.assetsToLoad);
        stateManager.setAssetsLoaded(true);
        return true;
    }

    /**
     * Utility delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Handle state changes
     */
    handleStateChange({ current }) {
        document.body.setAttribute('data-state', current);
    }
}

// Create and initialize app
const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());

export default app;
