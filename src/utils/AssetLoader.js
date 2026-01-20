/**
 * AssetLoader - Precarga y cachea assets del juego
 */

class AssetLoader {
    constructor() {
        this.cache = new Map();
        this.loadingProgress = 0;
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.listeners = [];
    }

    onProgress(callback) {
        this.listeners.push(callback);
    }

    notifyProgress() {
        const progress = this.totalAssets > 0 
            ? (this.loadedAssets / this.totalAssets) * 100 
            : 0;
        this.loadingProgress = progress;
        this.listeners.forEach(cb => cb(progress, this.loadedAssets, this.totalAssets));
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            if (this.cache.has(src)) {
                resolve(this.cache.get(src));
                return;
            }

            const img = new Image();
            img.onload = () => {
                this.cache.set(src, img);
                this.loadedAssets++;
                this.notifyProgress();
                resolve(img);
            };
            img.onerror = () => reject(new Error(`Failed to load: ${src}`));
            img.src = src;
        });
    }

    loadFont(name, url) {
        return new Promise((resolve, reject) => {
            const font = new FontFace(name, `url(${url})`);
            font.load()
                .then(loadedFont => {
                    document.fonts.add(loadedFont);
                    this.loadedAssets++;
                    this.notifyProgress();
                    resolve(loadedFont);
                })
                .catch(reject);
        });
    }

    async loadAll(assets) {
        this.totalAssets = assets.length;
        this.loadedAssets = 0;
        this.notifyProgress();

        const promises = assets.map(asset => {
            if (asset.type === 'image') {
                return this.loadImage(asset.src);
            } else if (asset.type === 'font') {
                return this.loadFont(asset.name, asset.src);
            }
            return Promise.resolve();
        });

        try {
            await Promise.all(promises);
            return true;
        } catch (error) {
            console.error('Asset loading error:', error);
            return false;
        }
    }

    getProgress() {
        return this.loadingProgress;
    }
}

export const assetLoader = new AssetLoader();
export default assetLoader;
