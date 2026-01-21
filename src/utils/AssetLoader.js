class AssetLoader {
    constructor() {
        this.cache = new Map();
        this.loadingProgress = 0;
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.listeners = [];
    }

    onProgress(callback) { this.listeners.push(callback); }
    notifyProgress() {
        const progress = this.totalAssets > 0 ? (this.loadedAssets / this.totalAssets) * 100 : 0;
        this.loadingProgress = progress;
        this.listeners.forEach(cb => cb(progress, this.loadedAssets, this.totalAssets));
    }

    loadImage(src) {
        return new Promise((resolve) => {
            if (this.cache.has(src)) { this.loadedAssets++; this.notifyProgress(); resolve(this.cache.get(src)); return; }
            const img = new Image();
            img.onload = () => { this.cache.set(src, img); this.loadedAssets++; this.notifyProgress(); resolve(img); };
            img.onerror = () => { this.loadedAssets++; this.notifyProgress(); resolve(null); };
            img.src = src;
        });
    }

    loadFont(name, url) {
        return new Promise((resolve) => {
            if (document.fonts.check(`12px "${name}"`)) { this.loadedAssets++; this.notifyProgress(); resolve(true); return; }
            const font = new FontFace(name, `url(${url})`);
            font.load().then(loaded => { document.fonts.add(loaded); this.loadedAssets++; this.notifyProgress(); resolve(loaded); })
                .catch(() => { this.loadedAssets++; this.notifyProgress(); resolve(null); });
        });
    }

    async loadAll(assets) {
        this.totalAssets = assets.length;
        this.loadedAssets = 0;
        this.notifyProgress();
        const batchSize = 5;
        for (let i = 0; i < assets.length; i += batchSize) {
            await Promise.all(assets.slice(i, i + batchSize).map(a => a.type === 'image' ? this.loadImage(a.src) : a.type === 'font' ? this.loadFont(a.name, a.src) : Promise.resolve()));
        }
        return true;
    }
    getProgress() { return this.loadingProgress; }
    get(src) { return this.cache.get(src); }
}

export const assetLoader = new AssetLoader();
export default assetLoader;
