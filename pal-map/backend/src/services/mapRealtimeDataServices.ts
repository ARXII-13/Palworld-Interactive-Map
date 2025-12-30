import path from "path";
import fs from "fs";
import logger from "../utils/logger.js";
import { MapPoint } from "../types/mapPoint.js";

/**
 * Read and parse a Palworld ue4ss actor CSV file into MapPoint objects.
 */
export function readCsvFile(filePath: string): MapPoint[] | null {
    if (!fs.existsSync(filePath)) {
        logger.error("CSV file not found:", filePath);
        return null;
    }
    const filePattern = /-ue4ss_actor_data\.csv$/;

    const latestFile = findLatestFile(filePath, filePattern);
    if (!latestFile) {
        logger.error("No matching CSV files found in directory:", filePath);
        return null;
    }

    const content = fs.readFileSync(latestFile, "utf-8");
    const lines = content.split(/\r?\n/);

    const results: MapPoint[] = [];

    // Regex patterns
    const treasureRegex = /BP_PalMapObjectSpawner_Treasure_Grass_Grade_01/i;

    const palEggRegex = /BP_MapObject_PickupItem_PalEgg_([A-Za-z0-9]+)/i;

    const positionRegex = /\(X=([-0-9.]+),Y=([-0-9.]+),Z=([-0-9.]+)\)/;

    for (const line of lines) {
        if (!line.startsWith("Row_")) continue;

        // Filter by blueprint
        const isTreasure = treasureRegex.test(line);
        const eggMatch = line.match(palEggRegex);

        if (!isTreasure && !eggMatch) continue;

        // Extract position
        const posMatch = line.match(positionRegex);
        if (!posMatch) continue;

        const [, x, y, z] = posMatch;

        let type = "unknown";
        let name = "Unknown";

        if (isTreasure) {
            type = "treasure";
            name = "Treasure Chest";
        } else if (eggMatch) {
            type = "egg";
            name = `Pal Egg (${eggMatch[1]})`;
        }

        results.push({
            id: line.split(",")[0],
            name,
            type,
            position: {
                x: parseFloat(x),
                y: parseFloat(y),
                z: parseFloat(z),
            },
        });
    }

    return results;
}

function findLatestFile(dir: string, pattern: RegExp): string | null {
    const files = fs
        .readdirSync(dir)
        .map((fileName) => {
            const fullPath = path.join(dir, fileName);
            const stats = fs.statSync(fullPath);
            return { fullPath, mtime: stats.mtime.getTime(), fileName };
        })
        .filter(({ fileName }) => pattern.test(fileName))
        .sort((a, b) => b.mtime - a.mtime);

    if (files.length === 0) return null;
    return files[0].fullPath;
}

/**
 * Load and normalize all map real time data.
 */
export async function getMapRealtimeData(ue4ssFolder: string): Promise<MapPoint[]> {
    const staticData = readCsvFile(ue4ssFolder) || [];

    const points: MapPoint[] = staticData.map((obj) => ({
        id: obj.id,
        name: obj.name || "Unknown",
        type: obj.type || "Unknown",
        position: obj.position,
        discovered: false,
        metadata: {},
    }));

    return points;
}
