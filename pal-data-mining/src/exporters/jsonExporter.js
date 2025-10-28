import fs from "fs";
import path from "path";
import logger from "../utils/logger.js";

export function exportJson(data, outDir) {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, "mapObjects.json");
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
    logger.success(`Exported ${data.length} items to ${outPath}`);
}
