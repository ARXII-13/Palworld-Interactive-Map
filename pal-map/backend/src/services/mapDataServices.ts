import fs from "fs";
import path from "path";

export interface MapPoint {
    id: string;
    name: string;
    type: string;
    position: MapObjectLocation;
    discovered?: boolean;
    metadata?: Record<string, any>;
}

export interface MapObjectLocation {
    x: number;
    y: number;
    z: number;
}

const DATA_DIR = path.join((process as any).resourcesPath || process.cwd(), "data");

/**
 * Reads and parses JSON safely.
 */
function readJsonFile<T>(filePath: string): T | null {
    try {
        const raw = fs.readFileSync(filePath, "utf8");
        return JSON.parse(raw);
    } catch (err) {
        console.warn(`[MapData] Failed to read: ${filePath}`, err);
        return null;
    }
}

/**
 * Convert raw game coordinate to normalized lat/lng for frontend display.
 */
function convertToLatLng(x: number, y: number, z: number): MapObjectLocation {
    return {
        x: y / 1000, // example scale
        y: x / 1000,
        z: z,
    };
}

/**
 * Load and normalize all map data.
 */
export async function getMapData(): Promise<MapPoint[]> {
    const staticFile = path.join(DATA_DIR, "mapObjects.json");
    const staticData = readJsonFile<any[]>(staticFile) || [];

    const points: MapPoint[] = staticData.map((obj) => ({
        id: obj.id,
        name: obj.label || "Unknown",
        type: obj.type || "Unknown",
        position: convertToLatLng(obj.location.X, obj.location.Y, obj.location.Z),
        discovered: false,
        metadata: {},
    }));

    return points;
}
