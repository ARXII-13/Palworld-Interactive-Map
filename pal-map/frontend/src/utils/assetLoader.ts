type AssetType = "json" | "image" | "svg" | "webp";

export const ASSET_PATH = "../assets";

class AssetLoader {
    private cache: Record<string, any> = {};
    private jsonGlob = import.meta.glob(`../assets/**/*.json`, { eager: true });
    private webpGlob = import.meta.glob(`../assets/**/*.webp`, {
        eager: true,
        query: "?url",
        import: "default",
    });
    private unknownIcon = this.loadImage(`${ASSET_PATH}/img/unknown.webp`);

    load<T>(path: string, type: AssetType): T | undefined {
        if (this.cache[path]) {
            return this.cache[path];
        }

        let glob;
        switch (type) {
            case "json":
                glob = this.jsonGlob;
                break;
            case "webp":
                glob = this.webpGlob;
                break;
            default:
                throw new Error(`Unsupported asset type: ${type}`);
        }

        if (!glob[path]) {
            console.error(`Asset not found: ${type} ${path}`);
            return undefined;
        }

        this.cache[path] = glob[path];
        return this.cache[path];
    }

    loadImage(path: string, type: AssetType = "webp"): string {
        if (!path) return this.unknownIcon;
        return this.load<any>(path.replaceAll(" ", "_"), type);
    }
}

export const assetLoader = new AssetLoader();
