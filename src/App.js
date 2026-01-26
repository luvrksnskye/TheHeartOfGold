/**
 * Main Application Entry Point
 * The Heart of Gold
 * Updated: SFX Manager integration
 */

import stateManager, { AppStates } from './utils/StateManager.js';
import assetLoader from './utils/AssetLoader.js';
import audioManager from './utils/AudioManager.js';
import sfxManager from './utils/SFXManager.js';
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
            { type: 'font', name: 'TheGoldenHeart', src: './src/fonts/Thegoldenheart-Regular.otf' },
            { type: 'font', name: 'Pixeled', src: './src/fonts/Pixeled.ttf' },
            { type: 'font', name: 'Pixel', src: './src/fonts/pixel.ttf' },
            { type: 'image', src: './src/assets/bg.png' },
            { type: 'image', src: './src/assets/loading.gif' },
            { type: 'image', src: './src/assets/unity_logo.gif' },
            { type: 'image', src: './src/assets/unity.png' },
            { type: 'image', src: './src/assets/Logo_main.svg' },
            { type: 'image', src: './src/assets/portada.png' },
            { type: 'image', src: './src/assets/Cursor.png' },
            { type: 'image', src: './src/assets/musicon.png' },
            { type: 'image', src: './src/assets/musicoff.png' },
            { type: 'image', src: './src/assets/soundon.png' },
            { type: 'image', src: './src/assets/soundoff.png' },
            { type: 'image', src: './src/assets/arrowLx1.png' },
            { type: 'image', src: './src/assets/barrax3.png' },
            { type: 'image', src: './src/assets/Hud_Cat_marco.png' },
            { type: 'image', src: './src/assets/indicador.png' },
            { type: 'image', src: './src/assets/Opts.png' }
        ];
        
        this.isFirstVisit = this.checkFirstVisit();
        this.shadersReady = false;
    }

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

    async init() {
        stateManager.on('stateChange', this.handleStateChange.bind(this));
        cursorManager.init();
        transition.init();
        
        // Preload SFX
        sfxManager.preload();
        
        await this.startSequence();
    }

    async preloadShaders() {
        try {
            await this.waitForShaderScripts();
            const success = await sakuraPetals.preload();
            this.shadersReady = success;
            return success;
        } catch (error) {
            console.error('Shader preload error:', error);
            return false;
        }
    }

    waitForShaderScripts() {
        return new Promise((resolve) => {
            const requiredScripts = [
                'sakura_point_vsh', 'sakura_point_fsh', 'fx_common_vsh',
                'bg_fsh', 'fx_brightbuf_fsh', 'fx_dirblur_r4_fsh',
                'pp_final_vsh', 'pp_final_fsh'
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
            
            if (document.readyState === 'complete') {
                checkScripts();
            } else {
                window.addEventListener('load', checkScripts);
            }
        });
    }

    async startSequence() {
        // Splash Screen
        stateManager.setState(AppStates.SPLASH);
        await this.preloadFonts();
        splashScreen.create();
        await splashScreen.play();
        splashScreen.destroy();

        // Transition to Loading
        stateManager.setState(AppStates.TRANSITION_TO_LOADING);
        loadingScreen.create();
        await transition.transitionIn();
        await loadingScreen.show();
        stateManager.setState(AppStates.LOADING);
        await transition.transitionOut();

        // Loading Phase
        assetLoader.onProgress((p) => loadingScreen.updateProgress(p));
        
        const [assetsLoaded, shadersLoaded] = await Promise.all([
            this.loadAssets(),
            this.preloadShaders()
        ]);
        
        await this.delay(this.isFirstVisit ? 2500 : 1200);

        // Transition to Home
        stateManager.setState(AppStates.TRANSITION_TO_HOME);
        
        navBar.create();
        homeScreen.create();
        homeScreen.initPetals();
        
        await transition.transitionIn();
        loadingScreen.destroy();
        
        await homeScreen.show();
        await navBar.show();
        
        stateManager.setState(AppStates.HOME);
        await transition.transitionOut();
        
        homeScreen.startAnimations();
    }

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

    async loadAssets() {
        await assetLoader.loadAll(this.assetsToLoad);
        stateManager.setAssetsLoaded(true);
        return true;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    handleStateChange({ current }) {
        document.body.setAttribute('data-state', current);
    }
}

const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());

export default app;
