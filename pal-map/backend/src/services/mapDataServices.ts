import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import logger from "../utils/logger.js";
import { MapObjectLocation, MapPoint } from "../types/mapPoint.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, "../assets");

/**
 * Reads and parses JSON safely.
 */
function readJsonFile<T>(filePath: string): T | null {
    try {
        const raw = fs.readFileSync(filePath, "utf8");
        return JSON.parse(raw);
    } catch (err) {
        logger.warn(`[MapData] Failed to read: ${filePath}: ${err}`);
        return null;
    }
}

/**
 * Convert raw game coordinate to normalized lat/lng for frontend display.
 */
function convertToLatLng(x: number, y: number, z: number): MapObjectLocation {
    return {
        x: x,
        y: y,
        z: z,
    };
}

/**
 * Load and normalize all map data.
 */
export async function getMapData(): Promise<MapPoint[]> {
    const staticFile = join(DATA_DIR, "mapObjects.json");
    const staticData = readJsonFile<any[]>(staticFile) || [];

    const points: MapPoint[] = staticData.map((obj) => ({
        id: obj.id,
        name: obj.label || "Unknown",
        type: obj.type || "Unknown",
        position: convertToLatLng(obj.location.X, obj.location.Y, obj.location.Z),
        discovered: false,
        canBeDiscovered: true,
        metadata: {},
    }));

    return points;
}
