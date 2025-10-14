import { loadConfig } from "./config.js";
import { loadJsonFiles } from "./loaders/fileLoader.js";
import { parseFastTravelData } from "./parsers/fastTravelParser.js";
import { exportJson } from "./exporters/jsonExporter.js";
import logger from "./utils/logger.js";

async function main() {
    const config = loadConfig();
    logger.info("Starting Palworld data mining...");

    const rawFiles = loadJsonFiles(config.DATA_DIR, config.LANGUAGE);
    const parsed = parseFastTravelData(rawFiles);

    exportJson(parsed, config.OUTPUT_DIR);
}

main().catch((err) => logger.error(err));
