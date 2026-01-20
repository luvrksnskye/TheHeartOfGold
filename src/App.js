/**
 * App - Controlador principal de la aplicacion
 */

import stateManager, { AppStates } from './utils/StateManager.js';
import assetLoader from './utils/AssetLoader.js';
import audioManager from './utils/AudioManager.js';
import cursorManager from './utils/CursorManager.js';
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
            { type: 'image', src: './src/assets/transition_01_in.png' },
            { type: 'image', src: './src/assets/unity_logo.gif' },
            { type: 'image', src: './src/assets/unity.png' },
            { type: 'image', src: './src/assets/Logo_main.svg' },
            { type: 'image', src: './src/assets/menu_bg2x3.gif' },
            { type: 'image', src: './src/assets/Cursor.png' },
            { type: 'image', src: './src/assets/musicon.png' },
            { type: 'image', src: './src/assets/musicoff.png' },
            { type: 'image', src: './src/assets/soundon.png' },
            { type: 'image', src: './src/assets/soundoff.png' }
        ];
        this.isFirstVisit = this.checkFirstVisit();
    }

    checkFirstVisit() {
        try {
            const visited = localStorage.getItem('hasVisited');
            if (!visited) {
                localStorage.setItem('hasVisited', 'true');
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
        
        await this.startSequence();
    }

    async startSequence() {
        stateManager.setState(AppStates.SPLASH);
        
        await this.preloadFonts();
        
        splashScreen.create();
        await splashScreen.play();
        splashScreen.destroy();
        
        stateManager.setState(AppStates.TRANSITION_TO_LOADING);
        
        loadingScreen.create();
        
        await transition.transitionIn();
        await loadingScreen.show();
        
        stateManager.setState(AppStates.LOADING);
        
        await transition.transitionOut();
        
        assetLoader.onProgress((progress) => {
            loadingScreen.updateProgress(progress);
        });
        
        await this.loadAssets();
        
        const minLoadTime = this.isFirstVisit ? 40000 : 2000;
        await this.delay(minLoadTime);
        
        stateManager.setState(AppStates.TRANSITION_TO_HOME);
        
        navBar.create();
        homeScreen.create();
        
        await transition.transitionIn();
        loadingScreen.destroy();
        await homeScreen.show();
        await navBar.show();
        
        stateManager.setState(AppStates.HOME);
        
        await transition.transitionOut();
    }

    async preloadFonts() {
        const fonts = [
            { name: 'TheGoldenHeart', src: './src/fonts/Thegoldenheart-Regular.otf' },
            { name: 'Pixeled', src: './src/fonts/Pixeled.ttf' },
            { name: 'Pixel', src: './src/fonts/pixel.ttf' }
        ];

        const promises = fonts.map(async ({ name, src }) => {
            try {
                const font = new FontFace(name, `url(${src})`);
                const loadedFont = await font.load();
                document.fonts.add(loadedFont);
            } catch (error) {
                console.warn(`Font ${name} preload failed:`, error);
            }
        });

        await Promise.all(promises);
    }

    async loadAssets() {
        await assetLoader.loadAll(this.assetsToLoad);
        stateManager.setAssetsLoaded(true);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    handleStateChange({ current, previous }) {
        document.body.setAttribute('data-state', current);
    }
}

const app = new App();

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

export default app;
