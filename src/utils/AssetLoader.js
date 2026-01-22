/**
 * AssetLoader - Asset Loading Manager
 * The Heart of Gold
 */

class AssetLoader {
    constructor() {
        this.cache = new Map();
        this.loadingProgress = 0;
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.listeners = [];
    }

    /**
     * Subscribe to progress updates
     */
    onProgress(callback) {
        this.listeners.push(callback);
    }

    /**
     * Notify listeners of progress
     */
    notifyProgress() {
        const progress = this.totalAssets > 0 
            ? (this.loadedAssets / this.totalAssets) * 100 
            : 0;
        this.loadingProgress = progress;
        
        this.listeners.forEach(cb => {
            cb(progress, this.loadedAssets, this.totalAssets);
        });
    }

    /**
     * Load an image
     */
    loadImage(src) {
        return new Promise((resolve) => {
            // Check cache
            if (this.cache.has(src)) {
                this.loadedAssets++;
                this.notifyProgress();
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
            
            img.onerror = () => {
                console.warn(`Failed to load image: ${src}`);
                this.loadedAssets++;
                this.notifyProgress();
                resolve(null);
            };
            
            img.src = src;
        });
    }

    /**
     * Load a font
     */
    loadFont(name, url) {
        return new Promise((resolve) => {
            // Check if already loaded
            if (document.fonts.check(`12px "${name}"`)) {
                this.loadedAssets++;
                this.notifyProgress();
                resolve(true);
                return;
            }

            const font = new FontFace(name, `url(${url})`);
            
            font.load()
                .then(loadedFont => {
                    document.fonts.add(loadedFont);
                    this.loadedAssets++;
                    this.notifyProgress();
                    resolve(loadedFont);
                })
                .catch((error) => {
                    console.warn(`Failed to load font ${name}:`, error);
                    this.loadedAssets++;
                    this.notifyProgress();
                    resolve(null);
                });
        });
    }

    /**
     * Load all assets
     */
    async loadAll(assets) {
        this.totalAssets = assets.length;
        this.loadedAssets = 0;
        this.notifyProgress();

        // Load in batches for better performance
        const batchSize = 5;
        
        for (let i = 0; i < assets.length; i += batchSize) {
            const batch = assets.slice(i, i + batchSize);
            
            await Promise.all(batch.map(asset => {
                if (asset.type === 'image') {
                    return this.loadImage(asset.src);
                } else if (asset.type === 'font') {
                    return this.loadFont(asset.name, asset.src);
                }
                return Promise.resolve();
            }));
        }

        return true;
    }

    /**
     * Get current progress
     */
    getProgress() {
        return this.loadingProgress;
    }

    /**
     * Get a cached asset
     */
    get(src) {
        return this.cache.get(src);
    }

    /**
     * Clear the cache
     */
    clearCache() {
        this.cache.clear();
    }
}

export const assetLoader = new AssetLoader();
export default assetLoader;
